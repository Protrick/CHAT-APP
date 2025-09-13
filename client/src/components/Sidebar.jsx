import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/authContext';
import { ChatContext } from '../../context/chatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const { authUser, onlineUsers, logout } = useContext(AuthContext);
  const { users, getUsers, selectedUser, setSelectedUser, unseenMessages } = useContext(ChatContext);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const filteredUsers = input
    ? users.filter((user) => user.fullname.toLowerCase().includes(input.toLowerCase()))
    : users;

  return (
    <div className="bg-black/20 h-full flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img src={authUser.profilepic || assets.avatar_icon} alt="Profile" className="w-10 h-10 rounded-full" />
          <p className="font-semibold text-white">{authUser.fullname}</p>
        </div>
        <div className="relative" ref={menuRef}>
          <img onClick={() => setMenuOpen(!menuOpen)} src={assets.more_icon} alt="Menu" className="w-5 cursor-pointer" />
          {menuOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-10">
              <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search users..."
          className="w-full p-2 pl-8 bg-gray-700/50 rounded-md text-white outline-none"
        />
        <img src={assets.search_icon} alt="Search" className="absolute left-6 top-1/2 -translate-y-1/2 w-5" />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-2 ${
              selectedUser?._id === user._id ? 'bg-violet-500/30' : 'hover:bg-gray-700/50'
            }`}
          >
            <div className="relative">
              <img src={user.profilepic || assets.avatar_icon} alt="User" className="w-10 h-10 rounded-full" />
              {onlineUsers.includes(user._id) && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></span>}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{user.fullname}</p>
              <p className="text-xs text-gray-400">Start a conversation</p>
            </div>
            {unseenMessages[user._id] > 0 && (
              <span className="bg-violet-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unseenMessages[user._id]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
