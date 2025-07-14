"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Header } from "@/components/header";
import { SummaryCards } from "@/components/summary-cards";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionForm, type TransactionFormValues } from "@/components/transaction-form";

import { mockTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";

export default function DashboardPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
    const [userPhone, setUserPhone] = useState<string | null>(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            router.push('/login');
        } else {
            setUserPhone(loggedInUser);
            const storedTransactions = localStorage.getItem(`transactions_${loggedInUser}`);
            if (storedTransactions) {
                const parsed = JSON.parse(storedTransactions).map((t: any) => ({...t, date: new Date(t.date)}));
                setTransactions(parsed);
            } else {
                 setTransactions(mockTransactions);
            }
        }
    }, [router]);
    
    useEffect(() => {
        if(userPhone) {
            localStorage.setItem(`transactions_${userPhone}`, JSON.stringify(transactions));
        }
    }, [transactions, userPhone]);


    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setIsSheetOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsSheetOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deletingTransactionId) {
            setTransactions(prev => prev.filter(t => t.id !== deletingTransactionId));
            setDeletingTransactionId(null);
        }
    };

    const handleSaveTransaction = (data: TransactionFormValues) => {
        if (editingTransaction) {
            setTransactions(prev =>
                prev.map(t =>
                    t.id === editingTransaction.id ? { ...t, ...data, amount: Number(data.amount), date: data.date } : t
                )
            );
        } else {
            setTransactions(prev => [
                {
                    id: new Date().toISOString(),
                    ...data,
                    amount: Number(data.amount),
                    date: data.date,
                },
                ...prev
            ]);
        }
        setIsSheetOpen(false);
        setEditingTransaction(null);
    };

    const availableMonths = useMemo(() => {
        const monthSet = new Set<string>();
        transactions.forEach(t => {
            monthSet.add(new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' }));
        });
        return Array.from(monthSet).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        if (filterMonth === 'all') {
            return transactions;
        }
        return transactions.filter(t => {
            const monthYear = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            return monthYear === filterMonth;
        });
    }, [transactions, filterMonth]);
    
    const sheetTitle = editingTransaction ? "Edit Transaction" : "Add New Transaction";
    const sheetDescription = editingTransaction ? "Update the details of your transaction." : "Add a new cash-in or cash-out entry.";


    if (!userPhone) {
        return <div className="flex min-h-screen w-full items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
                <SummaryCards transactions={filteredTransactions} />
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-auto">
                        <Select onValueChange={setFilterMonth} defaultValue="all">
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Months</SelectItem>
                                {availableMonths.map(month => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                         <Button size="sm" className="h-9 gap-1" onClick={handleAddTransaction}>
                            <PlusCircle className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Transaction
                            </span>
                        </Button>
                    </div>
                </div>
                <TransactionTable
                    transactions={filteredTransactions}
                    onEdit={handleEditTransaction}
                    onDelete={(id) => setDeletingTransactionId(id)}
                />
            </main>

            <Sheet open={isSheetOpen} onOpenChange={(open) => {
                setIsSheetOpen(open);
                if (!open) setEditingTransaction(null);
            }}>
                <SheetContent className="sm:max-w-lg w-[90vw]">
                     <SheetHeader className="pb-4">
                        <SheetTitle>{sheetTitle}</SheetTitle>
                        <SheetDescription>{sheetDescription}</SheetDescription>
                    </SheetHeader>
                    <TransactionForm
                        key={editingTransaction?.id || 'new'}
                        onSubmit={handleSaveTransaction}
                        initialData={editingTransaction}
                    />
                    <SheetFooter className="mt-6">
                         <Button form="transaction-form" type="submit">Save changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={!!deletingTransactionId} onOpenChange={() => setDeletingTransactionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the transaction record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
