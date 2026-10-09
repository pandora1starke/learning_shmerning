export function elapsed(state, now = Date.now()) {
  return state.elapsedMs + (state.startedAt === null ? 0 : Math.max(0, now - state.startedAt));
}
export function earned(state, now = Date.now()) {
  return state.earnedAmount + (state.startedAt === null ? 0 : Math.max(0, now - state.startedAt) * state.rate / 3600000);
}
export function settle(state, now = Date.now()) {
  return { ...state, elapsedMs: elapsed(state, now), earnedAmount: earned(state, now), startedAt: null };
}
