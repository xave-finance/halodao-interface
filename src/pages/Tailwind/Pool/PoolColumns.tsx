import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  .col-1 {
    width: 19%;
  }
  .col-2 {
    width: 18%;
  }
  .col-3 {
    width: 18%;
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
    width: 8%;
  }
`

const PoolColumns = () => {
  return (
    <Wrapper className="hidden md:flex flex-row justify-between md:mb-4">
      <div className="col-1 text-gray-500 font-bold">Pair Name</div>
      <div className="col-2 text-gray-500 font-bold">Pooled (A) Tokens</div>
      <div className="col-3 text-gray-500 font-bold">Pooled (B) Tokens</div>
      <div className="col-4 text-gray-500 font-bold">Held HLP</div>
      <div className="col-5 text-gray-500 font-bold">Staked HLP</div>
      <div className="col-6 text-gray-500 font-bold">Earned</div>
      <div className="col-7">&nbsp;</div>
    </Wrapper>
  )
}

export default PoolColumns
