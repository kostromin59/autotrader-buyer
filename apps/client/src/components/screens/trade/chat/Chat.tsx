import MessageList from './MessageList';
import SendMessage from './SendMessage';

const Chat = () => {
  return (
    <div className="rounded-md border-black border-[3px]">
      <MessageList />
      <SendMessage />
    </div>
  );
};

export default Chat;
