import Text from '../../../ui/text/Text';
import { observer } from 'mobx-react-lite';
import rlBot from '../../../../store/bot';
import { BsDot } from 'react-icons/bs';

const User = observer(() => {
  return (
    <div className="flex items-center">
      <Text className="font-semibold">{rlBot.status}</Text>
      <BsDot className="text-4xl" />
      <Text className="font-semibold">{rlBot.botNickname || 'Unknown'}</Text>
    </div>
  );
});

export default User;
