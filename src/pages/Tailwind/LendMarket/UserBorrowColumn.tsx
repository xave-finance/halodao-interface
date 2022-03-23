import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  .col-1 {
    width: 30%;
  }
  .col-2 {
    width: 25%;
  }
  .col-3 {
    width: 20%;
  }
  .col-4 {
    width: 25%;
  }
`

const UserBorrowColumn = () => {
  return (
    <Wrapper className="hidden md:flex flex-row justify-between md:mb-4">
      <div className="col-1 text-gray-500 font-bold">Your Borrows</div>
      <div className="col-2 text-gray-500 font-bold">Borrowed</div>
      <div className="col-3 text-gray-500 font-bold">APY</div>
      <div className="col-4">&nbsp;</div>
    </Wrapper>
  )
}

export default UserBorrowColumn
