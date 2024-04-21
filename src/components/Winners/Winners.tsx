/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { SortField, SortOrder, WinnerWithCar } from '../../utils/GlobalInterfaces.ts';
import CarSVGComponent from '../CarSVG.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import fetchWinners from '../../api/winnerService.ts';
import useAppContext from '../../context/useAppContext.ts';
import './winners.css';

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerWithCar[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const {
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    winnerPages, setwinnerPages,
  } = useAppContext();

  const fetchWinnersCallback = useCallback(
    async (cPage: number, cSortBy: string, cSortOrder: string) => {
      fetchWinners(cPage, 10, cSortBy, cSortOrder).then((data) => {
        setWinners(data.winners);
        setTotalPages(Math.ceil(data.totalCount / 10));
        setTotalCount(data.totalCount);
      });
    },
    [],
  );

  useEffect(() => {
    fetchWinnersCallback(winnerPages, sortBy, sortOrder);
  }, [winnerPages, sortBy, sortOrder, fetchWinnersCallback]);

  const handleSortBy = (field: SortField): void => {
    if (field === sortBy) {
      setSortOrder(
        sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
      );
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
    <div className="winner-container">
      <h1>Winners</h1>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Image</th>
            <th>Name</th>
            <th
              className="sortable"
              onClick={() => handleSortBy(SortField.WINS)}
            >
              Wins
            </th>
            <th
              className="sortable"
              onClick={() => handleSortBy(SortField.TIME)}
            >
              Best Time (Seconds)
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => (
            <tr key={winner.id}>
              <td>{winner.id}</td>
              <td className="CarSVGComponent">
                <CarSVGComponent fill={winner.car.color} />
              </td>
              <td>{winner.car.name}</td>
              <td>{winner.wins}</td>
              <td>{winner.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="total-winners">
        Total Winners:
        {totalCount}
      </p>
      <div className="pagination">
        <Pagination
          currentPage={winnerPages}
          totalPages={totalPages}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </div>
  );
};

export default Winners;
