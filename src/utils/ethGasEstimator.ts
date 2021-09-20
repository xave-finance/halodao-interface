type GasModeData = {
  gwei?: number
  usd: number
}

export type GasModeRangeData = {
  floor: GasModeData
  ceiling: GasModeData
}

export enum GasModes {
  slow = 'slow',
  normal = 'normal',
  fast = 'fast',
  instant = 'instant'
}

const _queryETHGasWatchAPI = async () => {
  /**
   * @info
   * https://docs.ethgas.watch/api
   */
  const url = `http://ethgas.watch/api/gas`

  return fetch(url).then(response => response.json())
}

export const getGasRangeEstimation = async (floor: GasModes, ceiling: GasModes): Promise<GasModeRangeData> => {
  const queryResult = await _queryETHGasWatchAPI()

  if (queryResult['normal'].usd > queryResult[floor].usd) {
    queryResult[floor].usd = queryResult['normal'].usd + 1
  }
  if (queryResult[floor].usd > queryResult[ceiling].usd) {
    queryResult[ceiling].usd = queryResult[floor].usd + 1
  }

  return {
    floor: queryResult[floor],
    ceiling: queryResult[ceiling]
  }
}
