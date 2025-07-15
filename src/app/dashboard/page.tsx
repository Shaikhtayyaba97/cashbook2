
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

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
import { useToast } from "@/hooks/use-toast";

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
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const transactionsRef = user ? collection(db, "users", user.uid, "transactions") : null;
    const [transactionsSnapshot, loading, error] = useCollection(transactionsRef ? query(transactionsRef, orderBy("date", "desc")) : null);

    const transactions: Transaction[] = useMemo(() => {
        if (!transactionsSnapshot) return [];
        return transactionsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: (data.date as Timestamp).toDate(),
            } as Transaction;
        });
    }, [transactionsSnapshot]);
    
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: "Error loading transactions",
                description: error.message,
            });
        }
    }, [error, toast]);
    
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
        if (deletingTransactionId && transactionsRef) {
            try {
                await deleteDoc(doc(transactionsRef, deletingTransactionId));
                toast({ title: "Transaction deleted" });
            } catch (error: any) {
                toast({ variant: "destructive", title: "Error", description: error.message });
            }
            setDeletingTransactionId(null);
        }
    };

    const handleSaveTransaction = async (data: TransactionFormValues) => {
        if (!transactionsRef) return;
        try {
            if (editingTransaction) {
                const transactionDoc = doc(transactionsRef, editingTransaction.id);
                await updateDoc(transactionDoc, data);
                toast({ title: "Transaction updated" });
            } else {
                await addDoc(transactionsRef, {
                    ...data,
                    createdAt: Timestamp.now(),
                });
                toast({ title: "Transaction added" });
            }
            setIsSheetOpen(false);
            setEditingTransaction(null);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    const availableMonths = useMemo(() => {
        const months = getLast12Months();
        months.unshift('All Months');
        return months;
    }, []);

    const filteredTransactions = useMemo(() => {
        let monthFiltered = transactions;

        if (filterMonth !== 'All Months') {
            monthFiltered = transactions.filter(t => {
                const monthYear = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                return monthYear === filterMonth;
            });
        }
        
        if (filterType === 'all') {
            return monthFiltered;
        }

        return monthFiltered.filter(t => t.type === filterType);

    }, [transactions, filterMonth, filterType]);

    const summaryTransactions = useMemo(() => {
         if (filterMonth === 'All Months') {
            return transactions;
         }
         return transactions.filter(t => {
            const monthYear = new Date(t.date).toLocaleString('default', { month: 'long', year: 'numeric' });
            return monthYear === filterMonth;
        });
    }, [transactions, filterMonth]);
    
    const sheetTitle = sheetMode.editing ? "Edit Transaction" : (sheetMode.type === 'cash-in' ? 'Add Cash In' : 'Add Cash Out');
    const sheetDescription = sheetMode.editing ? "Update the details of your transaction." : `Add a new ${sheetMode.type === 'cash-in' ? 'income' : 'expense'} entry.`;

    if (authLoading || loading) {
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
