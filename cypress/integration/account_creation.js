const user1 = {
  username: 'erric1',
  password: 'psassword12',
  name: 'aw1222',
  country: 'Canada',
  city:'Kingston',
  card: '424424424424',
  month: '10',
  year: '2022'
}

const user2 = {
  username: 'erric2',
  password: 'psassword12',
  name: 'aw222',
  country: 'Canada',
  city:'Kingston',
  card: '424424424424',
  month: '10',
  year: '2022'
}

const user3 = {
  username: 'erric3',
  password: 'psassword1222',
  name: 'aw32',
  country: 'Canada',
  city:'Kingston',
  card: '424424424424',
  month: '10',
  year: '2022'
}


describe('Demoblaze.com functions of signing up, logging in, add to cart and purchase products', () => {

  let currentuser
  it('Creates Accounts', () => {

    // Creates 3 user accounts
    for (let i = 0; i < 3; i++) {
      if (i==0) {
        currentuser = user1
      }
      else if (i==1){
        currentuser = user2
      }
      else {
        currentuser = user3
      }
      cy.visit('https://demoblaze.com')
      cy.signup(currentuser)
    }
  })

  it('Logs the user in', () => cy.login(currentuser))

  it('Adds the entire category to the cart', () => {

    cy.get('#cat')
      .should('have.text', 'CATEGORIES')
      .click()

    // Calculates the total cost of the products in category homepage
    let totalCost = 0
    cy.get('.card-block h5').each(($el, index, $list) => {
      cy.wrap($el).invoke('text').as('cost')
      cy.get('@cost').then(cost => {
        totalCost += parseInt(cost.replace("$", ""))
      })
    })

    cy.addItemsToCart()

    // Go to user cart
    cy.get('#cartur')
      .should('have.text', 'Cart')
      .click()

    // Compare cart total to the category homepage total
    cy.get('#totalp').then(totalp => {
      cy.wrap(totalp).should('have.text', totalCost)
      cy.log(totalCost)
    })
  })
  
  it('Purchase all items in cart', () => cy.placeOrder(currentuser))
})

Cypress.Commands.add('signup', (user) => {

  cy.get('[data-target="#signInModal"]').contains('Sign up').click()
  
  cy.get('#sign-username')
    .invoke('val', user.username)
    .should('have.value', user.username)

  cy.get('#sign-password')
    .invoke('val', user.password)
    .should('have.value', user.password)

  cy.get('#signInModal').should('have.css', 'display', 'block')
  cy.get('.btn-primary')
    .contains('Sign up')
    .click()

  cy.on('window:alert',(txt)=>{
    expect(txt).to.contains('Sign up successful.');
  })

})

Cypress.Commands.add('login', (user) => {

  cy.get('[data-target="#logInModal"]').contains('Log in').click()

  cy.get('input[type="text"]')
    .invoke('val', user.username)
    .should('have.value', user.username)

  cy.get('input[type="password"]')
    .invoke('val', user.password)
    .should('have.value', user.password)

  cy.get('.btn-primary')
    .contains('Log in')
    .click()

  cy.get('#nameofuser')
    .should('have.text', 'Welcome ' + user.username)

})

Cypress.Commands.add('addItemsToCart', () => {

  // Loop through category product cards
  cy.get('.card').each(($el,index,$list) => {

    // Visit product page link
    const link = $el.find('a').first()
    cy.visit('https://demoblaze.com/' + link.attr('href'))

    cy.get('.product-content .btn')
      .should('have.text', 'Add to cart')
      .click()

    cy.on('window:alert',(txt)=>{
      expect(txt).to.contains('Product added');
    })

    cy.visit('https://demoblaze.com/')
  })
})

Cypress.Commands.add('placeOrder', (user) => {

  cy.get('[data-target="#orderModal"]').contains('Place Order').click()

  cy.get('#name')
    .invoke('val', user.name)
    .should('have.value', user.name)

  cy.get('#country')
    .invoke('val', user.country)
    .should('have.value', user.country)

  cy.get('#city')
    .invoke('val', user.city)
    .should('have.value', user.city)

  cy.get('#card')
    .invoke('val', user.card)
    .should('have.value', user.card)

  cy.get('#month')
    .invoke('val', user.month)
    .should('have.value', user.month)

  cy.get('#year')
    .invoke('val', user.year)
    .should('have.value', user.year)

  cy.get('.btn-primary')
    .contains('Purchase')
    .click()

  cy.get('.sweet-alert').find('h2')
    .should('have.text','Thank you for your purchase!')
})

