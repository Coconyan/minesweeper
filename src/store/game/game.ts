import { createSlice } from '@reduxjs/toolkit';
import { GameStatus, NameSpace } from '../../const';
import { Game } from '../../types/state';

const initialState: Game = {
  gameStatus: GameStatus.Play,
  fearMode: false,
  clickCoordinates: [null, null]
};

export const game = createSlice({
  name: NameSpace.game,
  initialState,
  reducers: {
    setGameStatus: (state, action) => {
      state.gameStatus = action.payload;
    },
    setFearMode: (state, action) => {
      state.fearMode = action.payload;
    },
    setClickCoordinates: (state, action) => {
      state.clickCoordinates = action.payload;
    }
  },
});

export const { setGameStatus, setFearMode, setClickCoordinates } = game.actions;
