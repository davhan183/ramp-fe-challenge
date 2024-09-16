import { useCallback, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { Approvals, SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalsFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, clearCacheByEndpoint, loading } = useCustomFetch()
  const [approvals, setApprovals] = useState<Approvals>({});

  const setTransactionApprovals = useCallback<SetTransactionApprovalsFunction>(
    async () => {
      // If transactions were an object, approvals that were toggled twice to their original value can be filtered out here
      await Promise.all(Object.entries(approvals).map(([transactionId, newValue]) => fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })))
      clearCacheByEndpoint(['paginatedTransactions', 'transactionsByEmployee'])
      setApprovals({});
    },
    [approvals, clearCacheByEndpoint, fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  const approvalsDisabled = Object.keys(approvals).length === 0 || loading;

  return (
    <>
      <button
        className="RampButton"
        disabled={approvalsDisabled}
        onClick={() => setApprovals({})}
      >
        Reset Changes
      </button>
      <button
        className="RampButton"
        disabled={approvalsDisabled}
        onClick={setTransactionApprovals}
      >
        Approve Changes
      </button>
      <div data-testid="transaction-container">
        {transactions.map((transaction) => (
          <TransactionPane
            key={transaction.id}
            transaction={transaction}
            loading={loading}
            approved={approvals[transaction.id] ?? transaction.approved}
            setTransactionApproval={(newValue) => setApprovals(prev => ({...prev, [transaction.id]: newValue }))}
          />
        ))}
      </div>
    </>
  )
}
