import React, { useCallback, useEffect, useState } from 'react';
import { WinnerWithCar } from '../../utils/GlobalInterfaces.ts';
import fetchWinners from '../../api/apiService.ts';
import CarSVGComponent from '../CarSVG.tsx';
import Pagination from '../Pagination.tsx';

enum SortField {
  WINS = 'wins',
  TIME = 'time',
}

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerWithCar[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortField>(SortField.WINS);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

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
    fetchWinnersCallback(page, sortBy, sortOrder);
  }, [page, sortBy, sortOrder, fetchWinnersCallback]);

  const handleSortBy = (field: SortField): void => {
    if (field === sortBy) {
      setSortOrder(sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC);
    } else {
      setSortBy(field);
      setSortOrder(SortOrder.DESC);
    }
  };

  const handlePreviousPage = (): void => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
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
        currentPage={page}
        totalPages={totalPages}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default Winners;
