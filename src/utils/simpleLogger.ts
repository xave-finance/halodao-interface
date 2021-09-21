const isConsoleLogEnabled = process.env.REACT_APP_IS_CONSOLE_LOG_ENABLED || 'false'
console.log('isConsoleLogEnabled: ', isConsoleLogEnabled)
const isEnabled = isConsoleLogEnabled === 'true'

export const consoleLog = (message: string, ...args: any[]) => {
  if (!isEnabled) return
  console.log(message, ...args)
}
