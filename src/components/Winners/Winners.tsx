import React, { useEffect, useState } from 'react';
import { WinnerWithCar } from '../../utils/GlobalInterfaces.ts';
import fetchWinners from '../../api/apiService.ts';

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerWithCar[]>([]);

  useEffect(() => {
    fetchWinners(1, 10, 'wins', 'DESC')
      .then((data) => {
        setWinners(data);
      })
      .catch((error) => {
        throw new Error(`Error fetching winners: ${error}`);
      });
  }, []);

  return (
    <div className="container">
      <h2>Winners View</h2>
      <ul className="winners-list">
        {winners.map((winner) => (
          <li className="winner-item" key={winner.id}>
            <strong>
              Winner #
              {winner.id}
            </strong>
            <p>
              Wins:
              {winner.wins}
            </p>
            <p>
              Time:
              {winner.time}
            </p>
            {winner.car && (
              <p>
                Car:
                {' '}
                {winner.car.name}
                {' '}
                (
                {winner.car.color}
                )
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Winners;
