import { calculatePoints } from '../utils/rewards.js';
import { formatMoney, formatNumber } from '../utils/format.js';

export default function TransactionTable({ transactions, customerNames }) {
  return (
    <section className="panel" aria-labelledby="transactions-heading">
      <div className="panel-header">
        <div>
          <h2 id="transactions-heading">Transactions</h2>
          <p>Every purchase is scored separately.</p>
        </div>
        <span className="count">{transactions.length} transactions</span>
      </div>

      <div className="table-scroll history-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Date</th>
              <th scope="col">Customer</th>
              <th scope="col">Purchase amount</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="transaction-id">{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{customerNames.get(transaction.customerId)}</td>
                <td>{formatMoney(transaction.amount)}</td>
                <td className="points-total">+{formatNumber(calculatePoints(transaction.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <p className="empty">No transactions found.</p>}
      </div>
    </section>
  );
}
