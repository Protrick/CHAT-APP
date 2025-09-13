import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// Get all users except the logged-in user + unseen message count
export const getusersFromSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};

    const promises = users.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({
      success: true,
      users,
      unseenMessages,
    });
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get all messages between current user and selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    })
      .populate("senderId", "fullname profilepic")
      .populate("receiverId", "fullname profilepic")
      .sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Mark a single message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    res.json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    console.error("Mark Message Seen Error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Send new message (text or image)
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "fullname profilepic")
      .populate("receiverId", "fullname profilepic");

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    res.json({
      success: true,
      newMessage: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
