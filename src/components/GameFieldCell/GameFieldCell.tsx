import { Mask } from '../../types/mask';
import cls from './GameFieldCell.module.scss';
import './GameFieldCell.css';
import { GameStatus, MINE, MINE_COUNT, SIZE } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getClickCoordinates, getGameStatus } from '../../store/game/selectors';
import { setClickCoordinates, setFearMode, setGameStatus } from '../../store/game/game';

interface GameFieldCellProps {
  x: number;
  y: number;
  mask: Mask[];
  setMask: React.Dispatch<React.SetStateAction<Mask[]>>;
  field: number[];
  setField: React.Dispatch<React.SetStateAction<number[]>>;
  createField: (size: number, firstClickArrayNumber?: number) => number[];
  isFirstClick: boolean;
  setIsFirstClick: React.Dispatch<React.SetStateAction<boolean>>;
  flagsCount: number;
}

export const GameFieldCell: React.FC<GameFieldCellProps> = (props) => {
  const { x, y, mask, setMask, field, setField, createField, isFirstClick, setIsFirstClick, flagsCount } = props;
  let testField = field;

  const gameStatus = useAppSelector(getGameStatus);
  const clickCoordinates = useAppSelector(getClickCoordinates);
  const dispatch = useAppDispatch();
  console.log(clickCoordinates);

  const cellDefaultClass = `${cls.cell} ${cls.default}`;
  let cellAdditionalClass = 'cell-n';

  const cellClickHandler = () => {
    if (isFirstClick) {
      setIsFirstClick(false);
      testField = createField(SIZE, y * SIZE + x);
      setField(testField);
    }

    if (gameStatus === GameStatus.Win || gameStatus === GameStatus.Lose) return;

    if (mask[y * SIZE + x] === Mask.Transparent) return;

    const clearing: [number, number][] = [];

    function clear(x: number, y: number) {
      if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        if (mask[y * SIZE + x] === Mask.Transparent) return;

        clearing.push([x, y]);
      }
    }

    clear(x, y);

    while (clearing.length) {
      const [x, y] = clearing.pop()!!;

      mask[y * SIZE + x] = Mask.Transparent;

      if (testField[y * SIZE + x] !== 0) continue;

      clear(x + 1, y);
      clear(x - 1, y);
      clear(x, y + 1);
      clear(x, y - 1);
      clear(x + 1, y - 1);
      clear(x - 1, y - 1);
      clear(x + 1, y + 1);
      clear(x - 1, y + 1);
    }

    // Если наша ячейка с миной
    if (testField[y * SIZE + x] === MINE) {
      mask.forEach((_, i) => {
        if (field[i] === MINE && mask[i] !== Mask.Flag && mask[i] !== Mask.Question) {
          mask[i] = Mask.Transparent;
        }
        if (mask[i] === Mask.Flag && field[i] !== MINE) {
          mask[i] = Mask.NotBomb;
        }
      });

      mask[y * SIZE + x] = Mask.DetonatedBomd;

      dispatch(setGameStatus(GameStatus.Lose));
    }

    setMask((prev) => [...prev]);
  }

  const cellRightClickHandler = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault();
    e.stopPropagation();

    if (gameStatus === GameStatus.Win || gameStatus === GameStatus.Lose) return;

    if (mask[y * SIZE + x] === Mask.Transparent) return;

    if (mask[y * SIZE + x] !== Mask.Flag && flagsCount === MINE_COUNT) return;

    if (mask[y * SIZE + x] === Mask.Fill) {
      mask[y * SIZE + x] = Mask.Flag;
    } else if (mask[y * SIZE + x] === Mask.Flag) {
      mask[y * SIZE + x] = Mask.Question;
    } else if (mask[y * SIZE + x] === Mask.Question) {
      mask[y * SIZE + x] = Mask.Fill;
    }

    setMask((prev) => [...prev]);
  }

  const cellOnMouseDownHandler = () => {
    dispatch(setClickCoordinates([x, y]));
    if (mask[y * SIZE + x] !== Mask.Transparent) {
      dispatch(setFearMode(true));
    }
  };

  if (mask[y * SIZE + x] === Mask.Transparent && testField[y * SIZE + x] !== Mask.Transparent) {
    cellAdditionalClass += testField[y * SIZE + x];
  }

  if (clickCoordinates[0] === x && clickCoordinates[1] === y) {
    if (mask[y * SIZE + x] === Mask.Question) {
      cellAdditionalClass += ' mask-3-active'; // todo добавить констант, убрать магические значения
    } else {
      cellAdditionalClass += ' mask-0';
    }
  }

  return (
    <div
      className={`${cellDefaultClass} mask-${mask[y * SIZE + x]} ${cellAdditionalClass} ${gameStatus !== GameStatus.Play ? cls.gameOver : ''}`} // todo возможно кидать все классы через функцию
      onClick={cellClickHandler}
      onMouseDown={cellOnMouseDownHandler}
      onMouseUp={() => {dispatch(setFearMode(false));dispatch(setClickCoordinates([null, null]))}} // todo вынести в отдельную функцию
      onContextMenu={cellRightClickHandler}
    ></div>);
};