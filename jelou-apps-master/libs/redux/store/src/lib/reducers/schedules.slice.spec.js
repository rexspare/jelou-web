import {
  fetchSchedules,
  schedulesAdapter,
  schedulesReducer,
} from './schedules.slice';
describe('schedules reducer', () => {
  it('should handle initial state', () => {
    const expected = schedulesAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    });
    expect(schedulesReducer(undefined, { type: '' })).toEqual(expected);
  });
  it('should handle fetchScheduless', () => {
    let state = schedulesReducer(undefined, fetchSchedules.pending(null, null));
    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    );
    state = schedulesReducer(
      state,
      fetchSchedules.fulfilled([{ id: 1 }], null, null)
    );
    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    );
    state = schedulesReducer(
      state,
      fetchSchedules.rejected(new Error('Uh oh'), null, null)
    );
    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    );
  });
});
