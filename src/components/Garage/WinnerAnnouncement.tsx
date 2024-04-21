import React from 'react';
import { WinnerWithCar } from '../../utils/GlobalInterfaces.ts';
import './Car/Car.css';

interface WinnerAnnouncementProps {
  winner: WinnerWithCar;
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ winner }) => (
  <div className="winner-announcement">
    <p>
      Winner:
      {' '}
      <span className="winner-name">{winner.car.name}</span>
      <br />
      <span className="winner-time">
        Time:
        {winner.time}
        s
      </span>
    </p>
  </div>
);

export default WinnerAnnouncement;
