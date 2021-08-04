import { createAction } from '@reduxjs/toolkit'
import { Pool } from './reducer'

export const updatePools = createAction<Pool[]>('pool/update')
