export interface Transaction {
  id: string;
  type: 'cash-in' | 'cash-out';
  amount: number;
  description: string;
  date: Date;
}
