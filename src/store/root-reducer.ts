import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const';
import { game } from './game/game';

export const rootReducer = combineReducers({
  [NameSpace.game]: game.reducer,
});