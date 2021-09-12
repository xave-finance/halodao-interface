import { useContract } from 'hooks/useContract'
import ASSIMILATOR_ABI from 'constants/haloAbis/Assimilator.json'
import { useCallback } from 'react'

export const useAssimilator = (assimilatorAddress: string) => {
  const AssimilatorContract = useContract(assimilatorAddress, ASSIMILATOR_ABI, true)

  const viewNumeraireAmount = useCallback(
    async (rawAmount: string) => {
      const numeraire = await AssimilatorContract?.viewNumeraireAmount(rawAmount)
      return numeraire
    },
    [AssimilatorContract]
  )

  return { viewNumeraireAmount }
}
