import React, { useCallback, useEffect, useState } from 'react';
import { WinnerWithCar } from '../../utils/GlobalInterfaces.ts';
import CarSVGComponent from '../CarSVG.tsx';
import Pagination from '../Pagination.tsx';
import fetchWinners from '../../api/winnerService.ts';
import useAppContext from '../../context/useAppContext.ts';

// eslint-disable-next-line no-shadow, no-unused-vars
enum SortField {
  // eslint-disable-next-line no-unused-vars
  WINS = 'wins',
  // eslint-disable-next-line no-unused-vars
  TIME = 'time',
}

// eslint-disable-next-line no-shadow, no-unused-vars
enum SortOrder {
  // eslint-disable-next-line no-unused-vars
  ASC = 'ASC',
  // eslint-disable-next-line no-unused-vars
  DESC = 'DESC',
}

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerWithCar[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortField>(SortField.WINS);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  const { winnerPages, setwinnerPages } = useAppContext();

  const fetchWinnersCallback = useCallback(async (
    cPage: number,
    cSortBy: string,
    cSortOrder: string,
  ) => {
    fetchWinners(cPage, 10, cSortBy, cSortOrder)
      .then((data) => {
        setWinners(data.winners);
        setTotalPages(Math.ceil(data.totalCount / 10));
        setTotalCount(data.totalCount);
      });
  }, []);

  useEffect(() => {
    fetchWinnersCallback(winnerPages, sortBy, sortOrder);
  }, [winnerPages, sortBy, sortOrder, fetchWinnersCallback]);

  const handleSortBy = (field: SortField): void => {
    if (field === sortBy) {
      setSortOrder(sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
    } else {
      setSortBy(field);
      setSortOrder(SortOrder.DESC);
    }
  };

  const handlePreviousPage = (): void => {
    if (winnerPages > 1) {
      setwinnerPages((prevPage: number) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (winnerPages < totalPages) {
      setwinnerPages((prevPage: number) => prevPage + 1);
    }
  };

  return (
    <div className="container">
      <h1>Winners</h1>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Image</th>
            <th>Name</th>
            <th onClick={() => handleSortBy(SortField.WINS)}>Wins</th>
            <th onClick={() => handleSortBy(SortField.TIME)}>Best Time (Seconds)</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td>{winner.id}</td>
              <CarSVGComponent fill={winner.car.color} />
              <td>{winner.car.name}</td>
              <td>{winner.wins}</td>
              <td>{winner.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Total Winners:
        {totalCount}
      </p>
      <Pagination
        currentPage={winnerPages}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default Winners;
