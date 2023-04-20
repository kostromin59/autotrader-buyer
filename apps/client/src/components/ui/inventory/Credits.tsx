import { FC, useState } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import Modal from '../modal/Modal';
import Title from '../title/Title';

interface ICreditsProps {
  onCreditsClick: (amount: number) => void;
  creditsInInventory: number;
}

const Credits: FC<ICreditsProps> = ({ onCreditsClick, creditsInInventory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credits, setCredits] = useState(0);

  return (
    <>
      <Title className="mb-3">
        <button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          Credits: {creditsInInventory}
        </button>
      </Title>
      <Modal
        title="Put credits"
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Input
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="mb-3"
        />
        <Button
          onClick={() => {
            onCreditsClick(credits);
            setIsModalOpen(false);
          }}
          disabled={credits > creditsInInventory || credits % 10 !== 0}
        >
          Put credits
        </Button>
      </Modal>
    </>
  );
};

export default Credits;
