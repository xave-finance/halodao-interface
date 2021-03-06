import { createAction } from '@reduxjs/toolkit'
import { CachedPool } from './reducer'

export const updatePools = createAction<CachedPool[]>('pool/update')
