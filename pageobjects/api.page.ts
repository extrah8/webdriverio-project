import axios, { AxiosInstance } from 'axios';
import https from 'https';
import { expect } from 'chai';

/**
 * This class provides API interactions with the DemoQA BookStore and Account services.
 * It handles user creation, token generation, book operations (add/get/delete), and user deletion.
 */
class ApiPage {
  private api: AxiosInstance;
  private token: string = '';
  private userId: string = '';
  private username: string = '';

  constructor() {
    this.api = axios.create({
      baseURL: 'https://demoqa.com',
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }

  /** Creates a new user and stores userId and username */
  async createUser(user: { username: string; password: string }) {
    const res = await this.api.post('/Account/v1/User', {
      userName: user.username,
      password: user.password,
    });

    this.userId = res.data.userID;
    this.username = user.username;
    return res;
  }

  /** Generates a token for the created user */
  async generateToken(password: string) {
    const res = await this.api.post('/Account/v1/GenerateToken', {
      userName: this.username,
      password,
    });

    this.token = res.data.token;

    if (!this.token) {
      throw new Error(`Token generation failed for ${this.username}`);
    }

    return res;
  }

  /** Adds a book to the user's collection */
  async addBook(book: { isbn: string }) {
    return this.api.post(
      '/BookStore/v1/Books',
      {
        userId: this.userId,
        collectionOfIsbns: [{ isbn: book.isbn }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  /** Retrieves the list of available books */
  async getBooks() {
    return this.api.get('/BookStore/v1/Books');
  }

  /** Deletes a book from the user's collection */
  async deleteBook(isbn: string) {
    return this.api.delete('/BookStore/v1/Book', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      data: {
        userId: this.userId,
        isbn,
      },
    });
  }

  /** Deletes the created user */
  async deleteUser() {
    return this.api.delete(`/Account/v1/User/${this.userId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  /** Validates that required fields are defined (used in tests) */
  public assertFields(obj: any, fields: string[]): void {
    fields.forEach((key) => {
      expect(obj[key], `Expected field '${key}' to be defined`).to.not.be.undefined;
    });
  }
}

export const apiPage = new ApiPage();