describe('Pool', () => {
  beforeEach(() => {
    cy.visit('/pool')
  })

  it('displays a non-blank pool summary', () => {})

  it('displays the pools', () => {
    // cy.get('.pool-card')
    cy.contains('Manage').click()
  })
})
