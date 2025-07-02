import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/authContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    const images = messages.filter((msg) => msg.image).map((msg) => msg.image);
    setMsgImages(images);
  }, [messages]);

  if (!selectedUser) return null;

  const isUserOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-auto max-md:hidden">
      {/* User Profile Info */}
      <div className="pt-10 md:pt-16 flex flex-col items-center text-center px-4 space-y-3">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={selectedUser.profilepic || assets.avatar_icon}
            alt="Profile"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border border-white shadow-md"
          />
          {isUserOnline && (
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Fullname */}
        <h1 className="text-lg md:text-xl font-semibold">{selectedUser.fullname}</h1>

        {/* Bio */}
        <div
          className="text-sm font-light text-gray-300 max-h-24 overflow-y-auto px-2 text-start break-words whitespace-pre-wrap"
          style={{ wordBreak: 'break-word' }}
        >
          {selectedUser.bio}
        </div>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* Media Gallery */}
      <div className="px-5 text-xs">
        <p className="mb-2 text-gray-300">Media ({msgImages.length})</p>
        <div className="max-h-[200px] overflow-y-auto grid grid-cols-2 gap-3 opacity-80">
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded overflow-hidden"
              >
                <img src={url} alt="media" className="w-full h-full rounded-md object-cover" />
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-2 text-center">No Media</p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-violet-700 text-white text-sm font-light py-2 px-8 rounded-full cursor-pointer hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
