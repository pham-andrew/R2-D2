describe ('First Test', () => {
    it ('is working', () => {
      expect (true).to.equal (true);
    });
  });
describe('Visit', () => {
  it('Visits the Deployed Application', () => {
    // const baseUrl = Cypress.config('baseUrl');pageLoadTimeout
    // const pageLoadTimeout = Cypress.config('pageLoadTimeout')
    const baseUrl = Cypress.env('baseUrl');
    const pageLoadTimeout = Cypress.env('pageLoadTimeout');
    cy.log("baseUrl: " + baseUrl);
    cy.log("pageLoadTimeout: " + pageLoadTimeout);
    // 'https://react-world.staging.apps.il2.dsop.io/'
    cy.visit(baseUrl, { timeout: pageLoadTimeout })
    const title = cy.title({ timeout: 60000 })
    cy.log("title" + title);
  })
})
  