import { combineReducers } from 'redux';

import { WorkloadsAction, WorkloadsState, workloadReducer } from './workloads';


export type RootAction = 
  | WorkloadsAction;

export interface RootState {
  workloads: WorkloadsState;
}


export const reducer = combineReducers<RootState, RootAction>({
  workloads: workloadReducer,
});
