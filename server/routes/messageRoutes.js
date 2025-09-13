import express from 'express';
import { getMessages, getusersFromSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getusersFromSidebar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.get('/mark:id', protectRoute, markMessageAsSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage);

export default messageRouter;
