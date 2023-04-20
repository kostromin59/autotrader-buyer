import rlBot from '../../../../store/bot';
import { observer } from 'mobx-react-lite';

const MessageList = observer(() => {
  return (
    <ul className="overflow-scroll p-1 h-40">
      {rlBot.chat.map((message, id) => (
        <li key={id} className="text-lg">
          {message}
        </li>
      ))}
    </ul>
  );
});

export default MessageList;
