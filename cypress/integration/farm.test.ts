describe('Farm', () => {
  beforeEach(() => {
    cy.visit('/farm')
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
    cy.get('.pool-card', { timeout: 30000 })
  })

  it('can stake BPT', () => {
    cy.contains('Manage', { timeout: 30000 }).click()
    cy.get('#stake-input').type('1')
    cy.get('#stake-button').click()

    // @todo:
    // - sign approve tx (in metamask?)
    // - click button again to stake
    // - sign stake tx (in metamask?)
    // - verify staked BPT has increased
  })
})
