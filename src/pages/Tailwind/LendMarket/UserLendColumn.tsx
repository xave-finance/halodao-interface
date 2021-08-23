import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  .col-1 {
    width: 22%;
  }
  .col-2 {
    width: 28%;
  }
  .col-3 {
    width: 20%;
  }
  .col-4 {
    width: 12%;
  }
  .col-5 {
    width: 18%;
  }
`

const UserLendColumns = () => {
  return (
    <Wrapper className="hidden md:flex flex-row justify-between md:mb-4 md:mr-2">
      <div className="col-1 text-gray-500 font-bold">Your Assets</div>
      <div className="col-2 text-gray-500 font-bold">Current Balance</div>
      <div className="col-3 text-gray-500 font-bold">APY</div>
      <div className="col-4 text-gray-500 font-bold">Collateral</div>
      <div className="col-5">&nbsp;&nbsp;</div>
    </Wrapper>
  )
}

export default UserLendColumns
