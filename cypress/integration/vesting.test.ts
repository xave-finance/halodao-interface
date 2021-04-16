describe('Vesting', () => {
  beforeEach(() => {
    cy.visit('/vesting')
  })

  it('displays vesting APY', () => {
    // Initially APY blank
    cy.contains('~% APY')

    // Then should reload APY
    // cy.should('not.contain', '~% APY') // @todo:
  })

  it.skip('displays HALO:HALOHALO price', () => {
    // @todo
  })
})
