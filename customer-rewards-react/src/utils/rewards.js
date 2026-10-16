export function calculatePoints(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new Error('Purchase amount must be a non-negative number');
  }

  // The program awards points for whole dollars, not cents.
  const dollars = Math.floor(amount);
  const onePointDollars = Math.min(Math.max(dollars - 50, 0), 50);
  const twoPointDollars = Math.max(dollars - 100, 0);

  return onePointDollars + twoPointDollars * 2;
}

export function getRewardsReport(customers, transactions, reportMonths) {
  const months = reportMonths ?? [
    ...new Set(transactions.map((transaction) => transaction.date.slice(0, 7))),
  ].sort();

  const rows = customers.map((customer) => ({
    ...customer,
    monthly: Object.fromEntries(months.map((month) => [month, 0])),
    total: 0,
    purchaseCount: 0,
  }));

  const customersById = new Map(rows.map((customer) => [customer.id, customer]));

  for (const transaction of transactions) {
    const customer = customersById.get(transaction.customerId);
    if (!customer) {
      throw new Error(`Unknown customer: ${transaction.customerId}`);
    }

    const month = transaction.date.slice(0, 7);
    if (!Object.hasOwn(customer.monthly, month)) {
      throw new Error(`Transaction ${transaction.id ?? ''} is outside the report period`);
    }

    const points = calculatePoints(transaction.amount);
    customer.monthly[month] += points;
    customer.total += points;
    customer.purchaseCount += 1;
  }

  rows.sort((first, second) => second.total - first.total || first.name.localeCompare(second.name));

  return {
    months,
    rows,
    totalPoints: rows.reduce((sum, customer) => sum + customer.total, 0),
  };
}
