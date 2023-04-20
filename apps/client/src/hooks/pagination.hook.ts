import { useEffect, useState } from 'react';

export const usePagintion = <T>(elements: T[], limit = 100) => {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(elements.length / limit);

  // Set max or min page
  useEffect(() => {
    if (page > pages && pages !== 0) setPage(pages);
    else if (page < 1) setPage(1);
  }, [page]);

  const render = [];

  for (let i = 0; i < limit; i++) {
    const element = elements[(page - 1) * limit + i];
    if (!element) break;
    render.push(element);
  }

  return { page, setPage, render, pages };
};
