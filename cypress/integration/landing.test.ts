import { TEST_ADDRESS_NEVER_USE_SHORTENED } from '../support/commands'

describe('Landing Page', () => {
  beforeEach(() => cy.visit('/'))
  it('loads farm page', () => {
    cy.get('#farm-page')
  })

  it('redirects to url /farm', () => {
    cy.url().should('include', '/farm')
  })

  it('allows navigation to vesting', () => {
    cy.get('#vesting-nav-link').click()
    cy.url().should('include', '/vesting')
  })

  it('is connected', () => {
    cy.get('#web3-status-connected').click()
    cy.get('#web3-account-identifier-row').contains(TEST_ADDRESS_NEVER_USE_SHORTENED)
  })
})
