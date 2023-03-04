import cls from './styles/GameIndicators.module.scss';
import './styles/GameIndicators.css';
import { useEffect, useState } from 'react';
import { GameStatus, MINE_COUNT } from '../../const';
import { useAppSelector } from '../../hooks';
import { getFearMode, getGameStatus } from '../../store/game/selectors';

interface GameIndicatorsProps {
  flagsCount: number;
  isFirstClick: boolean;
  gameReset: () => void;
}

export const GameIndicators: React.FC<GameIndicatorsProps> = (props) => {
  const { flagsCount, gameReset, isFirstClick } = props;

  const gameStatus = useAppSelector(getGameStatus);
  const fearMode = useAppSelector(getFearMode);

  const mineCount = String(MINE_COUNT - flagsCount).padStart(3, '0');
  const firstMineNum = Number(mineCount[0]);
  const secondMineNum = Number(mineCount[1]);
  const thirdMineNum = Number(mineCount[2]);  
  const [seconds, setSeconds] = useState(0);

  const characterClass = cls.character + ' ' + (cls[gameStatus]);
  const characterFearClass = cls.character + ' ' + cls.fear;

  useEffect(() => {
    let interval: NodeJS.Timer;
    const tick = (num: number) => setSeconds(seconds + num);

    if (!isFirstClick && gameStatus === GameStatus.Play) {
      interval = setInterval(() => tick(1), 1000);
    }

    const cleanup = () => {
      clearInterval(interval);
    };
    
    return cleanup;
  }, [seconds, gameStatus, isFirstClick]);

  const smileClickHandler = () => {
    gameReset();
    setSeconds(0);
  }

  return (
    <div className={cls.gameIndicators}>
      <div className={cls.mineCounter}>
        <div className={`n${firstMineNum} ${cls.digit}`}></div>
        <div className={`n${secondMineNum} ${cls.digit}`}></div>
        <div className={`n${thirdMineNum} ${cls.digit}`}></div>
      </div>
      <div
        onClick={smileClickHandler}
        className={fearMode ? characterFearClass : characterClass}
      ></div>
      <div className={cls.time}>
        <div className={`n${String(seconds).padStart(3, '0')[0]} ${cls.digit}`}></div>
        <div className={`n${String(seconds).padStart(3, '0')[1]} ${cls.digit}`}></div>
        <div className={`n${String(seconds).padStart(3, '0')[2]} ${cls.digit}`}></div>
      </div>
    </div>
  );
}