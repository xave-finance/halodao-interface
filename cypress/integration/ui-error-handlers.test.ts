describe('UI Modal Testing', () => {
  it('Visit Pool page of Halo Dao app', function() {
    cy.visit('/pool')
  })
  it('Checking curve error modal visibility on load ', function() {
    cy.get('#error-handler-modal').should('not.be.visible')
  })
  // it('Review Error Modal ( Show modal without error for testing purposes ) ', function() {
  //   cy.get('#error-handler-modal')
  //     .invoke('attr', 'style', 'display: block')
  //     .should('have.attr', 'style', 'display: none')
  // })
})
