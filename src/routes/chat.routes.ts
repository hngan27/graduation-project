import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { requireUser } from '../middleware/require-user.middleware';
import * as chatController from '../controllers/chat.controller';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();
router.use(requireUser);

// Chat list
router.get('/', chatController.chatIndexGet);
// Load older messages via AJAX
router.get('/:userId/messages', chatController.chatMessagesGet);
// Chat with a partner
router.get('/:userId', chatController.chatGet);
// Delete entire conversation
router.post('/:userId/delete', chatController.chatDeletePost);
// Send a message (text or image)
router.post('/:userId', upload.single('image'), chatController.chatPost);
// Mark messages from a partner as read (AJAX)
router.post('/:userId/read', chatController.chatMarkReadPost);

export default router;
