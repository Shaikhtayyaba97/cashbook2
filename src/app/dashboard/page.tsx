"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Header } from "@/components/header";
import { SummaryCards } from "@/components/summary-cards";
import { TransactionTable } from "@/components/transaction-table";
import { TransactionForm, type TransactionFormValues, type TransactionType } from "@/components/transaction-form";
import type { Transaction } from "@/lib/types";

const LOCAL_STORAGE_KEY = 'ledgerlite-transactions';

// Helper to get the last 12 months
const getLast12Months = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push(date.toLocaleString('default', { month: 'long', year: 'numeric' }));
    }
    return months;
};

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load transactions from localStorage on initial render
    useEffect(() => {
        try {
            const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedTransactions) {
                const parsedTransactions = JSON.parse(storedTransactions);
                // Convert date strings back to Date objects
                const transactionsWithDates = parsedTransactions.map((t: any) => ({
                    ...t,
                    date: new Date(t.date),
                }));
                setTransactions(transactionsWithDates);
            }
        } catch (error) {
            console.error("Failed to load transactions from local storage:", error);
        }
        setIsLoading(false);
    }, []);

    // Save transactions to localStorage whenever they change
    useEffect(() => {
        // We don't save during the initial load
        if (isLoading) return;
        try {
            // Sort transactions by date descending before saving
            const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
            const dataToStore = JSON.stringify(sortedTransactions);
            localStorage.setItem(LOCAL_STORAGE_KEY, dataToStore);
        } catch (error) {
            console.error("Failed to save transactions to local storage:", error);
        }
    }, [transactions, isLoading]);

    const [filterMonth, setFilterMonth] = useState<string>('All Months');
    const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<{ type: TransactionType, editing: boolean }>({ type: 'cash-in', editing: false });
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

    const handleAddTransaction = (type: TransactionType) => {
        setEditingTransaction(null);
        setSheetMode({ type, editing: false });
        setIsSheetOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setSheetMode({ type: transaction.type, editing: true });
        setIsSheetOpen(true);
    };
    
    const handleDeleteConfirm = async () => {
        if (deletingTransactionId) {
            setTransactions(transactions.filter(t => t.id !== deletingTransactionId));
            setDeletingTransactionId(null);
        }
    };

    const handleSaveTransaction = async (data: TransactionFormValues) => {
        if (editingTransaction) {
            // Update existing transaction
            setTransactions(transactions.map(t => 
                t.id === editingTransaction.id ? { ...editingTransaction, ...data } : t
            ));
        } else {
            // Add new transaction
            const newTransaction: Transaction = {
                id: uuidv4(),
                ...data,
            };
            setTransactions([...transactions, newTransaction]);
        }
        
        setIsSheetOpen(false);
        setEditingTransaction(null);
    };

    const availableMonths = useMemo(() => {
        const months = getLast12Months();
        months.unshift('All Months');
        return months;
    }, []);
    
    const sortedTransactions = useMemo(() => {
         return [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [transactions]);


    const filteredTransactions = useMemo(() => {
        let monthFiltered = sortedTransactions;

        if (filterMonth !== 'All Months') {
            monthFiltered = sortedTransactions.filter(t => {
                const monthYear = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                return monthYear === filterMonth;
            });
        }
        
        if (filterType === 'all') {
            return monthFiltered;
        }

        return monthFiltered.filter(t => t.type === filterType);

    }, [sortedTransactions, filterMonth, filterType]);

    const summaryTransactions = useMemo(() => {
         if (filterMonth === 'All Months') {
            return sortedTransactions;
         }
         return sortedTransactions.filter(t => {
            const monthYear = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            return monthYear === filterMonth;
        });
    }, [sortedTransactions, filterMonth]);
    
    const sheetTitle = sheetMode.editing ? "Edit Transaction" : (sheetMode.type === 'cash-in' ? 'Add Cash In' : 'Add Cash Out');
    const sheetDescription = sheetMode.editing ? "Update the details of your transaction." : `Add a new ${sheetMode.type === 'cash-in' ? 'income' : 'expense'} entry.`;


    if (isLoading) {
        return <div className="flex min-h-screen w-full items-center justify-center">Loading...</div>;
    }
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
                <SummaryCards transactions={summaryTransactions} />
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                         <Select onValueChange={setFilterMonth} defaultValue={filterMonth}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by month" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableMonths.map(month => (
                                    <SelectItem key={month} value={month}>{month}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)} className="w-full sm:w-auto">
                            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="cash-in">Cash In</TabsTrigger>
                                <TabsTrigger value="cash-out">Cash Out</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
                         <Button size="sm" className="h-9 gap-1 flex-1" onClick={() => handleAddTransaction('cash-in')}>
                            <ArrowUpFromLine className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Cash In
                            </span>
                        </Button>
                         <Button size="sm" variant="destructive" className="h-9 gap-1 flex-1" onClick={() => handleAddTransaction('cash-out')}>
                            <ArrowDownToLine className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                                Cash Out
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
                <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
                    <SheetHeader className="pb-4">
                        <SheetTitle>{sheetTitle}</SheetTitle>
                        <SheetDescription>{sheetDescription}</SheetDescription>
                    </SheetHeader>
                    
                    <TransactionForm
                        key={editingTransaction?.id || `new-${sheetMode.type}`}
                        onSubmit={handleSaveTransaction}
                        initialData={editingTransaction}
                        defaultType={sheetMode.type}
                        onCancel={() => setIsSheetOpen(false)}
                    />

                </SheetContent>
            </Sheet>

            <AlertDialog open={!!deletingTransactionId} onOpenChange={() => setDeletingTransactionId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the transaction record.
                        </Description>
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
