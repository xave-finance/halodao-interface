// TODO: Check sushi implementation
import { ethers } from 'ethers'
import { useTokenContract } from 'hooks/useContract'
import { useContract } from 'sushi-hooks/useContract'

import HALO_CHEST_ABI from '../constants/haloAbis/HaloChest/HaloChest.json'

// Kovan addresses
const HALO_CHEST_ADDRESS = '0xe026743D7625931cf303189Cd24e7eccE30461fe'
const HALO_TOKEN_ADDRESS = '0x695eEC33257c167b3f90fb1611bE31a88322b8Ab'

// useContract uses current account
const haloChestContract = useContract(HALO_CHEST_ADDRESS, HALO_CHEST_ABI)
const haloToken = useTokenContract(HALO_TOKEN_ADDRESS)

export const depositHALO = (amount: number) => {
  const depositAmount = ethers.utils.parseEther(`${amount}`)
  try {
    haloToken!.approve(HALO_CHEST_ADDRESS, depositAmount)
    haloChestContract!.enter(depositAmount)
  } catch (error) {
    console.error(error)
  }
}

export const withdrawHALO = (share: number) => {
  try {
    haloChestContract!.leave(ethers.utils.parseEther(`${share}`))
  } catch (error) {
    console.error(error)
  }
}

// TODO: Vesting
