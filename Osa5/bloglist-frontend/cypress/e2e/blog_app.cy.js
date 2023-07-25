
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      username: 'KN5T',
      name: 'Konsta J',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    const user2 = {
      username: 'root',
      name: 'root',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
    cy.get('#login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('KN5T')
      cy.get('#password').type('salainen')
      cy.get('#login').click()

      cy.contains('logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('KN5T')
      cy.get('#password').type('wrong')
      cy.get('#login').click()

      cy.contains('wrong username or password')
      cy.contains('logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'KN5T', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type('cypress test blog')
      cy.get('#author').type('unknown')
      cy.get('#url').type('https://fullstackopen.com/osa5/end_to_end_testaus#tehtavat-5-17-5-23')

      cy.get('#createBtn').click()

      cy.contains('cypress test blog unknown')
    })

    describe('and blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'cypress test blog',
          author: 'unknown',
          url: 'https://fullstackopen.com/osa5/end_to_end_testaus#tehtavat-5-17-5-23'
        })

        cy.contains('cypress test blog unknown')
          .contains('view')
          .click()
      })

      it('it can be liked', function() {
        cy.contains('likes 0')
          .contains('like')
          .click()

        cy.contains('likes 1')
      })

      it('blog creator can delete the blog', function() {
        cy.get('#removeBtn').click()

        cy.get('html').should('not.contain', 'cypress test blog unknown' )
      })

      it('only the blog creator can see the remove button', function() {
        cy.get('#logout').click()

        cy.login({ username: 'root', password: 'salainen' })

        cy.contains('cypress test blog unknown')
          .contains('view')
          .click()

        cy.get('html').should('not.contain', '#removeBtn' )
      })

      it('blogs are sorted by likes', function() {
        cy.createBlog({
          title: 'The title with most likes',
          author: 'unknown',
          url: 'https://fullstackopen.com/osa5/end_to_end_testaus#tehtavat-5-17-5-23'
        })
        cy.contains('The title with most likes unknown')
          .contains('view')
          .click()

        cy.contains('cypress test blog')
          .contains('view')
          .click()

        cy.contains('The title with most likes unknown')
          .parent()
          .contains('likes 0')
          .contains('like')
          .click()

        cy.get('.blog').eq(0).should('contain', 'The title with most likes')
        cy.get('.blog').eq(1).should('contain', 'cypress test blog')
      })
    })
  })
})