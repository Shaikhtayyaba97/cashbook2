import type { Transaction } from './types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'cash-in',
    amount: 1500.00,
    description: 'Monthly Salary',
    date: new Date('2024-05-01'),
  },
  {
    id: '2',
    type: 'cash-out',
    amount: 750.00,
    description: 'Apartment Rent',
    date: new Date('2024-05-01'),
  },
  {
    id: '3',
    type: 'cash-out',
    amount: 85.50,
    description: 'Groceries',
    date: new Date('2024-05-05'),
  },
  {
    id: '4',
    type: 'cash-out',
    amount: 50.00,
    description: 'Internet Bill',
    date: new Date('2024-05-10'),
  },
  {
    id: '5',
    type: 'cash-in',
    amount: 250.00,
    description: 'Freelance Project',
    date: new Date('2024-05-15'),
  },
   {
    id: '6',
    type: 'cash-out',
    amount: 45.20,
    description: 'Dinner with friends',
    date: new Date('2024-04-18'),
  },
  {
    id: '7',
    type: 'cash-in',
    amount: 2000.00,
    description: 'Monthly Salary',
    date: new Date('2024-04-01'),
  },
];
