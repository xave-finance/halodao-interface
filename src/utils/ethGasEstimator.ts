type GasModeData = {
  gwei: number
  usd: number
}

type GasModeRangeData = {
  lowerBound: GasModeData
  upperBound: GasModeData
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

export const getGasEstimation = async (mode: GasModes): Promise<GasModeData> => {
  /**
   * @info
   * https://docs.ethgas.watch/api
   */
  const queryResult = await _queryETHGasWatchAPI()
  return queryResult[mode]
}

export const getGasRangeEstimation = async (lowerBound: GasModes, upperBound: GasModes): Promise<GasModeRangeData> => {
  const queryResult = await _queryETHGasWatchAPI()
  if (queryResult[lowerBound].usd > queryResult[upperBound].usd) {
    queryResult[upperBound].usd = queryResult[lowerBound].usd + 1
  }
  return {
    lowerBound: queryResult[lowerBound],
    upperBound: queryResult[upperBound]
  }
}
