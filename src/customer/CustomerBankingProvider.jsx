import { useCallback, useMemo, useState } from 'react'
import { CustomerBankingContext } from './CustomerBankingContext'

const initialAccounts = [
  {
    id: 'acc-savings',
    name: 'Everyday savings',
    type: 'Savings',
    number: '•••• •••• 4821',
    balance: 84250.75,
    available: 84250.75,
    currency: 'INR',
    status: 'Active',
    opened: '2022-06-14',
    branch: 'Bengaluru Main',
    color: 'blue',
  },
  {
    id: 'acc-current',
    name: 'Current account',
    type: 'Current',
    number: '•••• •••• 1906',
    balance: 126800,
    available: 126800,
    currency: 'INR',
    status: 'Active',
    opened: '2023-02-08',
    branch: 'Indiranagar',
    color: 'violet',
  },
]

const initialBeneficiaries = [
  { id: 'ben-1', name: 'Ananya Rao', bank: 'BankSphere', account: '•••• 7312', accountNumber: '1234567312', ifsc: 'BSBK0001024', added: '2025-11-12' },
  { id: 'ben-2', name: 'Rahul Mehta', bank: 'State Bank of India', account: '•••• 8450', accountNumber: '2098768450', ifsc: 'SBIN0001842', added: '2025-08-03' },
  { id: 'ben-3', name: 'Mira Shah', bank: 'HDFC Bank', account: '•••• 3926', accountNumber: '5578123926', ifsc: 'HDFC0000281', added: '2025-04-21' },
]

const initialTransactions = [
  { id: 'TXN-260618-001', date: '2026-06-18T10:42:00', title: 'Salary credit', category: 'Income', accountId: 'acc-savings', account: 'Savings ••4821', reference: 'SAL-061826-71', amount: 72500, status: 'Completed' },
  { id: 'TXN-260617-003', date: '2026-06-17T18:24:00', title: 'Payment to Ananya Rao', category: 'Transfer', accountId: 'acc-savings', account: 'Savings ••4821', reference: 'NEFT-061726-42', amount: -4200, status: 'Completed' },
  { id: 'TXN-260616-002', date: '2026-06-16T13:10:00', title: 'Fresh Basket Market', category: 'Shopping', accountId: 'acc-current', account: 'Current ••1906', reference: 'POS-061626-18', amount: -1865.5, status: 'Completed' },
  { id: 'TXN-260615-001', date: '2026-06-15T09:32:00', title: 'Cafe Juniper', category: 'Food & drink', accountId: 'acc-savings', account: 'Savings ••4821', reference: 'UPI-061526-95', amount: -540, status: 'Completed' },
  { id: 'TXN-260613-004', date: '2026-06-13T16:08:00', title: 'Electricity bill', category: 'Bills', accountId: 'acc-current', account: 'Current ••1906', reference: 'BBPS-061326-04', amount: -2340, status: 'Completed' },
  { id: 'TXN-260612-001', date: '2026-06-12T11:55:00', title: 'Payment from Mira Shah', category: 'Transfer', accountId: 'acc-savings', account: 'Savings ••4821', reference: 'IMPS-061226-33', amount: 8500, status: 'Completed' },
  { id: 'TXN-260610-002', date: '2026-06-10T20:14:00', title: 'Metro card top-up', category: 'Travel', accountId: 'acc-savings', account: 'Savings ••4821', reference: 'UPI-061026-19', amount: -1200, status: 'Completed' },
]

export function CustomerBankingProvider({ children }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries)
  const [transactions, setTransactions] = useState(initialTransactions)

  const addBeneficiary = useCallback((beneficiary) => {
    const next = { ...beneficiary, id: `ben-${Date.now()}`, added: new Date().toISOString().slice(0, 10) }
    setBeneficiaries((current) => [...current, next])
    return next
  }, [])

  const updateBeneficiary = useCallback((id, updates) => {
    setBeneficiaries((current) => current.map((beneficiary) =>
      beneficiary.id === id ? { ...beneficiary, ...updates } : beneficiary
    ))
  }, [])

  const removeBeneficiary = useCallback((id) => {
    setBeneficiaries((current) => current.filter((beneficiary) => beneficiary.id !== id))
  }, [])

  const transfer = useCallback(({ fromAccountId, beneficiaryId, amount, note }) => {
    const value = Number(amount)
    const account = accounts.find((item) => item.id === fromAccountId)
    const beneficiary = beneficiaries.find((item) => item.id === beneficiaryId)
    if (!account || !beneficiary) throw new Error('Choose an account and beneficiary.')
    if (!Number.isFinite(value) || value <= 0) throw new Error('Enter an amount greater than zero.')
    if (value > account.available) throw new Error('The amount exceeds the available balance.')

    const now = new Date()
    const reference = `DEMO-${now.getTime().toString().slice(-8)}`
    const transaction = {
      id: `TXN-${now.getTime()}`,
      date: now.toISOString(),
      title: `Payment to ${beneficiary.name}`,
      category: 'Transfer',
      accountId: account.id,
      account: `${account.type} ${account.number.slice(-4)}`,
      reference,
      amount: -value,
      status: 'Completed',
      note: note.trim(),
    }
    setAccounts((current) => current.map((item) =>
      item.id === account.id
        ? { ...item, balance: item.balance - value, available: item.available - value }
        : item
    ))
    setTransactions((current) => [transaction, ...current])
    return transaction
  }, [accounts, beneficiaries])

  const value = useMemo(() => ({
    accounts,
    beneficiaries,
    transactions,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    transfer,
  }), [accounts, beneficiaries, transactions, addBeneficiary, updateBeneficiary, removeBeneficiary, transfer])

  return <CustomerBankingContext.Provider value={value}>{children}</CustomerBankingContext.Provider>
}
