import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getAllChats,
  getMessages,
  saveMessage,
  getInstructors,
  getStudents,
  markMessagesAsRead,
  countUnreadFromSender,
  deleteConversationMessages,
  countUnreadMessages,
  softDeleteConversationForUser,
} from '../services/chat.service';
import { onlineUsers } from '../utils/onlineUsers';
import { RequestWithCourseID } from '../helpers/lesson.helper';
import { ILike } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserRole } from '../enums/UserRole';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const chatIndexGet = asyncHandler(
  async (req: Request, res: Response) => {
    const userSession = req.session.user!;
    const userId = userSession.id;
    // load all existing chat partners and potential partners
    const rawChats = await getAllChats(userId);
    // also load potential partners (students for instructors, instructors for students)
    let instructors: User[] = [];
    if (userSession.role === UserRole.INSTRUCTOR) {
      instructors = await getStudents();
    } else {
      instructors = await getInstructors();
    }
    // auto-redirect students to first conversation
    if (userSession.role !== UserRole.INSTRUCTOR) {
      if (rawChats.length > 0) {
        return res.redirect(`/chat/${rawChats[0].userId}`);
      }
      // do not auto-redirect to instructors when no chat history
    }
    // attach unread count and compute relative time per partner
    const chats = await Promise.all(
      rawChats.map(async chat => {
        const unreadCount = await countUnreadFromSender(userId, chat.userId);
        const now = new Date();
        const chatTime = new Date(chat.timestamp);
        const diffSeconds = Math.floor(
          (now.getTime() - chatTime.getTime()) / 1000
        );
        let relativeTime;
        if (diffSeconds < 60) {
          relativeTime = req.t('common.secondsAgo', { count: diffSeconds });
        } else if (diffSeconds < 3600) {
          relativeTime = req.t('common.minutesAgo', {
            count: Math.floor(diffSeconds / 60),
          });
        } else if (diffSeconds < 86400) {
          relativeTime = req.t('common.hoursAgo', {
            count: Math.floor(diffSeconds / 3600),
          });
        } else if (diffSeconds < 2592000) {
          relativeTime = req.t('common.daysAgo', {
            count: Math.floor(diffSeconds / 86400),
          });
        } else if (diffSeconds < 31536000) {
          relativeTime = req.t('common.monthsAgo', {
            count: Math.floor(diffSeconds / 2592000),
          });
        } else {
          relativeTime = req.t('common.yearsAgo', {
            count: Math.floor(diffSeconds / 31536000),
          });
        }
        return { ...chat, unreadCount, relativeTime };
      })
    );
    res.render('chat/index', {
      chats,
      instructors,
      currentUserId: userId,
      selectedPartner: null,
      messages: [],
    });
  }
);

export const chatGet = asyncHandler(async (req: Request, res: Response) => {
  const userSession = req.session.user!;
  const userId = userSession.id;
  const partnerId = req.params.userId;
  // update read status
  await markMessagesAsRead(userId, partnerId);
  const rawChats = await getAllChats(userId);
  const chats = await Promise.all(
    rawChats.map(async chat => {
      const unreadCount = await countUnreadFromSender(userId, chat.userId);
      const now = new Date();
      const chatTime = new Date(chat.timestamp);
      const diffSeconds = Math.floor(
        (now.getTime() - chatTime.getTime()) / 1000
      );
      let relativeTime;
      if (diffSeconds < 60) {
        relativeTime = req.t('common.secondsAgo', { count: diffSeconds });
      } else if (diffSeconds < 3600) {
        relativeTime = req.t('common.minutesAgo', {
          count: Math.floor(diffSeconds / 60),
        });
      } else if (diffSeconds < 86400) {
        relativeTime = req.t('common.hoursAgo', {
          count: Math.floor(diffSeconds / 3600),
        });
      } else if (diffSeconds < 2592000) {
        relativeTime = req.t('common.daysAgo', {
          count: Math.floor(diffSeconds / 86400),
        });
      } else if (diffSeconds < 31536000) {
        relativeTime = req.t('common.monthsAgo', {
          count: Math.floor(diffSeconds / 2592000),
        });
      } else {
        relativeTime = req.t('common.yearsAgo', {
          count: Math.floor(diffSeconds / 31536000),
        });
      }
      return { ...chat, unreadCount, relativeTime };
    })
  );
  let partners: User[] = [];
  if (userSession.role === UserRole.INSTRUCTOR) {
    partners = await getStudents();
  } else {
    partners = await getInstructors();
  }
  // load messages in chronological order (oldest first)
  const messages = await getMessages(userId, partnerId);
  let selectedPartner = partners.find(p => p.id === partnerId) || null;
  if (!selectedPartner) {
    selectedPartner = {
      id: partnerId,
      name: 'Không tìm thấy người dùng',
      avatar_url: '',
      email: '',
      hash_password: '',
      role: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Thêm các trường khác nếu cần thiết để tránh lỗi render
    } as any;
  }
  const isPartnerOnline = onlineUsers.has(partnerId);
  res.render('chat/index', {
    chats,
    instructors: partners,
    currentUserId: userId,
    selectedPartner,
    messages,
    isPartnerOnline,
    keyword: '',
  });
});

export const chatMessagesGet = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.user!.id;
    const partnerId = req.params.userId;
    const before = req.query.before
      ? new Date(req.query.before as string)
      : undefined;
    const limit = parseInt(req.query.limit as string) || 20;
    const messages = await getMessages(userId, partnerId, { before, limit });
    res.json(messages);
  }
);

export const chatPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user!.id;
  const partnerId = req.params.userId;
  const content = (req.body.content as string) || '';
  // handle image upload if provided
  let imageUrl: string | undefined;
  if ((req as any).file) {
    const result = await cloudinary.uploader.upload((req as any).file.path);
    imageUrl = result.secure_url;
    await fs.promises.unlink((req as any).file.path);
  }
  const savedMsg = await saveMessage(userId, partnerId, content, imageUrl);
  // If AJAX request, return JSON
  const accept = req.headers.accept || '';
  if (accept.includes('application/json')) {
    res.json(savedMsg);
    return;
  }
  // otherwise redirect
  res.redirect(`/chat/${partnerId}`);
});

// Soft-delete entire conversation for current user
export const chatDeletePost = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.session.user!.id;
    const partnerId = req.params.userId;
    // mark messages deleted for this user
    await softDeleteConversationForUser(userId, partnerId);
    // redirect to clear selection
    res.redirect('/chat');
  }
);

export const chatMarkReadPost = asyncHandler(
  async (req: Request, res: Response) => {
    const userSession = req.session.user!;
    const userId = userSession.id;
    const partnerId = req.params.userId;
    // mark all messages from this partner as read for the current user
    await markMessagesAsRead(userId, partnerId);
    // get updated total unread count
    const newCount = await countUnreadMessages(userId);
    res.json({ unreadCount: newCount });
  }
);
