import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.baseURL = backendUrl;

    // ✅ Important: Enable sending cookies / credentials
    axios.defaults.withCredentials = true;

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            checkAuth();
        }
    }, [token]);

    const checkAuth = async () => {
        if (!token) return;
        try {
            const res = await axios.get("/api/auth/check");
            const data = res.data;
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            console.log("Auth check failed");
        }
    };

    const login = async (state, credentials) => {
        try {
            const res = await axios.post(`/api/auth/${state}`, credentials);
            const data = res.data;

            if (data.success) {
                setAuthUser(data.userData);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
                connectSocket(data.userData);
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login/signup error");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        axios.defaults.headers.common["Authorization"] = null;
        toast.success("Logged out successfully");
    };

    const updateProfile = async (userData) => {
        try {
            const res = await axios.put("/api/auth/update-profile", {
                fullname: userData.fullname,
                bio: userData.bio,
                profilepic: userData.profilepic,
            });

            const data = res.data;

            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false };
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Profile update failed");
            return { success: false };
        }
    };

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: { userId: userData._id },
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            console.log("Online users received:", userIds);
            setOnlineUsers(userIds);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        setSocket(newSocket);
    };

    return (
        <AuthContext.Provider
            value={{
                axios,
                authUser,
                onlineUsers,
                socket,
                login,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
