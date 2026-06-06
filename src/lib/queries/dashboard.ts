import { getActiveAccounts } from "./accounts";
import { getOperations } from "./operations";

export async function getDashboardStats() {
  const [accounts, operations] = await Promise.all([
    getActiveAccounts(),
    getOperations() // Récupère toutes les opérations actives
  ]);

  let totalBalance = accounts.reduce((sum, acc) => sum + acc.opening_balance, 0);
  
  const accountBalances: Record<string, number> = {};
  accounts.forEach(acc => accountBalances[acc.id] = acc.opening_balance);

  let totalReceivables = 0;
  let totalDebts = 0;
  let thisMonthIncome = 0;
  let thisMonthExpense = 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  operations.forEach(op => {
    const activePayments = op.payments?.filter(p => p.status === 'active') || [];
    const sumPayments = activePayments.reduce((sum, p) => sum + p.amount, 0);
    const totalPaid = op.initial_paid_amount + sumPayments;
    const remaining = op.total_amount - totalPaid;

    const opDate = new Date(op.operation_date);
    const isThisMonth = opDate.getMonth() === currentMonth && opDate.getFullYear() === currentYear;

    if (op.operation_type === "income") {
      totalBalance += totalPaid;
      if (remaining > 0) totalReceivables += remaining;
      if (isThisMonth) thisMonthIncome += op.total_amount;
      
      if (op.initial_account_id && op.initial_paid_amount > 0) {
        if (accountBalances[op.initial_account_id] !== undefined) {
          accountBalances[op.initial_account_id] += op.initial_paid_amount;
        }
      }
      activePayments.forEach(p => {
        if (p.account_id && accountBalances[p.account_id] !== undefined) {
          accountBalances[p.account_id] += p.amount;
        }
      });
    } else {
      totalBalance -= totalPaid;
      if (remaining > 0) totalDebts += remaining;
      if (isThisMonth) thisMonthExpense += op.total_amount;

      if (op.initial_account_id && op.initial_paid_amount > 0) {
        if (accountBalances[op.initial_account_id] !== undefined) {
          accountBalances[op.initial_account_id] -= op.initial_paid_amount;
        }
      }
      activePayments.forEach(p => {
        if (p.account_id && accountBalances[p.account_id] !== undefined) {
          accountBalances[p.account_id] -= p.amount;
        }
      });
    }
  });

  return {
    totalBalance,
    totalReceivables,
    totalDebts,
    thisMonthIncome,
    thisMonthExpense,
    recentOperations: operations.slice(0, 5),
    accountBalances
  };
}
