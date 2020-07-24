import { cancel, created, submit } from './actions';
import { submitEpic, checkStatusEpic } from './epics';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { Subject } from 'rxjs';
import { RootState, RootAction } from '../reducer';
import moment from 'moment';

let action$: ActionsObservable<RootAction>;
let state$: StateObservable<RootState>;

describe('Epics', () => {
    it('Should create a workload when complexity submitted', () => {
        const submitAction = submit({
            complexity: 5,
        });
        state$ = new StateObservable(new Subject<RootState>(), { workloads: {}, });
        action$ = ActionsObservable.of(submitAction);
        const responseActions = submitEpic(action$, state$, null);
        responseActions.subscribe(outputAction => {
            const { payload } = outputAction;
            expect(outputAction.type).toEqual('workload/CREATED');
            expect(payload).toHaveProperty('complexity');
            expect(payload).toHaveProperty('id');
            expect(payload).toHaveProperty('status');
            expect(payload).toHaveProperty('completeDate');
        });
    });
});
