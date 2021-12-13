import { useEffect, useState } from 'react'
import { TokenAmount } from '@halodao/sdk'
import { useActiveWeb3React } from 'hooks'
import { useTokenContract } from 'hooks/useContract'
import { useTransactionAdder } from 'state/transactions/hooks'
import { ApprovalState } from 'hooks/useApproveCallback'

const useTokenAllowance = (amountToApprove: TokenAmount, spender?: string): [ApprovalState, () => Promise<void>] => {
  const { account } = useActiveWeb3React()
  const [approvalState, setApprovalState] = useState(ApprovalState.UNKNOWN)
  const [allowance, setAllowance] = useState<TokenAmount | undefined>(undefined)
  const [isApprovalPending, setIsApprovalPending] = useState(false)
  const addTransaction = useTransactionAdder()
  const tokenContract = useTokenContract(amountToApprove.token.address)

  const fetchAllowance = async () => {
    if (!account || !tokenContract || !spender) return
    try {
      console.log('allowance call: ', account, spender, tokenContract)
      const res = await tokenContract?.allowance(account, spender)
      const newAllowance = new TokenAmount(amountToApprove.token, res.toString())
      setAllowance(newAllowance)
    } catch (error) {
      console.error(error)
      setAllowance(undefined)
    }
  }

  const approve = async () => {
    if (approvalState === ApprovalState.APPROVED) {
      throw new Error('Approve was called unnecessarily')
    }
    if (!spender) {
      throw new Error('Spender is required to approve')
    }

    try {
      // approvalState is pending while approve call is to executing/to be executed
      setApprovalState(ApprovalState.PENDING)
      setIsApprovalPending(true)

      // execute actual approve call
      const tx = await tokenContract?.approve(spender, amountToApprove.raw.toString())
      await tx.wait()

      // Fetch allowance again to refresh approvalState
      fetchAllowance()
      setIsApprovalPending(false)

      // Add tx to app's transactions list
      return addTransaction(tx, { summary: 'Approve' })
    } catch (err) {
      // Revert approvalState to default if approve call fails
      setApprovalState(ApprovalState.UNKNOWN)
      setIsApprovalPending(false)
      console.error(err)
    }
  }

  // fetch allowance once token contract initialized
  useEffect(() => {
    fetchAllowance()
  }, [spender, tokenContract]) // eslint-disable-line

  // refresh approvalState whenever allowance changes
  useEffect(() => {
    if (!allowance) return
    if (isApprovalPending) return

    if (amountToApprove.greaterThan(allowance)) {
      setApprovalState(ApprovalState.NOT_APPROVED)
      return
    }

    setApprovalState(ApprovalState.APPROVED)
  }, [allowance, amountToApprove]) // eslint-disable-line

  return [approvalState, approve]
}

export default useTokenAllowance
