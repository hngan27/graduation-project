import { AppDataSource } from '../config/data-source';
import { In } from 'typeorm';
import { ChatMessage } from '../entity/chatMessage.entity';
import { User } from '../entity/user.entity';
import { UserRole } from '../enums/UserRole';

const chatRepo = AppDataSource.getRepository(ChatMessage);
const userRepo = AppDataSource.getRepository(User);

export const getChatPartners = async (userId: string): Promise<User[]> => {
  const rows = await chatRepo
    .createQueryBuilder('msg')
    .select(['msg.senderId', 'msg.recipientId'])
    .where('msg.senderId = :userId OR msg.recipientId = :userId', { userId })
    .getRawMany();
  const partnerIds = new Set<string>();
  rows.forEach(r => {
    if (r.msg_senderId !== userId) partnerIds.add(r.msg_senderId);
    if (r.msg_recipientId !== userId) partnerIds.add(r.msg_recipientId);
  });
  if (partnerIds.size === 0) return [];
  return userRepo.find({ where: { id: In(Array.from(partnerIds)) } });
};

// Get messages between two users, with optional pagination (before timestamp and limit)
export const getMessages = async (
  userId: string,
  partnerId: string,
  options?: { before?: Date; limit?: number }
): Promise<ChatMessage[]> => {
  const limit = options?.limit ?? Number.MAX_SAFE_INTEGER;
  let qb = chatRepo
    .createQueryBuilder('msg')
    .leftJoinAndSelect(
      'msg.sender',
      'sender',
      'BINARY sender.id = BINARY msg.senderId'
    )
    .leftJoinAndSelect(
      'msg.recipient',
      'recipient',
      'BINARY recipient.id = BINARY msg.recipientId'
    )
    .where(
      '((BINARY msg.senderId = BINARY :userId AND BINARY msg.recipientId = BINARY :partnerId AND msg.deletedBySender = false) OR (BINARY msg.senderId = BINARY :partnerId AND BINARY msg.recipientId = BINARY :userId AND msg.deletedByRecipient = false))',
      { userId, partnerId }
    )
    .orderBy('msg.createdAt', 'DESC')
    .limit(limit);
  if (options?.before) {
    qb = qb.andWhere('msg.createdAt < :before', { before: options.before });
  }
  const messagesDesc = await qb.getMany();
  // reverse to chronological order
  return messagesDesc.reverse();
};

// Save a chat message with optional text content and image URL
export const saveMessage = async (
  senderId: string,
  recipientId: string,
  content?: string,
  imageUrl?: string
): Promise<ChatMessage> => {
  const msg = new ChatMessage({ content: content || '', imageUrl });
  msg.sender = { id: senderId } as any;
  msg.recipient = { id: recipientId } as any;
  return chatRepo.save(msg);
};

// Count unread messages for a user
export const countUnreadMessages = async (userId: string): Promise<number> => {
  // count distinct senders who have unread, non-deleted messages for this user
  const raw = await chatRepo
    .createQueryBuilder('msg')
    .select('msg.senderId')
    .where(
      'msg.recipientId = :userId AND msg.isRead = false AND msg.deletedByRecipient = false',
      { userId }
    )
    .distinct(true)
    .getRawMany();
  return raw.length;
};

// Count unread messages from a specific sender to a recipient
export const countUnreadFromSender = async (
  recipientId: string,
  senderId: string
): Promise<number> => {
  // count unread non-deleted messages from sender for recipient, show as 1 if any
  const count = await chatRepo.count({
    where: { recipientId, senderId, isRead: false, deletedByRecipient: false },
  });
  return count > 0 ? 1 : 0;
};

// Mark messages from a specific sender as read for a recipient
export const markMessagesAsRead = async (
  recipientId: string,
  senderId: string
): Promise<void> => {
  await chatRepo
    .createQueryBuilder()
    .update(ChatMessage)
    .set({ isRead: true })
    .where(
      'senderId = :senderId AND recipientId = :recipientId AND isRead = false',
      {
        senderId,
        recipientId,
      }
    )
    .execute();
};

// Delete all messages between two users
export const deleteConversationMessages = async (
  userId: string,
  partnerId: string
): Promise<void> => {
  // hard delete – not used for soft delete behavior
  await chatRepo
    .createQueryBuilder()
    .delete()
    .where(
      '(senderId = :userId AND recipientId = :partnerId) OR (senderId = :partnerId AND recipientId = :userId)',
      { userId, partnerId }
    )
    .execute();
};

export const getInstructors = async (): Promise<User[]> => {
  return userRepo.find({ where: { role: UserRole.INSTRUCTOR } });
};

export const getStudents = async (): Promise<User[]> => {
  return userRepo.find({ where: { role: UserRole.STUDENT } });
};

// API: Get all recent chats for a user with last message
export interface ChatSummary {
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastImageUrl?: string;
  timestamp: Date;
  lastSenderId: string;
}
export const getAllChats = async (userId: string): Promise<ChatSummary[]> => {
  const messages = await chatRepo
    .createQueryBuilder('msg')
    .leftJoinAndSelect(
      'msg.sender',
      'sender',
      'BINARY sender.id = BINARY msg.senderId'
    )
    .leftJoinAndSelect(
      'msg.recipient',
      'recipient',
      'BINARY recipient.id = BINARY msg.recipientId'
    )
    .where(
      '((msg.senderId = :userId AND msg.deletedBySender = false) OR (msg.recipientId = :userId AND msg.deletedByRecipient = false))',
      { userId }
    )
    .orderBy('msg.createdAt', 'DESC')
    .getMany();

  const chatsMap: Record<string, ChatSummary> = {};
  messages.forEach(message => {
    let other = null;
    let otherId = '';
    // Determine the conversation partner
    if (message.sender && message.sender.id === userId) {
      other = message.recipient;
      otherId = message.recipient ? message.recipient.id : message.recipientId;
    } else {
      other = message.sender;
      otherId = message.sender ? message.sender.id : message.senderId;
    }
    // Only record the first (most recent) message per partner
    if (!chatsMap[otherId]) {
      chatsMap[otherId] = {
        userId: otherId,
        userName: other ? other.name : 'Không tìm thấy người dùng',
        userAvatar: other && other.avatar_url ? other.avatar_url : '',
        lastMessage: message.content,
        lastImageUrl: message.imageUrl || undefined,
        timestamp: message.createdAt,
        // record who sent this last message
        lastSenderId: message.sender ? message.sender.id : message.senderId,
      };
    }
  });
  // sort chats by most recent message timestamp descending
  const summaries = Object.values(chatsMap);
  summaries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  return summaries;
};

// Soft-delete conversation for a specific user
export const softDeleteConversationForUser = async (
  userId: string,
  partnerId: string
): Promise<void> => {
  // mark messages sent by this user as deleted for sender
  await chatRepo
    .createQueryBuilder()
    .update(ChatMessage)
    .set({ deletedBySender: true })
    .where('senderId = :userId AND recipientId = :partnerId', {
      userId,
      partnerId,
    })
    .execute();
  // mark messages received by this user as deleted for recipient
  await chatRepo
    .createQueryBuilder()
    .update(ChatMessage)
    .set({ deletedByRecipient: true })
    .where('senderId = :partnerId AND recipientId = :userId', {
      userId,
      partnerId,
    })
    .execute();
};
