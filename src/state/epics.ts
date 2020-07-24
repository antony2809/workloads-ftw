import { combineEpics } from 'redux-observable';

import { epics as workloadsEpics } from './workloads';

export const epics = combineEpics(workloadsEpics);

export default epics;
