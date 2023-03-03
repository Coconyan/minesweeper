import { useAppDispatch } from '../../hooks';
import { setClickCoordinates, setFearMode } from '../../store/game/game';
import { GameField } from '../GameField/GameField';
import cls from './App.module.scss';

function App() {
  const dispatch = useAppDispatch();

  // Проверка на отжатие мыши за пределами игровой зоны
  const onMouseUpHandler = () => {
    dispatch(setFearMode(false));
    dispatch(setClickCoordinates([null, null]));
  }

  return (
    <div onMouseUp={onMouseUpHandler} className={cls.App}>
      <div className={cls.wrapper}>
        <GameField />
      </div>
    </div>
  );
}

export default App;
