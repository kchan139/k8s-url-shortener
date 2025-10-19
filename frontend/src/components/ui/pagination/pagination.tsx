import clsx from 'clsx';
import { useState } from 'react';

import { Input } from '../input/input';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (currentPage: number) => void;
};

const RANGE_ON_DISPLAY_SIZE = 5;

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const pageRange: number[] = (() => {
    const halfRange = Math.floor(RANGE_ON_DISPLAY_SIZE / 2);
    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    if (end - start + 1 < RANGE_ON_DISPLAY_SIZE) {
      if (start === 1) {
        end = Math.min(totalPages, start + RANGE_ON_DISPLAY_SIZE - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - RANGE_ON_DISPLAY_SIZE + 1);
      }
    }

    const pageRange = [];
    for (let i = start; i <= end; i++) {
      pageRange.push(i);
    }

    return pageRange;
  })();

  const handlePageChange = (pageNumber: number) => {
    setInputPage(pageNumber.toString());
    onPageChange(pageNumber);
  };

  return (
    <div className="relative flex items-center space-x-1">
      <div className="flex size-fit items-center justify-center">
        <button
          className={clsx(
            'rounded-full',
            currentPage !== 1 && 'hover:bg-black/20',
          )}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          <img
            src="/icons/chevron_double.svg"
            alt="chevron-double-left"
            className="h-6 w-auto lg:h-5"
          />
        </button>
      </div>

      <div className="flex size-fit items-center justify-center">
        <button
          className={clsx(
            'rounded-full',
            currentPage !== 1 && 'hover:bg-black/20',
          )}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <img
            src="/icons/chevron.svg"
            alt="chevron-left"
            className="h-6 w-auto lg:h-5"
          />
        </button>
      </div>

      {pageRange?.map((pageNumber) => {
        return (
          <div key={pageNumber} className="flex size-fit items-center">
            <button
              className={clsx(
                'group aspect-square size-10 rounded-full xl:size-8',
                pageNumber === currentPage ? 'bg-primary' : 'hover:bg-primary',
              )}
              onClick={() => handlePageChange(pageNumber as number)}
            >
              <p
                className={clsx(
                  'font-semibold',
                  pageNumber === currentPage
                    ? 'text-white'
                    : 'group-hover:text-white',
                )}
              >
                {pageNumber}
              </p>
            </button>
          </div>
        );
      })}

      <div className="flex size-fit items-center justify-center">
        <button
          className={clsx(
            'rounded-full',
            currentPage !== totalPages && 'hover:bg-black/20',
          )}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <img
            src="/icons/chevron.svg"
            alt="chevron-right"
            className="h-6 w-auto rotate-180 lg:h-5"
          />
        </button>
      </div>
      <div className="flex size-fit items-center justify-center">
        <button
          className={clsx(
            'rounded-full',
            currentPage !== totalPages && 'hover:bg-black/20',
          )}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          <img
            src="/icons/chevron_double.svg"
            alt="chevron-double-right"
            className="h-6 w-auto rotate-180 lg:h-5"
          />
        </button>
      </div>
      <div className="relative hidden ps-2 lg:block">
        <div className="flex items-center space-x-2">
          <p className="font-semibold">Go to page</p>
          <Input
            className="h-8 w-10 rounded-md border border-primary px-2 py-1 text-center font-semibold"
            value={inputPage}
            onInput={(e) =>
              setInputPage(
                e.currentTarget.value === ''
                  ? e.currentTarget.value
                  : isNaN(Number(e.currentTarget.value)) ||
                      Number(e.currentTarget.value) > totalPages ||
                      Number(e.currentTarget.value) < 1
                    ? ''
                    : e.currentTarget.value,
              )
            }
            onEnterKeyPressed={(value) => handlePageChange(Number(value))}
          />
          <p className="font-semibold">of {totalPages}</p>
        </div>
      </div>
    </div>
  );
}
