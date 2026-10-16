import test from 'node:test';
import assert from 'node:assert/strict';
import { getTransactions } from './transactions.js';

test('the mock API returns sample data asynchronously', async () => {
  const pending = getTransactions();
  assert.equal(typeof pending.then, 'function');

  const data = await pending;
  assert.equal(data.customers.length, 6);
  assert.equal(data.transactions.length, 32);
  assert.deepEqual(data.months, ['2026-07', '2026-08', '2026-09']);
  assert.equal(data.transactions[0].amount, 120);
});

test('each API response returns independent copies of sample data', async () => {
  const first = await getTransactions();
  first.transactions[0].amount = 0;

  const second = await getTransactions();
  assert.equal(second.transactions[0].amount, 120);
});
