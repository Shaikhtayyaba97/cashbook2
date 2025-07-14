import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/types";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>A list of your recent cash-in and cash-out transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>
                    <span className="sr-only">Actions</span>
                </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                    <TableCell>
                        <Badge
                        variant={transaction.type === "cash-in" ? "default" : "destructive"}
                        className={
                            transaction.type === "cash-in"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700"
                            : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700"
                        }
                        >
                        {transaction.type === "cash-in" ? "Cash In" : "Cash Out"}
                        </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                        {transaction.description}
                    </TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell
                        className={`text-right font-semibold ${
                        transaction.type === "cash-in" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {transaction.type === "cash-in" ? "+" : "-"}
                        {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(transaction)}>
                            <Pencil className="mr-2 h-4 w-4"/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onDelete(transaction.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
        <div className="md:hidden">
            {transactions.length > 0 ? (
                <div className="space-y-4">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                        <Badge
                            variant={transaction.type === "cash-in" ? "default" : "destructive"}
                            className={
                            transaction.type === "cash-in"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300 dark:border-green-700"
                                : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700"
                            }
                        >
                            {transaction.type === "cash-in" ? "Cash In" : "Cash Out"}
                        </Badge>
                        <div
                            className={`font-semibold ${
                            transaction.type === "cash-in" ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {transaction.type === "cash-in" ? "+" : "-"}
                            {formatAmount(transaction.amount)}
                        </div>
                        </div>
                        <p className="font-medium text-sm text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(transaction)}>
                            <Pencil className="mr-2 h-4 w-4"/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onDelete(transaction.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="h-24 text-center flex items-center justify-center">
                <p>No transactions found.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
