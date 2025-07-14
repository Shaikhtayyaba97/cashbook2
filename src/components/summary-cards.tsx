import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Sigma } from "lucide-react";
import type { Transaction } from "@/lib/types";

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const { totalIn, totalOut, netBalance } = useMemo(() => {
    let totalIn = 0;
    let totalOut = 0;
    transactions.forEach(t => {
      if (t.type === 'cash-in') {
        totalIn += t.amount;
      } else {
        totalOut += t.amount;
      }
    });
    const netBalance = totalIn - totalOut;
    return { totalIn, totalOut, netBalance };
  }, [transactions]);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cash In</CardTitle>
          <ArrowUpCircle className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatAmount(totalIn)}</div>
          <p className="text-xs text-muted-foreground">Total income received</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cash Out</CardTitle>
          <ArrowDownCircle className="h-5 w-5 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatAmount(totalOut)}</div>
          <p className="text-xs text-muted-foreground">Total expenses paid</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <Sigma className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatAmount(netBalance)}
          </div>
          <p className="text-xs text-muted-foreground">Your current financial standing</p>
        </CardContent>
      </Card>
    </div>
  );
}
