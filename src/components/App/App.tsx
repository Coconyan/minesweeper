import { useAppDispatch } from '../../hooks';
import { setFearMode } from '../../store/game/game';
import { GameField } from '../GameField/GameField';
import cls from './App.module.scss';

function App() {
  const dispatch = useAppDispatch();

  return (
    <div onMouseUp={() => dispatch(setFearMode(false))} className={cls.App}>
      <div className={cls.wrapper}>
        <GameField />
      </div>
    </div>
  );
}

export default App;
