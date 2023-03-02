import { MINE_COUNT } from '../GameField/GameField';
import cls from './GameIndicators.module.scss';
import './GameIndicators.css';
import { useEffect, useState } from 'react';

interface GameIndicatorsProps {
  className?: string;
  flagsCount: number;
}

export const GameIndicators: React.FC<GameIndicatorsProps> = (props) => {
  const { flagsCount } = props;

  const mineCount = String(MINE_COUNT - flagsCount).padStart(3, '0');
  const firstMineNum = Number(mineCount[0]);
  const secondMineNum = Number(mineCount[1]);
  const thirdMineNum = Number(mineCount[2]);

  const [seconds, setSeconts] = useState(0);

  useEffect(() => {
    const tick = (num: number) => setSeconts(seconds + num);

    const interval = setInterval(() => tick(1), 1000);

    const cleanup = () => {
      clearInterval(interval);
    };
    return cleanup;
  });

  return (
    <div className={cls.gameIndicators}>
      <div className={cls.mineCounter}>
        <div className={`n${firstMineNum} ${cls.digit}`}></div>
        <div className={`n${secondMineNum} ${cls.digit}`}></div>
        <div className={`n${thirdMineNum} ${cls.digit}`}></div>
      </div>
      <div className={`${cls.character} ${cls.characterDefault}`}></div>
      <div className={cls.time}>
        <div className={`n${String(seconds).padStart(3, '0')[0]} ${cls.digit}`}></div>
        <div className={`n${String(seconds).padStart(3, '0')[1]} ${cls.digit}`}></div>
        <div className={`n${String(seconds).padStart(3, '0')[2]} ${cls.digit}`}></div>
      </div>
    </div>
  );
}