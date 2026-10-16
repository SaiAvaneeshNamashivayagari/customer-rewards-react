import { useEffect, useMemo, useState } from 'react';
import { getTransactions } from './api/transactions.js';
import CustomerTable from './components/CustomerTable.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import { formatMonth, formatNumber } from './utils/format.js';
import { getRewardsReport } from './utils/rewards.js';

function StatCard({ label, value, description }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <strong>{value}</strong>
      <span>{description}</span>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    getTransactions()
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError('Unable to load purchases. Please refresh the page.');
      });

    return () => { active = false; };
  }, []);

  const report = useMemo(() => (
    data ? getRewardsReport(data.customers, data.transactions, data.months) : null
  ), [data]);

  const query = search.trim().toLowerCase();
  const filteredCustomers = report?.rows.filter((customer) => (
    customer.name.toLowerCase().includes(query) || customer.id.toLowerCase().includes(query)
  )) ?? [];

  const matchingIds = new Set(filteredCustomers.map((customer) => customer.id));
  const filteredTransactions = data?.transactions
    .filter((transaction) => matchingIds.has(transaction.customerId))
    .sort((first, second) => second.date.localeCompare(first.date) || second.id.localeCompare(first.id)) ?? [];

  const customerNames = new Map(data?.customers.map((customer) => [customer.id, customer.name]) ?? []);
  const period = data ? `${formatMonth(data.months[0])} – ${formatMonth(data.months.at(-1))}` : '';

  return (
    <div className="page">
      <header className="top-bar">
        <div className="brand-mark" aria-hidden="true">R</div>
        <span>Retail Rewards</span>
        <span className="top-label">Customer loyalty program</span>
      </header>

      <main className="container">
        <div className="page-title">
          <div>
            <p className="eyebrow">REWARDS OVERVIEW</p>
            <h1>Customer rewards summary</h1>
            <p>Reward points earned from purchases over three months.</p>
          </div>
          {data && <span className="period">{period}</span>}
        </div>

        {error && <div className="message error" role="alert">{error}</div>}
        {!data && !error && <div className="message" role="status">Loading transactions...</div>}

        {report && (
          <>
            <section className="stats" aria-label="Reward statistics">
              <StatCard label="Total points earned" value={formatNumber(report.totalPoints)} description="Across all purchases" />
              <StatCard label="Customers" value={formatNumber(report.rows.length)} description="Enrolled customers" />
              <StatCard label="Transactions" value={formatNumber(data.transactions.length)} description="Across the three-month period" />
            </section>

            <CustomerTable
              months={report.months}
              customers={filteredCustomers}
              search={search}
              onSearchChange={setSearch}
            />
            <TransactionTable transactions={filteredTransactions} customerNames={customerNames} />

            <aside className="rule-note">
              <strong>How rewards are calculated</strong>
              <p>The first $50 earns no points. Each whole dollar from $51 to $100 earns 1 point, and each whole dollar above $100 earns 2 points. A $120 purchase earns 90 points.</p>
            </aside>
          </>
        )}
      </main>
      <footer>Retail Rewards · Example transaction data</footer>
    </div>
  );
}
