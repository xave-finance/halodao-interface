import { firestore, functions } from './firebase'

export const addPendingRewards = async (
  userAddress: string,
  poolAddress: string,
  poolId: number,
  pendingRewards: string,
  totalGas: string,
  txHashes: string[]
) => {
  const addPendingRewards = functions.httpsCallable('addPendingRewards')

  await addPendingRewards({
    userAddress,
    poolAddress,
    poolId,
    pendingRewards,
    totalGas,
    txHashes
  })
}

export const didAlreadyMigrate = async (userAddress: string, poolAddress: string) => {
  const querySnapshot = await firestore
    .collection('pendingRewards')
    .where('userAddress', '==', userAddress)
    .where('poolAddress', '==', poolAddress)
    .get()
  return querySnapshot.size > 0 ? true : false
}
