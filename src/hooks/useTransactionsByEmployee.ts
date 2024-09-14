import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, RequestByEmployeeParams, Transaction } from "../utils/types"
import { PaginatedTransactionsByEmployeeResult, TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<Transaction[] | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )

      setTransactionsByEmployee(data)
    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}

export function usePaginatedTransactionsByEmployee(): PaginatedTransactionsByEmployeeResult  {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactionsByEmployee, setPaginatedTransactionsByEmployee] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)
  const [id, setId] = useState<string>("");

  const fetch = useCallback(
    async (employeeId: string, page: number | null = 0) => {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, RequestByEmployeeParams & PaginatedRequestParams>(
        "paginatedTransactionsByEmployee",
        {
          page,
          employeeId,
        }
      )

      setPaginatedTransactionsByEmployee((previousResponse) => {
        if (response === null || previousResponse === null) {
          return response
        }
        
        return { data: page === 0 ? response.data : [...previousResponse.data, ...response.data], nextPage: response.nextPage }
      })
    },
    [fetchWithCache]
  )

  const fetchById = useCallback(
    async (employeeId: string) => {
      setId(employeeId)
      fetch(employeeId, 0)
    },
    [fetch]
  )

  const fetchNext = () =>
    fetch(id, paginatedTransactionsByEmployee?.nextPage)

  const invalidateData = useCallback(() => {
    setPaginatedTransactionsByEmployee(null)
  }, [])

  return { data: paginatedTransactionsByEmployee, loading, fetchById, fetchNext, invalidateData }
}

