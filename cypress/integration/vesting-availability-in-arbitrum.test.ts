describe('Test Availability of vesting in arbitrum network', function() {
  it('Visit vesting page of Halo Dao app', function() {
    cy.visit('/vesting')
  })
  it('Recognizing vesting in Arbitrum Network', function() {
    cy.get('body').then(body => {
      expect(false).to.equal(body.find('#unsupported_vesting_component').length > 0)
    })
  })
})
