describe('Pool', () => {
  beforeEach(() => {
    cy.visit('/pool')
  })

  it('displays a non-blank pool summary', () => {
    // Initially pool summary is blank
    cy.get('#text-stakeable-value').contains('$ --')
    cy.get('#text-staked-value').contains('$ --')
    cy.get('#text-halo-earned').contains('--')

    // Then should reload to show the figures
    cy.get('#text-stakeable-value').should('not.contain', '$ --')
    cy.get('#text-staked-value').should('not.contain', '$ --')
    cy.get('#text-halo-earned').should('not.contain', '--')
  })

  it('displays the pools', () => {
    cy.get('.pool-card')
  })

  it('display pool details', () => {
    cy.contains('Manage').click()
  })
})
