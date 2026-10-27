import { useContext } from 'react'
import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { CustomerBankingContext } from './CustomerBankingContext'

export function useCustomerBanking() {
  const context = useContext(CustomerBankingContext)
  if (!context) throw new Error('useCustomerBanking must be used within CustomerBankingProvider.')
  return context
}

export function useCustomerPath() {
  const location = useLocation()
  const basePath = location.pathname.startsWith('/preview/customer') ? '/preview/customer' : '/customer'
  return useCallback((path = '') => path === '/' ? basePath : `${basePath}${path}`, [basePath])
}
