const urls = require('../models/urlsModel');
const { Op } = require('sequelize');

class urlRepository {
  static handleError(e, method) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Database Error in ${method}:`, e);
    }
    throw new Error(e.message);
  }
  static async createUrl(urlData) {
    try {
      // Check if the short code already exists
      const existingUrl = await urls.findOne({
        where: { short_code: urlData.short_code },
      });
      if (existingUrl) {
        throw new Error('Short code already in use. Please choose another.');
      }

      // Add a prefix to the short code
      const prefix = 'HMM/';

      // Calculate the expiration date (1 month from now)
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Add 1 month to the current date

      // Create the new URL record
      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code: `${prefix}${urlData.short_code}`,
        user_id: urlData.user_id || null,
        is_active: true,
        click_count: 0,
        expiration_date: expirationDate, // Set expiration date here
      });

      return newUrl;
    } catch (e) {
      this.handleError(e, 'createUrl');
    }
  }
  // Create a new shortened URL
  static async createRandomUrl(urlData) {
    try {
      // Generate a unique short code
      const short_code = await this.generateUniqueShortCode(10);
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Add 1 month to the current date

      // Create the new URL record
      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code,
        user_id: urlData.user_id || null,
        expiration_date: expirationDate,
      });

      return newUrl; // Return the created record
    } catch (e) {
      this.handleError(e, 'createRandomUrl');
    }
  }
  static async getUrlCountbyShortCode(short_code) {
    try {
      const urlRecord = await urls.findOne({
        where: { short_code },
      });
      if (!urlRecord) {
        throw new Error('URL not found.');
      }
      if (!urlRecord.is_active) {
        throw new Error('This shortened URL is currently inactive.');
      }
      return urlRecord.click_count;
    } catch (e) {
      this.handleError(e, 'getUrlCountbyShortCode');
    }
  }

  static async generateUniqueShortCode(totalLength = 10, maxAttempts = 5) {
    let attempts = 0;
    let short_code;
    const prefix = 'HMM/';
    const randomPartLength = totalLength - prefix.length;

    do {
      if (attempts >= maxAttempts) {
        throw new Error(
          'Failed to generate a unique short code after multiple attempts.'
        );
      }

      const randomPart = this.generateRandomShortCode(randomPartLength);
      short_code = `${prefix}${randomPart}`;

      const existingUrl = await urls.findOne({ where: { short_code } });
      if (!existingUrl) return short_code;

      attempts++;
    } while (true);
  }

  // Helper: Generate a random alphanumeric string
  static generateRandomShortCode(length = 10) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Redirect to the original URL using the short code
  static async redirectToOriginalUrl(short_code) {
    try {
      const urlRecord = await urls.findOne({
        where: { short_code },
      });

      if (!urlRecord) {
        throw new Error('URL not found.');
      }

      if (!urlRecord.is_active) {
        throw new Error('This shortened URL is currently inactive.');
      }

      await urls.update(
        { click_count: urlRecord.click_count + 1 },
        { where: { short_code } }
      );

      return urlRecord.long_url;
    } catch (e) {
      this.handleError(e, 'redirectToOriginalUrl');
    }
  }
  static async ExpiredUrl() {
    try {
      const currentDate = new Date();

      const [affectedRows] = await urls.update(
        { is_active: false },
        {
          where: {
            expiration_date: {
              [Op.lt]: currentDate,
            },
          },
        }
      );

      if (affectedRows === 0) {
        const error = new Error('No expired URLs found');
        error.status = 404;
        throw error;
      }

      return affectedRows;
    } catch (e) {
      e.status = e.status || 500;
      throw e;
    }
  }
}

module.exports = urlRepository;
