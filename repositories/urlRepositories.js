// Import the necessary model and Sequelize operators
const urls = require('../models/urlsModel');
const { Op } = require('sequelize');

// Define the 'urlRepository' class for URL-related database operations
class urlRepository {
  // Error handling method that logs errors in development and throws them
  static handleError(e, method) {
    if (process.env.NODE_ENV === 'development') {
      // Log error with method name in development mode
      console.error(`Database Error in ${method}:`, e);
    }
    // Throw the error to be handled by the caller
    throw new Error(e.message);
  }

  // Method to create a URL with a custom short code
  static async createUrl(urlData) {
    try {
      // Check if the short code already exists in the database
      const existingUrl = await urls.findOne({
        where: { short_code: urlData.short_code },
      });

      // If the short code is taken, throw an error
      if (existingUrl) {
        throw new Error('Short code already in use. Please choose another.');
      }

      // Prefix for short code
      const prefix = 'HMM/';

      // Set expiration date to 1 month from the current date
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      // Create a new URL record in the database
      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code: `${prefix}${urlData.short_code}`, // Combine prefix and provided short code
        user_id: urlData.user_id || null, // Optionally associate a user ID
        is_active: true, // Mark URL as active
        click_count: 0, // Initialize click count to 0
        expiration_date: expirationDate, // Set expiration date
      });

      return newUrl; // Return the created URL record
    } catch (e) {
      // Handle any errors that occur during URL creation
      this.handleError(e, 'createUrl');
    }
  }

  // Method to create a URL with a randomly generated short code
  static async createRandomUrl(urlData) {
    try {
      // Generate a unique short code
      const short_code = await this.generateUniqueShortCode(10);

      // Set expiration date to 1 month from the current date
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      // Create a new URL record with the random short code
      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code,
        user_id: urlData.user_id || null,
        expiration_date: expirationDate, // Set expiration date
      });

      return newUrl; // Return the created URL record
    } catch (e) {
      // Handle any errors that occur during URL creation
      this.handleError(e, 'createRandomUrl');
    }
  }

  // Method to get the click count of a URL by its short code
  static async getUrlCountbyShortCode(short_code) {
    try {
      // Find the URL record by short code
      const urlRecord = await urls.findOne({
        where: { short_code },
      });

      // If no URL record is found, throw an error
      if (!urlRecord) {
        const error = new Error('URL not found.');
        error.status = 404;
        throw error;
      }

      return urlRecord.click_count; // Return the click count of the found URL
    } catch (e) {
      // Set a status for the error and rethrow it
      e.status = e.status || 500;
      throw e;
    }
  }

  // Method to generate a unique short code for the URL
  async generateUniqueShortCode(totalLength = 10, maxAttempts = 5) {
    let attempts = 0;
    let short_code;
    const prefix = 'HMM/';
    const randomPartLength = totalLength - prefix.length;

    // Try generating a unique short code within the max number of attempts
    do {
      if (attempts >= maxAttempts) {
        throw new Error(
          'Failed to generate a unique short code after multiple attempts.'
        );
      }

      // Generate a random part of the short code
      const randomPart = this.generateRandomShortCode(randomPartLength);
      short_code = `${prefix}${randomPart}`;

      // Check if the generated short code already exists in the database
      const existingUrl = await urls.findOne({ where: { short_code } });
      if (!existingUrl) return short_code; // Return the short code if it's unique

      attempts++; // Increment attempt counter
    } while (true);
  }

  // Helper method to generate a random string for the short code
  async generateRandomShortCode(length = 10) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result; // Return the randomly generated short code
  }

  // Method to redirect to the original long URL from the short code
  static async redirectToOriginalUrl(short_code) {
    try {
      // Find the URL record by short code
      const urlRecord = await urls.findOne({
        where: { short_code },
      });

      // If no URL record is found, throw an error
      if (!urlRecord) {
        throw new Error('URL not found.');
      }

      // If the URL is inactive, throw an error
      if (!urlRecord.is_active) {
        throw new Error('This shortened URL is currently inactive.');
      }

      // Increment the click count for the URL
      await urls.update(
        { click_count: urlRecord.click_count + 1 },
        { where: { short_code } }
      );

      return urlRecord.long_url; // Return the original long URL
    } catch (e) {
      // Handle any errors that occur during the redirection process
      this.handleError(e, 'redirectToOriginalUrl');
    }
  }

  // Method to expire URLs that have passed their expiration date
  static async ExpiredUrl() {
    try {
      const currentDate = new Date();

      // Mark URLs as inactive if their expiration date is past
      const [affectedRows] = await urls.update(
        { is_active: false },
        {
          where: {
            expiration_date: {
              [Op.lt]: currentDate, // Use Sequelize's operator to check for expiration
            },
          },
        }
      );

      // If no URLs were updated, throw an error
      if (affectedRows === 0) {
        const error = new Error('No expired URLs found');
        error.status = 404;
        throw error;
      }

      return affectedRows; // Return the number of affected rows (expired URLs)
    } catch (e) {
      // Set status for the error and rethrow it
      e.status = e.status || 500;
      throw e;
    }
  }
}

// Export the 'urlRepository' class for use in other parts of the application
module.exports = urlRepository;
