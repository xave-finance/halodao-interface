// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { _Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge'

// never send real ether to this, obviously
const PRIVATE_KEY_TEST_NEVER_USE = '0x1433cab75614b5cc629299c42f2c7ad26fe4290a84747d6a2ac28a0ff4dd7822'

// address of the above key
export const TEST_ADDRESS_NEVER_USE = '0x572E787fD3B4a4852313611c7cb66a21be7c5533'

export const TEST_ADDRESS_NEVER_USE_SHORTENED = '0x572E...5533'

class CustomizedBridge extends _Eip1193Bridge {
  async sendAsync(...args) {
    console.debug('sendAsync called', ...args)
    return this.send(...args)
  }
  async send(...args) {
    console.debug('send called', ...args)
    const isCallbackForm = typeof args[0] === 'object' && typeof args[1] === 'function'
    let callback
    let method
    let params
    if (isCallbackForm) {
      callback = args[1]
      method = args[0].method
      params = args[0].params
    } else {
      method = args[0]
      params = args[1]
    }
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] })
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE])
      }
    }
    if (method === 'eth_chainId') {
      if (isCallbackForm) {
        callback(null, { result: '0x2A' })
      } else {
        return Promise.resolve('0x2A')
      }
    }
    try {
      const result = await super.send(method, params)
      console.debug('result received', method, params, result)
      if (isCallbackForm) {
        callback(null, { result })
      } else {
        return result
      }
    } catch (error) {
      if (isCallbackForm) {
        callback(error, null)
      } else {
        throw error
      }
    }
  }
}

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
Cypress.Commands.overwrite('visit', (original, url, options) => {
  return original(url.startsWith('/') && url.length > 2 && !url.startsWith('/#') ? `/#${url}` : url, {
    ...options,
    onBeforeLoad(win) {
      options && options.onBeforeLoad && options.onBeforeLoad(win)
      win.localStorage.clear()
      const provider = new JsonRpcProvider('https://kovan.infura.io/v3/903b4ab9e16c4386b8955766ad542b03', 42)
      const signer = new Wallet(PRIVATE_KEY_TEST_NEVER_USE, provider)
      win.ethereum = new CustomizedBridge(signer, provider)
    }
  })
})
