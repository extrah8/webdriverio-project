import { expect } from 'chai';
import { apiPage } from '../../../pageobjects/api.page';

describe('BookStore and User API Flow', () => {
  const username = `user_${Date.now()}`;
  const password = 'Password123!';
  const bookData = { isbn: '9781449325862' };

  before(async () => {
    const createRes = await apiPage.createUser({ username, password });
    expect(createRes.status).to.equal(201);
    apiPage.assertFields(createRes.data, ['userID', 'username']);

    const tokenRes = await apiPage.generateToken(password);
    expect(tokenRes.status).to.equal(200);
    apiPage.assertFields(tokenRes.data, ['token', 'expires', 'status', 'result']);
  });

  it('should add a new book successfully', async () => {
  const response = await apiPage.addBook(bookData);
    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('books').that.is.an('array');
    expect(response.data.books[0].isbn).to.equal(bookData.isbn);
  });

  it('should get a list of books', async () => {
    const response = await apiPage.getBooks();
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('books').that.is.an('array');
    expect(response.data.books.length).to.be.greaterThan(0);

    const firstBook = response.data.books[0];
    apiPage.assertFields(firstBook, [
      'isbn',
      'title',
      'subTitle',
      'author',
      'publish_date',
      'publisher',
      'pages',
      'description',
      'website',
    ]);
  });

  it('should delete the book successfully', async () => {
    const response = await apiPage.deleteBook(bookData.isbn);
    expect(response.status).to.equal(204);
  });

  after(async () => {
    const deleteUserResponse = await apiPage.deleteUser();
    expect(deleteUserResponse.status).to.equal(204);
  });
});