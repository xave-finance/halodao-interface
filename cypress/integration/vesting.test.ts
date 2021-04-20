describe('Vesting', () => {
  beforeEach(() => {
    cy.visit('/vesting')
  })

  it('displays vesting APY', () => {
    // Initially APY blank
    cy.contains('% APY')

    // Then should reload APY
    // cy.should('not.contain', '% APY')
  })

  it.skip('displays HALO:HALOHALO price', () => {
    // @todo
  })
})
