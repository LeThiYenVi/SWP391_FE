import React from 'react';
import Chat from '../../../components/Chat';
import './index.css';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="chat-container">
        <Chat />
      </div>
    </div>
  );
};

export default ChatPage;