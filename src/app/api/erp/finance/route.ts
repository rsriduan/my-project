import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF', 'SHAREHOLDER'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const accounts = await prisma.financialAccount.findMany({
      orderBy: { code: 'asc' },
    });

    const transactions = await prisma.financialTransaction.findMany({
      include: {
        account: true,
        createdByUser: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Orders revenue calculation
    const deliveredOrders = await prisma.order.findMany({
      where: { status: 'DELIVERED' },
      select: { totalAmount: true, subtotal: true },
    });
    const orderRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME' || t.type === 'CUSTOMER_RECEIPT')
      .reduce((sum, t) => sum + t.amount, 0) + orderRevenue;

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE' || t.type === 'SALARY' || t.type === 'SUPPLIER_PAYMENT')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpense;

    // Balance Sheet calculation
    const totalCash = accounts.filter((a) => a.type === 'CASH').reduce((sum, a) => sum + a.balance, 0);
    const totalBank = accounts.filter((a) => a.type === 'BANK').reduce((sum, a) => sum + a.balance, 0);

    // Inventory Valuation
    const products = await prisma.product.findMany({
      include: { costing: true },
    });
    const inventoryValuation = products.reduce((sum, p) => {
      const unitCost = p.costing?.totalCost || p.wholesalePrice * 0.7;
      return sum + p.stockQuantity * unitCost;
    }, 0);

    const rawMaterials = await prisma.rawMaterial.findMany();
    const rawMaterialValuation = rawMaterials.reduce(
      (sum, r) => sum + r.currentStock * r.unitPrice,
      0
    );

    const suppliers = await prisma.supplier.findMany();
    const totalPayable = suppliers.reduce((sum, s) => sum + s.balanceDue, 0);

    const totalAssets = totalCash + totalBank + inventoryValuation + rawMaterialValuation;
    const totalLiabilities = totalPayable;
    const totalEquity = totalAssets - totalLiabilities;

    return NextResponse.json({
      accounts,
      transactions,
      metrics: {
        totalIncome,
        totalExpense,
        netProfit,
        orderRevenue,
      },
      balanceSheet: {
        currentAssets: {
          cashInHand: totalCash,
          bankAccounts: totalBank,
          finishedGoodsInventory: Math.round(inventoryValuation),
          rawMaterialsInventory: Math.round(rawMaterialValuation),
          totalAssets: Math.round(totalAssets),
        },
        liabilities: {
          accountsPayableToSuppliers: totalPayable,
          totalLiabilities,
        },
        equity: {
          retainedEarningsAndCapital: Math.round(totalEquity),
          totalEquity: Math.round(totalEquity),
        },
      },
    });
  } catch (error: any) {
    console.error('Finance error:', error);
    return NextResponse.json({ error: 'Failed to fetch financial data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !['ADMIN', 'STAFF'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized: Admin or Staff role required' }, { status: 403 });
    }

    const { accountId, type, amount, category, reference, description } = await req.json();

    if (!accountId || !type || !amount || !description) {
      return NextResponse.json({ error: 'Missing mandatory transaction fields' }, { status: 400 });
    }

    const account = await prisma.financialAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json({ error: 'Financial account not found' }, { status: 404 });
    }

    const parsedAmount = parseFloat(amount);
    const txNum = `TX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Transaction
    const transaction = await prisma.financialTransaction.create({
      data: {
        transactionNumber: txNum,
        accountId,
        type,
        amount: parsedAmount,
        category: category || 'GENERAL',
        reference: reference || null,
        description,
        createdByUserId: user.userId,
      },
    });

    // Update account balance
    const isCredit = ['INCOME', 'CUSTOMER_RECEIPT'].includes(type);
    const balanceChange = isCredit ? parsedAmount : -parsedAmount;

    await prisma.financialAccount.update({
      where: { id: accountId },
      data: {
        balance: { increment: balanceChange },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'FINANCIAL_TRANSACTION_RECORDED',
        entityType: 'FinancialTransaction',
        entityId: transaction.id,
        details: `${type} of ৳${parsedAmount} recorded on account ${account.name}`,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
  }
}
