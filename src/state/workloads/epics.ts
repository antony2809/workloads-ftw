import { combineEpics, Epic } from 'redux-observable';
import { filter, map, tap, ignoreElements, switchMap, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { RootAction, RootState } from '../reducer';
import * as workloadsActions from './actions';
import { Observable } from 'rxjs';
import { WorkloadService } from './services';

type AppEpic = Epic<RootAction, RootAction, RootState>;
const workloadService = new WorkloadService();
let timers: { [Id in number]: NodeJS.Timeout } = {};

const clearTimer = (id: number) => {
  clearTimeout(timers[id]);
  delete timers[id]
}

// Custom workloadDelay operator
const workloadDelay = () => (source: Observable<any>) =>
  new Observable<any>(observer => {
    return source.subscribe({
      next(x) {
        const currentUnixTimestamp = new Date().getTime() - 10; // -10 gap adjustment
        const workUnitTimestamp = x.completeDate.getTime();
        const delay = workUnitTimestamp - currentUnixTimestamp;
        const timer = setTimeout(() => {
          observer.next(x);
        }, delay);
        timers[x.id] = timer;
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      },
    });
  });


const logWorkloadSubmissions: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    map(action => action.payload),
    tap((payload) => console.log('Workload submitted', payload)),
    ignoreElements(),
  )
);

export const submitEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    map(action => action.payload),
    switchMap(payload =>
      workloadService.create(payload).then(response => workloadsActions.created(response))
    )
  );

export const cancelEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(workloadsActions.cancel)),
    map(action => action.payload),
    tap(payload => clearTimer(payload.id)),
    switchMap(payload =>
      workloadService
        .cancel(payload)
        .then(({ id, status }) => workloadsActions.updateStatus({ id, status }))
    )
  );

export const checkStatusEpic: AppEpic = action$ =>
  action$.pipe(
    filter(isActionOf(workloadsActions.created)),
    map(action => action.payload),
    workloadDelay(),
    tap(payload => clearTimer(payload.id)),
    mergeMap(payload =>
      workloadService
        .checkStatus(payload)
        .then(({ id, status }) => workloadsActions.updateStatus({ id, status }))
    )
  );

export const epics = combineEpics(logWorkloadSubmissions, submitEpic, cancelEpic, checkStatusEpic);

export default epics;
