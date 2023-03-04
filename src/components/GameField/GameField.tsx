import { useEffect, useMemo, useState } from 'react';
import { FULL_SIZE, GameStatus, MINE, MINE_COUNT, SIZE } from '../../const';
import { useAppDispatch } from '../../hooks';
import { setGameStatus } from '../../store/game/game';
import { Mask } from '../../types/mask';
import { GameFieldCell } from '../GameFieldCell/GameFieldCell';
import { GameIndicators } from '../GameIndicators/GameIndicators';
import cls from './styles/GameField.module.scss';

const createField = (size: number, firstClickArrayNumber?: number): number[] => {
  const field: number[] = new Array(size * size).fill(0);

  function inc(x: number, y: number) {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      if (field[y * size + x] === MINE) return;

      field[y * size + x] += 1;
    }
  }

  for (let i = 0; i < MINE_COUNT;) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);

    if (field[y * size + x] === MINE || y * size + x === firstClickArrayNumber) continue;

    field[y * size + x] = MINE;

    i += 1;

    inc(x + 1, y);
    inc(x - 1, y);
    inc(x, y + 1);
    inc(x, y - 1);
    inc(x + 1, y - 1);
    inc(x - 1, y - 1);
    inc(x + 1, y + 1);
    inc(x - 1, y + 1);
  }

  return field;
}

export const GameField: React.FC = () => {
  const dispatch = useAppDispatch();
  const dimension = new Array(SIZE).fill(null);

  const [field, setField] = useState<number[]>([]);
  const [mask, setMask] = useState<Mask[]>(() => new Array(FULL_SIZE).fill(Mask.Fill));
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const flagsCount = mask.filter((cell) => cell === 2).length;

  const flagsAndFill = useMemo(() => {
    let count = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === Mask.Transparent && field[i] !== MINE) {
        count++;
      }
    }
    return count;
  },
    [field, mask],
  );

  const gameReset = () => {
    dispatch(setGameStatus(GameStatus.Play));
    setIsFirstClick(true);
    setField([]);
    setMask(new Array(FULL_SIZE).fill(Mask.Fill));
  }

  useEffect(() => {
    if (flagsAndFill === (FULL_SIZE - MINE_COUNT)) {
      console.log(flagsAndFill, (FULL_SIZE - MINE_COUNT));
      dispatch(setGameStatus(GameStatus.Win));
    }
  }, [dispatch, flagsAndFill]);

  return (
    <div className={cls.main}>
      <GameIndicators
        flagsCount={flagsCount}
        gameReset={gameReset}
        isFirstClick={isFirstClick}
      />
      <div className={cls.gameFieldWrapper}>
        {dimension.map((_, y) => {
          return (<div key={y} className={cls.row}>
            {dimension.map((_, x) =>
              <GameFieldCell
                key={`${y}${x}`}
                x={x}
                y={y}
                mask={mask}
                field={field}
                setMask={setMask}
                setField={setField}
                createField={createField}
                isFirstClick={isFirstClick}
                setIsFirstClick={setIsFirstClick}
                flagsCount={flagsCount}
              />
            )}
          </div>);
        })}
      </div>
    </div>
  )
}
