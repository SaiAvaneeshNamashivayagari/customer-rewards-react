import { formatMonth, formatNumber } from '../utils/format.js';

export default function CustomerTable({ months, customers, search, onSearchChange }) {
  return (
    <section className="panel" aria-labelledby="summary-heading">
      <div className="panel-header">
        <div>
          <h2 id="summary-heading">Points by customer</h2>
          <p>Monthly totals and overall points earned.</p>
        </div>
        <label className="search-wrap">
          <span className="sr-only">Search customers by name or ID</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search customers..."
          />
        </label>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Customer</th>
              {months.map((month) => (
                <th scope="col" key={month}>{formatMonth(month)}</th>
              ))}
              <th scope="col">Total points</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <span className="customer-name">{customer.name}</span>
                  <span className="customer-id">
                    {customer.id} · {customer.purchaseCount} purchases
                  </span>
                </td>
                {months.map((month) => (
                  <td key={month} className={customer.monthly[month] === 0 ? 'muted' : ''}>
                    {formatNumber(customer.monthly[month])}
                  </td>
                ))}
                <td className="points-total">{formatNumber(customer.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="empty">No customers match your search.</p>
        )}
      </div>
    </section>
  );
}
