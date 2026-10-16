import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePoints, getRewardsReport } from './rewards.js';

test('purchases at or below $50 earn no points', () => {
  assert.equal(calculatePoints(0), 0);
  assert.equal(calculatePoints(49.99), 0);
  assert.equal(calculatePoints(50), 0);
});

test('the first dollar above $50 earns one point', () => {
  assert.equal(calculatePoints(50.99), 0);
  assert.equal(calculatePoints(51), 1);
});

test('$100 earns 50 points', () => {
  assert.equal(calculatePoints(100), 50);
});

test('the example $120 purchase earns 90 points', () => {
  assert.equal(calculatePoints(120), 90);
});

test('purchases above $100 earn two points per additional dollar', () => {
  assert.equal(calculatePoints(101), 52);
  assert.equal(calculatePoints(150), 150);
});

test('cents do not count as another whole dollar', () => {
  assert.equal(calculatePoints(100.99), 50);
  assert.equal(calculatePoints(120.75), 90);
});

test('invalid purchase amounts are rejected', () => {
  assert.throws(() => calculatePoints(-1));
  assert.throws(() => calculatePoints(NaN));
  assert.throws(() => calculatePoints('120'));
});

test('each purchase is scored separately', () => {
  const report = getRewardsReport(
    [{ id: '1', name: 'Sam' }],
    [
      { id: 'T1', customerId: '1', date: '2026-07-01', amount: 60 },
      { id: 'T2', customerId: '1', date: '2026-07-02', amount: 60 },
    ]
  );
  assert.equal(report.rows[0].total, 20);
});

test('monthly and overall totals are correct', () => {
  const report = getRewardsReport(
    [{ id: '1', name: 'Sam' }, { id: '2', name: 'Jo' }],
    [
      { id: 'T1', customerId: '1', date: '2026-07-01', amount: 120 },
      { id: 'T2', customerId: '1', date: '2026-08-01', amount: 100 },
      { id: 'T3', customerId: '2', date: '2026-09-01', amount: 150 },
    ],
    ['2026-07', '2026-08', '2026-09']
  );

  const sam = report.rows.find((row) => row.id === '1');
  assert.deepEqual(sam.monthly, { '2026-07': 90, '2026-08': 50, '2026-09': 0 });
  assert.equal(sam.total, 140);
  assert.equal(report.totalPoints, 290);
});

test('an empty month remains visible with zero points', () => {
  const report = getRewardsReport(
    [{ id: '1', name: 'Sam' }],
    [{ id: 'T1', customerId: '1', date: '2026-07-01', amount: 120 }],
    ['2026-07', '2026-08', '2026-09']
  );
  assert.deepEqual(report.months, ['2026-07', '2026-08', '2026-09']);
  assert.deepEqual(report.rows[0].monthly, { '2026-07': 90, '2026-08': 0, '2026-09': 0 });
});

test('a customer with no transactions still appears', () => {
  const report = getRewardsReport(
    [{ id: '1', name: 'Sam' }, { id: '2', name: 'Jo' }],
    [{ id: 'T1', customerId: '1', date: '2026-07-01', amount: 120 }],
    ['2026-07', '2026-08', '2026-09']
  );
  const jo = report.rows.find((row) => row.id === '2');
  assert.equal(jo.total, 0);
  assert.equal(jo.purchaseCount, 0);
});

test('unknown customers are not silently ignored', () => {
  assert.throws(() => getRewardsReport([], [
    { id: 'T1', customerId: 'missing', date: '2026-07-01', amount: 120 },
  ]));
});

test('transactions outside the selected months are rejected', () => {
  assert.throws(() => getRewardsReport(
    [{ id: '1', name: 'Sam' }],
    [{ id: 'T1', customerId: '1', date: '2026-06-01', amount: 120 }],
    ['2026-07', '2026-08', '2026-09']
  ));
});
