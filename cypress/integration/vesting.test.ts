describe('Vesting', () => {
  beforeEach(() => {
    cy.visit('/vesting')
  })

  it('displays vesting APY', () => {
    // 1 - Initially APY blank
    cy.get('body').contains('0 APY')
    // 2 - Check if APY changed
    cy.get('body', { timeout: 30000 }).should('not.contain', '0 APY')
  })

  it('displays RNBW:xRNBW price', () => {
    // 1 - Initially price is blank
    cy.get('body').contains('x0')
    // 2 - Check for Halohalo price changed
    cy.get('body', { timeout: 30000 }).should('not.contain', 'x0')
  })
})
