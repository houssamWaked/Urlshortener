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
      const existingUrl = await urls.findOne({
        where: { short_code: urlData.short_code },
      });
      if (existingUrl) {
        throw new Error('Short code already in use. Please choose another.');
      }

      const prefix = 'HMM/';

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code: `${prefix}${urlData.short_code}`,
        user_id: urlData.user_id || null,
        is_active: true,
        click_count: 0,
        expiration_date: expirationDate,
      });

      return newUrl;
    } catch (e) {
      this.handleError(e, 'createUrl');
    }
  }

  static async createRandomUrl(urlData) {
    try {
      const short_code = await this.generateUniqueShortCode(10);
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code,
        user_id: urlData.user_id || null,
        expiration_date: expirationDate,
      });

      return newUrl;
    } catch (e) {
      this.handleError(e, 'createRandomUrl');
    }
  }
  static async getUrlCountbyShortCode(short_code) {
    console.log(short_code);
    try {
      const urlRecord = await urls.findOne({
        where: { short_code },
      });
      if (!urlRecord) {
        const error = new Error('URL not found.');
        error.status = 404;
        throw error;
      }

      return urlRecord.click_count;
    } catch (e) {
      e.status = e.status || 500;
      throw e;
    }
  }

  async generateUniqueShortCode(totalLength = 10, maxAttempts = 5) {
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

  async generateRandomShortCode(length = 10) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

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
