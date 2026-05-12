/* global cy -- provided by Cypress */
describe("Chart surface demo (svg-engine)", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("renders line, bar, and pie scaffolds with SVG content", () => {
        cy.get("#line-root.charts-scaffold-line").should("be.visible");
        cy.get("#line-root svg").should("exist");
        cy.get("#line-root").should("contain", "E2E Line");

        cy.get("#bar-root.charts-scaffold-bar").should("be.visible");
        cy.get("#bar-root svg").should("exist");
        cy.get("#bar-root").should("contain", "E2E Bar");

        cy.get("#pie-root.charts-scaffold-pie").should("be.visible");
        cy.get("#pie-root svg").should("exist");
        cy.get("#pie-root").should("contain", "E2E Pie");
    });

    it("draws vector shapes for each chart kind", () => {
        cy.get("#line-root polyline").should("exist");
        cy.get("#bar-root rect").its("length").should("be.gte", 2);
        cy.get("#pie-root path").should("exist");
    });
});
