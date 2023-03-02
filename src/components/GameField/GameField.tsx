import { useEffect, useMemo, useState } from 'react';
import { Mask } from '../../types/mask';
import { GameFieldCell } from '../GameFieldCell/GameFieldCell';
import { GameIndicators } from '../GameIndicators/GameIndicators';
import cls from './GameField.module.scss';

interface GameFieldProps {
  className?: string;
}

export const SIZE = 16;
export const FULL_SIZE = SIZE * SIZE;
export const MINE = -1;
export const MINE_COUNT = 3;

function createField(size: number, firstClickArrayNumber?: number): number[] {
  const field: number[] = new Array(size * size).fill(0);
  console.log('create field');

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

export const GameField: React.FC<GameFieldProps> = (props) => {
  const dimension = new Array(SIZE).fill(null);

  const [death, setDeath] = useState(false);
  const [win, setWin] = useState(false);
  const [field, setField] = useState<number[]>([]);
  const [mask, setMask] = useState<Mask[]>(() => new Array(FULL_SIZE).fill(Mask.Fill));
  const [isFirstClick, setIsFirstClick] = useState(true);
  const flagsCount = mask.filter((cell) => cell === 2).length;

  const flagsAndFill = useMemo(() => {
    let count = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === Mask.Transparent) {
        count++;
      }
    }

    return count;
  },
    [mask],
  );

  useEffect(() => {
    if (flagsAndFill === (FULL_SIZE - MINE_COUNT)) {
      setWin(true);
    }
  }, [flagsAndFill]);

  return (
    <div className={cls.main}>
      <GameIndicators
        flagsCount={flagsCount}
      />
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
              setDeath={setDeath}
              win={win}
              death={death}
              setField={setField}
              createField={createField}
              isFirstClick={isFirstClick}
              setIsFirstClick={setIsFirstClick}
            />
          )}
        </div>);
      })}
    </div>
  )
}
