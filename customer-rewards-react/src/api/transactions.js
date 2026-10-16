import { customers, reportMonths, transactions } from '../data/transactions.js';

// A delayed response stands in for a real GET /api/transactions request.
export function getTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        months: [...reportMonths],
        customers: customers.map((customer) => ({ ...customer })),
        transactions: transactions.map((transaction) => ({ ...transaction })),
      });
    }, 500);
  });
}
