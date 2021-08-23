import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  .col-1 {
    width: 16%;
  }
  .col-2 {
    width: 15%;
  }
  .col-3 {
    width: 15%;
  }
  .col-4 {
    width: 11%;
  }
  .col-5 {
    width: 13%;
  }
  .col-6 {
    width: 13%;
  }
  .col-7 {
    width: 17%;
  }
`

const PoolColumns = () => {
  return (
    <Wrapper className="hidden md:flex flex-row justify-between md:mb-4">
      <div className="col-1 text-gray-500 font-bold">Asset</div>
      <div className="col-2 text-gray-500 font-bold">Market Size</div>
      <div className="col-3 text-gray-500 font-bold">Total Borrowed</div>
      <div className="col-4 text-gray-500 font-bold">Deposit APY</div>
      <div className="col-5 text-gray-500 font-bold">Borrow APY</div>
      <div className="col-6 text-gray-500 font-bold">Total Earned</div>
      <div className="col-7">&nbsp;</div>
    </Wrapper>
  )
}

export default PoolColumns
