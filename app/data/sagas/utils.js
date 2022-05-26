/* eslint-disable func-names */
import { fork, cancel, take } from 'redux-saga/effects';

export function* takeMultipleLatestSaga(sagasByPatterns, ...args) {
  const patterns = Object.keys(sagasByPatterns);
  const task = yield fork(function*() {
    let lastTask;
    while (true) {
      const action = yield take(patterns);
      if (lastTask) {
        yield cancel(lastTask);
      }
      lastTask = yield fork(
        sagasByPatterns[action.type],
        ...args.concat(action),
      );
    }
  });
  return task;
}
