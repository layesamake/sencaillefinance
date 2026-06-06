import { createClient } from "@/lib/supabase/server";

export async function getReportsData() {
  const supabase = await createClient();

  const { data: operations, error } = await supabase
    .from("operations")
    .select(`
      *,
      categories ( name )
    `)
    .eq("status", "active")
    .order("operation_date", { ascending: true });

  if (error) {
    console.error("[getReportsData]", error);
    return null;
  }

  // Aggregate by Month (last 6 months)
  const monthlyData: Record<string, { monthStr: string, income: number, expense: number }> = {};
  
  // Initialize last 6 months
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthStr = d.toLocaleString('fr-FR', { month: 'short' });
    monthlyData[key] = { monthStr: monthStr.charAt(0).toUpperCase() + monthStr.slice(1), income: 0, expense: 0 };
  }

  const categoryExpenses: Record<string, { name: string, amount: number, color: string }> = {};
  const categoryIncomes: Record<string, { name: string, amount: number, color: string }> = {};

  operations.forEach(op => {
    // 1. Monthly Evolution
    const d = new Date(op.operation_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData[key]) {
      if (op.operation_type === "income") {
        monthlyData[key].income += op.total_amount;
      } else {
        monthlyData[key].expense += op.total_amount;
      }
    }

    // 2. Category Breakdown (restrict to last 6 months to match main chart logic)
    if (monthlyData[key]) {
      const catName = op.categories?.name || "Sans catégorie";
      if (op.operation_type === "income") {
        if (!categoryIncomes[catName]) categoryIncomes[catName] = { name: catName, amount: 0, color: "" };
        categoryIncomes[catName].amount += op.total_amount;
      } else {
        if (!categoryExpenses[catName]) categoryExpenses[catName] = { name: catName, amount: 0, color: "" };
        categoryExpenses[catName].amount += op.total_amount;
      }
    }
  });

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  
  const sortAndColorize = (obj: any) => {
    const arr = Object.values(obj) as any[];
    arr.sort((a, b) => b.amount - a.amount);
    arr.forEach((item, i) => {
      item.color = colors[i % colors.length];
    });
    return arr;
  };

  return {
    monthlyData: Object.values(monthlyData),
    categoryExpenses: sortAndColorize(categoryExpenses),
    categoryIncomes: sortAndColorize(categoryIncomes)
  };
}
