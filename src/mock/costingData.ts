/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ensec ERP - Initial Manufacturing Costing & Expense Management Data
 */

import { ExpenseEntry, CostAllocationRecord, FactoryExpenseSubcategory, OtherBusinessExpenseSubcategory } from '../types/costing.ts';

export const FACTORY_EXPENSE_SUBCATEGORIES: FactoryExpenseSubcategory[] = [
  'Factory Rent',
  'Electricity Bill',
  'Generator Fuel',
  'Machine Maintenance',
  'Factory Labour',
  'Production Supervisor Salary',
  'Quality Control Expenses',
  'Packaging Expenses',
  'Factory Utilities',
  'Other Production Expenses',
];

export const OTHER_BUSINESS_EXPENSE_SUBCATEGORIES: OtherBusinessExpenseSubcategory[] = [
  'Warehouse Expenses',
  'Transportation Expenses',
  'Administrative Expenses',
  'Office Rent',
  'Marketing Expenses',
  'Sales Expenses',
  'Bank Charges',
  'Other General Expenses',
];

export const INITIAL_EXPENSE_ENTRIES: ExpenseEntry[] = [
  {
    id: 'exp-fac-2026-714',
    voucherNumber: 'EXP-FAC-2026-714',
    expenseDate: '2026-11-10',
    mainCategory: 'Factory Expenses',
    subcategory: 'Electricity Bill',
    department: 'Kushtia Factory',
    costCenter: 'Kushtia Lithium Battery Plant',
    factoryWarehouse: 'Kushtia Factory Plant',
    productionBatchRef: 'KUS-B2610-34',
    amount: 5000,
    paymentMethod: 'Cash',
    description: 'Monthly industrial factory electricity grid power for battery assembly & cell balancing',
    approvalStatus: 'Approved',
    allocationStatus: 'Fully Allocated',
    allocatedAmount: 5000,
    remainingUnallocated: 0,
    createdBy: 'Mustafizur Rahman (Plant Head)',
    approvedBy: 'Super Admin',
    createdAt: '2026-11-10T08:00:00.000Z',
  },
  {
    id: 'exp-fac-2026-888',
    voucherNumber: 'EXP-FAC-2026-888',
    expenseDate: '2026-11-10',
    mainCategory: 'Factory Expenses',
    subcategory: 'Generator Fuel',
    department: 'Kushtia Factory',
    costCenter: 'Kushtia Lithium Battery Plant',
    factoryWarehouse: 'Kushtia Factory Plant',
    productionBatchRef: 'KUS-B2610-34',
    amount: 3000,
    paymentMethod: 'Cash',
    description: 'Generator fuel & diesel consumption for uninterrupted assembly line backup power',
    approvalStatus: 'Approved',
    allocationStatus: 'Fully Allocated',
    allocatedAmount: 3000,
    remainingUnallocated: 0,
    createdBy: 'Mustafizur Rahman (Plant Head)',
    approvedBy: 'Super Admin',
    createdAt: '2026-11-10T08:30:00.000Z',
  },
];

export const INITIAL_COST_ALLOCATIONS: CostAllocationRecord[] = [
  {
    id: 'alc-2026-714-34',
    allocationDate: '2026-11-10',
    expenseId: 'exp-fac-2026-714',
    expenseVoucherNo: 'EXP-FAC-2026-714',
    expenseCategory: 'Factory Expenses',
    expenseSubcategory: 'Electricity Bill',
    totalExpenseAmount: 5000,
    allocationMethod: 'Production Quantity Based',
    productionOrderId: '18',
    productionBatchNumber: 'KUS-B2610-34',
    productName: '60V170Ah',
    productId: '5',
    allocatedAmount: 5000,
    basisValue: 1,
    totalBasisValue: 1,
    notes: 'Electricity absorption allocated to production batch KUS-B2610-34',
    allocatedBy: 'Mustafizur Rahman (Plant Head)',
    createdAt: '2026-11-10T08:15:00.000Z',
  },
  {
    id: 'alc-2026-888-34',
    allocationDate: '2026-11-10',
    expenseId: 'exp-fac-2026-888',
    expenseVoucherNo: 'EXP-FAC-2026-888',
    expenseCategory: 'Factory Expenses',
    expenseSubcategory: 'Generator Fuel',
    totalExpenseAmount: 3000,
    allocationMethod: 'Production Quantity Based',
    productionOrderId: '18',
    productionBatchNumber: 'KUS-B2610-34',
    productName: '60V170Ah',
    productId: '5',
    allocatedAmount: 3000,
    basisValue: 1,
    totalBasisValue: 1,
    notes: 'Generator fuel absorption allocated to production batch KUS-B2610-34',
    allocatedBy: 'Mustafizur Rahman (Plant Head)',
    createdAt: '2026-11-10T08:45:00.000Z',
  },
];

