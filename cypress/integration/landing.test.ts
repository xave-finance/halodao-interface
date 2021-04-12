import { TEST_ADDRESS_NEVER_USE_SHORTENED } from '../support/commands'

describe('Landing Page', () => {
  beforeEach(() => cy.visit('/'))
  it('loads pool page', () => {
    cy.get('#pool-page')
  })

  it('redirects to url /pool', () => {
    cy.url().should('include', '/pool')
  })

  it('allows navigation to stake', () => {
    cy.get('#stake-nav-link').click()
    cy.url().should('include', '/stake')
  })

  it('is connected', () => {
    cy.get('#web3-status-connected').click()
    cy.get('#web3-account-identifier-row').contains(TEST_ADDRESS_NEVER_USE_SHORTENED)
  })
})
