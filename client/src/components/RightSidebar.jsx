import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { ChatContext } from '../../context/chatContext';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (messages) {
      const images = messages.filter((msg) => msg.image).map((msg) => msg.image);
      setMsgImages(images);
    }
  }, [messages]);

  if (!selectedUser) return null;
  
  const isUserOnline = onlineUsers.includes(selectedUser._id);
  // Fix: Convert both IDs to strings before comparing
  const isOwnProfile = String(authUser._id) === String(selectedUser._id);
  
  // Handle profile edit navigation
  const handleEditProfile = () => {
    if (isOwnProfile) {
      navigate('/profile');
    }
  };

  return (
    <div className="bg-black/20 h-full flex flex-col border-l border-gray-700">
      {/* Profile Info */}
      <div className="flex flex-col items-center text-center p-4 border-b border-gray-700">
        <div className="relative mb-2">
          <img
            src={selectedUser.profilepic || assets.avatar_icon}
            alt="Profile"
            className={`w-20 h-20 rounded-full ${isOwnProfile ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            onClick={handleEditProfile}
            title={isOwnProfile ? "Click to edit profile" : ""}
          />
          {isUserOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"></span>
          )}
        </div>
        <p 
          className={`font-semibold text-lg text-white ${isOwnProfile ? 'cursor-pointer hover:text-violet-300 transition-colors' : ''}`}
          onClick={handleEditProfile}
          title={isOwnProfile ? "Click to edit profile" : ""}
        >
          {selectedUser.fullname}
        </p>
        <p className="text-sm text-gray-400 mb-3">{selectedUser.bio}</p>
        
        {/* Edit Profile Button - Only visible for own profile */}
        {isOwnProfile && (
          <button 
            className="px-4 py-1.5 bg-violet-500/30 hover:bg-violet-500/50 text-white rounded-full text-sm transition-colors"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Shared Files */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-white font-semibold mb-2">Shared Files</h3>
        {msgImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {msgImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Shared"
                className="w-full h-20 object-cover rounded-md"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center">No shared files</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
