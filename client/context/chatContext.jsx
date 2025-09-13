import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./authContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState(null);

    const { socket, axios } = useContext(AuthContext);

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prev) => [...prev, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseen) => ({
                    ...prevUnseen,
                    [newMessage.senderId]: prevUnseen?.[newMessage.senderId]
                        ? prevUnseen[newMessage.senderId] + 1
                        : 1,
                }));
            }
        });
    };

    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    };

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        };
    }, [socket, selectedUser]);

    const value = {
        messages,
        getMessages,
        users,
        getUsers,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        sendMessage,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
