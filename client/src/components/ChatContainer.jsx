import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500 bg-white/10 max-md:hidden h-full">
        <img
          src="/chatapp(logo).png"
          alt="Logo"
          className="w-16"
        />
        <p className="text-lg font-medium text-white">Chat Anytime Anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={selectedUser.profilepic || assets.avatar_icon}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullname}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-6 cursor-pointer"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="hidden md:block w-5"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 max-sm:pb-36">
        {messages.map((msg, index) => {
          const isSender = msg.senderId._id === authUser._id;
          const profilePic = msg.senderId.profilepic || assets.avatar_icon;

          return (
            <div
              key={index}
              className={`flex ${isSender ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center text-xs text-gray-400">
                <img
                  src={profilePic}
                  alt="Avatar"
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-[10px]">{formatMessageTime(msg.createdAt)}</p>
              </div>

              {/* Message Bubble */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Sent"
                  className="max-w-[230px] border border-gray-700 rounded-lg"
                />
              ) : (
                <p
                  className={`p-2 md:text-sm text-sm font-light rounded-lg max-w-[230px] text-white break-words ${isSender
                      ? "bg-violet-500/30 rounded-br-none"
                      : "bg-gray-700/50 rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </p>
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/20 backdrop-blur-md flex items-center gap-3 max-sm:gap-2">
        <div className="flex items-center flex-1 bg-gray-100/10 px-4 py-2 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            type="text"
            placeholder="Send a message..."
            className="flex-1 text-sm bg-transparent outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 h-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-7 h-7 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
