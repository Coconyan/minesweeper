import { Mask } from '../../types/mask';
import { MINE, SIZE } from '../GameField/GameField';
import cls from './GameFieldCell.module.scss';
import './GameFieldCell.css';

interface GameFieldCellProps {
  win: boolean;
  death: boolean;
  x: number;
  y: number;
  mask: Mask[];
  setMask: React.Dispatch<React.SetStateAction<Mask[]>>;
  field: number[];
  setDeath: React.Dispatch<React.SetStateAction<boolean>>;
  setField: any;
  createField: any;
  isFirstClick: boolean;
  setIsFirstClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameFieldCell: React.FC<GameFieldCellProps> = (props) => {
  const { win, death, x, y, mask, setMask, field, setDeath, setField, createField, isFirstClick, setIsFirstClick } = props;
  let testField = field; // todo временное решение для функциональности первого клика без бомб

  const cellClass = death ? cls.death : win ? cls.win : cls.default;

  const cellClickHandler = async () => {
    if (isFirstClick) {
      setIsFirstClick(false);
      testField = createField(SIZE, y * SIZE + x);
      setField(testField);
    }

    if (win || death) return;

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
    }

    if (testField[y * SIZE + x] === MINE) {
      mask.forEach((_, i) => mask[i] = Mask.Transparent);

      setDeath(true);
    }

    setMask((prev) => [...prev]);
  }

  const cellRightClickHandler = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault();
    e.stopPropagation();

    if (win || death) return;

    if (mask[y * SIZE + x] === Mask.Transparent) return;

    if (mask[y * SIZE + x] === Mask.Fill) {
      mask[y * SIZE + x] = Mask.Flag;
    } else if (mask[y * SIZE + x] === Mask.Flag) {
      mask[y * SIZE + x] = Mask.Question;
    } else if (mask[y * SIZE + x] === Mask.Question) {
      mask[y * SIZE + x] = Mask.Fill;
    }

    setMask((prev) => [...prev]);
  }

  return (
    <div
      className={`${cls.cell} ${cellClass} mask-${mask[y * SIZE + x]}`}
      onClick={cellClickHandler}
      onContextMenu={cellRightClickHandler}
    >{
        mask[y * SIZE + x] !== Mask.Transparent
          ? mask[y * SIZE + x]
          : testField[y * SIZE + x] === MINE
            ? "💣"
            : testField[y * SIZE + x]
      }
    </div>);
};