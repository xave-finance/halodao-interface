describe('Vesting', () => {
  beforeEach(() => {
    cy.visit('/vesting')
  })

  it('displays vesting APY', () => {
    // 1 - Initially APY blank
    cy.contains('0 APY')
    // 2 - Check if APY changed
    cy.should('not.contain', '0 APY')
  })

  it('displays RNBW:xRNBW price', () => {
    // 1 - Initially price is blank
    cy.contains('x0')
    // 2 - Check for Halohalo price changed
    cy.should('not.contain', 'x0')
  })
})
