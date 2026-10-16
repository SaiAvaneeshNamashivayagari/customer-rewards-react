# Customer Rewards

A React app that calculates loyalty points for each purchase and displays customer totals for July, August and September 2026.

## Getting started

You'll need Node.js 20 or newer and npm. Open this folder in VS Code and run:

```bash
npm install
npm run dev
```

Follow the local URL shown in the terminal (usually `http://localhost:5173`).

To check the code:

```bash
npm test
npm run lint
npm run build
```

## Reward rules

- $50 or less: **0 points**
- Above $50 up to $100: **1 point per dollar over $50**
- Above $100: **50 points**, plus **2 points per dollar over $100**

For example, a $120 purchase earns `50 + (20 × 2) = 90` points.

The requirement doesn't define cents. This project uses whole dollars only, so $120.75 earns 90 points. Points are calculated **per transaction**, not from a customer's combined monthly spending.

## Project structure

```text
src/
  api/transactions.js           Fake API: Promise with a short delay
  api/transactions.test.js      API test
  components/CustomerTable.jsx  Monthly customer totals and search input
  components/TransactionTable.jsx  Individual purchases and points
  data/transactions.js         Six customers and 32 sample purchases
  utils/rewards.js             Point calculation and report totals
  utils/rewards.test.js        Reward calculation tests
  utils/format.js              Date, money and number formatting
  App.jsx                      Data loading, filtering and page layout
  main.jsx                     React entry point
  styles.css                   Responsive styling
```

The sample period is defined by `reportMonths` in `src/data/transactions.js`. All three columns show up, even if nobody purchases anything in one of the months. Customers without purchases in a month get **0**, not a blank cell.

## Implementation notes

This is plain React JavaScript and CSS; no TypeScript, Redux, or backend is required. `getTransactions()` simulates an API using a delayed Promise. It can be replaced by a real request later. Loading and error states are handled in `App.jsx`. The UI uses semantic tables and an accessible search label.

## Upload to GitHub from VS Code

Open the **Source Control** panel, select **Initialize Repository**, stage your files, and commit. Then choose **Publish Branch** (or **Publish to GitHub**) and follow the sign-in prompts.

The `.gitignore` excludes `node_modules`, `dist`, and local environment files.
