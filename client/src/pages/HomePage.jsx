import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../../context/chatContext';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="w-full h-screen bg-transparent sm:p-4 md:p-8">
      <div className={`backdrop-blur-xl border-2 border-gray-700 rounded-2xl overflow-hidden h-full w-full grid ${
        selectedUser ? 'md:grid-cols-[280px_1fr_280px]' : 'md:grid-cols-[280px_1fr]'
      }`}>
        {/* Sidebar - Fixed width */}
        <div className={`${selectedUser ? 'max-md:hidden' : ''}`}>
          <Sidebar />
        </div>
        
        {/* Chat Container - Flexible width */}
        <ChatContainer />
        
        {/* Right Sidebar - Only shown when user is selected */}
        {selectedUser && (
          <div className="max-md:hidden">
            <RightSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
