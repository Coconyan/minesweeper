import { GameStatus, NameSpace } from '../../const';
import { State } from '../../types/state';

export const getGameStatus = (state: State): GameStatus => state[NameSpace.game].gameStatus;
export const getFearMode = (state: State): boolean => state[NameSpace.game].fearMode;