
describe("The home page", () => {
  it("should load", () => {
    cy.request({ url: "http://localhost:3000" }).should((res) => {
      expect(res.status).to.eq(200)
    });
  })
})
