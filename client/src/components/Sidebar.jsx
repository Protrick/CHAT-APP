import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import menuicon from '../assets/menuicon.jpg';
import { AuthContext } from '../../context/authContext.jsx';
import { ChatContext } from '../../context/chatContext.jsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const { onlineUsers, logout } = useContext(AuthContext);
  const { users, getUsers, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = input
    ? users.filter((user) => user.fullname.toLowerCase().includes(input.toLowerCase()))
    : users;

  return (
    <div
      className={`bg-[#1a1c2c]/50 backdrop-blur-xl h-full p-4 sm:p-5 rounded-r-xl overflow-y-auto text-white max-w-xs w-full ${selectedUser ? 'max-md:hidden' : ''}`}
    >
      {/* Header */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src="/chatapp(logo).png" alt="Logo" className="max-w-10" />

          {/* Menu Dropdown */}
          <div className="relative group" ref={menuRef}>
            <img
              src={menuicon}
              alt="Menu"
              className="h-6 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            <div
              className={`absolute top-full right-0 z-20 w-32 p-3 mt-2 rounded-md bg-[#282142]/90 border border-gray-600 text-sm text-gray-100 transition-all duration-200 ${menuOpen ? 'block' : 'hidden'}`}
            >
              <p
                onClick={() => {
                  navigate('/profile');
                  setMenuOpen(false);
                }}
                className="cursor-pointer hover:underline"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-gray-500" />
              <p
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="cursor-pointer hover:underline"
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-[#2e2a4c]/80 backdrop-blur-md rounded-full flex items-center gap-3 py-2 px-4 mt-5">
          <img src={assets.search_icon} alt="Search Icon" className="w-4" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search User..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-300 flex-1"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`relative flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all ${selectedUser?._id === user._id
                ? 'bg-gradient-to-r from-violet-500/80 to-purple-600/80'
                : 'hover:bg-[#382c8c]/60'
              }`}
          >
            <img
              src={user.profilepic || assets.avatar_icon}
              alt={user.fullname}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-white">{user.fullname}</p>
              <span
                className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-gray-400'
                  }`}
              >
                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>

            {unseenMessages && unseenMessages[user._id] > 0 && (
              <span className="absolute top-2 right-3 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500 text-white">
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
