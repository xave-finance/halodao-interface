describe('Vesting', () => {
  beforeEach(() => {
    cy.visit('/vesting')
  })

  it('displays vesting APY', () => {
    // 1 - Initially APY blank
    cy.contains('0 APY')
    // 2 - Wait for APY to load
    cy.wait(1500)
    // 3 - Check if APY changed
    cy.get('#haloHaloAPY').should('not.contain', '0 APY')
  })

  it('displays HALO:HALOHALO price', () => {
    // 1 - Initially price is blank
    cy.contains('x0')
    // 2 - Wait for price to load
    cy.wait(1500)
    // 3 - Check for Halohalo price changed
    cy.get('#haloHaloPrice').should('not.contain', 'x0')
  })
})
