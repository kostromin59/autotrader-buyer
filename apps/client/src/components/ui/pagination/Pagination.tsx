import { Dispatch, FC, SetStateAction } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';

interface IPaginationProps {
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Pagination: FC<IPaginationProps> = ({ page, pages, setPage }) => {
  return (
    <div className="flex gap-3 justify-center py-5">
      <Button
        className="p-3 w-auto"
        onClick={() => setPage((prev) => prev - 1 || 1)}
      >
        PREV
      </Button>
      <Input
        className="p-3 w-auto"
        value={page}
        max={pages}
        type={'number'}
        pattern={'/^d+$/'}
        min="1"
        onChange={(e) => setPage(Number(e.target.value) || 1)}
      />
      <Button
        className="p-3 w-auto"
        onClick={() => setPage((prev) => (prev === pages ? pages : prev + 1))}
      >
        NEXT
      </Button>
    </div>
  );
};

export default Pagination;
