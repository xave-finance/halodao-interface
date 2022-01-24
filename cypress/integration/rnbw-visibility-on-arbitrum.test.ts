describe('RNBW Visibility testing in Kovan Network', function() {
  it('Visit Home page of Halo Dao', function() {
    cy.visit('/')
  })
  it('Show RNBW Tokens', function() {
    cy.get('#rainbow').click()
  })
})
