import { GameField } from '../GameField/GameField';
import cls from './App.module.scss';

function App() {
  return (
    <div className={cls.App}>
      <div className={cls.wrapper}>
        <GameField />
      </div>
    </div>
  );
}

export default App;
