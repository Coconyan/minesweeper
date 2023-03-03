import { GameStatus } from "../const";
import { store } from "../store";

export type Game = {
  gameStatus: GameStatus,
  fearMode: boolean,
  clickCoordinates: number[] | null[],
};

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;