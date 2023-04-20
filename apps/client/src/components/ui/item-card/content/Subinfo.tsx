import { FC } from 'react';
import Title from '../../title/Title';

interface ISubinfoProps {
  series?: string;
  special?: string;
  cert?: string;
}

const Subinfo: FC<ISubinfoProps> = ({ special, series, cert }) => {
  return (
    <>
      {(special || series || cert) && (
        <div className="absolute h-full w-full z-30 left-0 top-0 bg-black text-white p-1 opacity-0 hover:opacity-100 transition duration-300 flex flex-col justify-center items-center gap-3">
          {special && (
            <Title
              className="font-medium text-lg text-white text-center"
              type="h3"
            >
              {special}
            </Title>
          )}
          {series && (
            <Title
              className="font-medium text-lg text-white text-center"
              type="h3"
            >
              {series}
            </Title>
          )}
          {cert && (
            <Title
              className="font-medium text-lg text-white text-center"
              type="h3"
            >
              {cert}
            </Title>
          )}
        </div>
      )}
    </>
  );
};

export default Subinfo;
