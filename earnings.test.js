import test from 'node:test';
import assert from 'node:assert/strict';
import { elapsed, earned, settle } from './earnings.js';
const base = { rate: 25, elapsedMs: 0, earnedAmount: 0, startedAt: 1000 };
test('one hour accrues one hourly rate', () => { assert.equal(earned(base, 3601000), 25); assert.equal(elapsed(base, 3601000), 3600000); });
test('paused sessions do not accrue', () => { const paused = settle(base, 1801000); assert.equal(earned(paused, 3601000), 12.5); assert.equal(elapsed(paused, 3601000), 1800000); });
test('rate changes preserve already earned pay', () => { const updated = { ...settle(base, 3601000), rate: 50, startedAt: 3601000 }; assert.equal(earned(updated, 7201000), 75); });
test('resuming retains elapsed time and accumulated earnings', () => { const resumed = { ...settle(base, 1801000), startedAt: 3601000 }; assert.equal(earned(resumed, 5401000), 25); assert.equal(elapsed(resumed, 5401000), 3600000); });
test('backward clock movement never subtracts earnings', () => { assert.equal(earned(base, 0), 0); assert.equal(elapsed(base, 0), 0); });
