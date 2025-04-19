const urls = require('../models/urlsModel');

class urlRepository {
  static handleError(e, method) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Database Error in ${method}:`, e);
    }
    throw new Error(e.message);
  }
  static async createUrl(urlData) {
    try {
      if (!this.isValidUrl(urlData.long_url)) {
        throw new Error(
          'Invalid URL format. Must start with http:// or https://'
        );
      }

      if (!this.isValidShortCode(urlData.short_code)) {
        throw new Error('Short code must be 1-10 alphanumeric characters.');
      }

      const existingUrl = await urls.findOne({
        where: { short_code: urlData.short_code },
      });
      if (existingUrl) {
        throw new Error('Short code already in use. Please choose another.');
      }
      const prefix = 'HMM/';

      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code: `${prefix}${urlData.short_code}`,
        user_id: urlData.user_id || null,

        is_active: true,
        click_count: 0,
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

      // Create the new URL record
      const newUrl = await urls.create({
        long_url: urlData.long_url,
        short_code,
      });

      return newUrl; // Return the created record
    } catch (e) {
      this.handleError(e, 'createRandomUrl');
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
}

module.exports = urlRepository;
