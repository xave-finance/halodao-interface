import React from 'react'
import { render, cleanup, waitFor } from '@testing-library/react'
import Header from '../index'
import { Provider } from 'react-redux'
import store from 'state'
import ThemeProvider from 'theme'
import { MemoryRouter } from 'react-router'

jest.mock('../../../hooks', () => ({
  useActiveWeb3React: () => {
    return { account: undefined, chainId: 1, library: undefined }
  }
}))

jest.mock('@web3-react/core', () => ({
  useWeb3React: (key: string | undefined) => {
    if (key) {
      return { active: false }
    }
    return { account: undefined, connector: undefined, error: undefined }
  }
}))

afterEach(() => {
  cleanup()
})

test('<Header> renders RNBW balance on supported networks', async () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>
  )
  await waitFor(() => getByTestId('rnbw-balance'))
  expect(getByTestId('rnbw-balance')).toBeTruthy()
})

export {}
