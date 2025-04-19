const UrlServices = require('../services/urlServices');

class UrlController {
  // Error handling function
  static handleError(res, error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }

  // Create a custom URL
  static async createUrl(req, res) {
    try {
      const urlData = req.body;
      const newUrl = await UrlServices.createUrl(urlData);
      res.status(201).json(newUrl);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Create a random URL
  static async createRandomUrl(req, res) {
    try {
      const urlData = req.body;
      const newUrl = await UrlServices.createRandomUrl(urlData);
      res.status(201).json(newUrl);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Get the count of URLs by a short code
  static async getUrlCountbyShortCode(req, res) {
    try {
      const prefix = 'HMM/';
      const { short_code } = req.params;
      console.log(short_code);
      const urlCount = await UrlServices.getUrlCountbyShortCode(
        prefix + short_code
      );
      res.status(200).json(urlCount);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      this.handleError(res, error);
    }
  }

  // Redirect to the original URL using the short code
  static async redirectToOriginalUrl(req, res) {
    try {
      const prefix = 'HMM/';
      const { short_code } = req.params;
      const originalUrl = await UrlServices.redirectToOriginalUrl(
        prefix + short_code
      );
      res.redirect(originalUrl);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Mark expired URLs as inactive and return count
  static async ExpiredUrl(req, res) {
    try {
      const expiredCount = await UrlServices.ExpiredUrl();
      res
        .status(200)
        .json({ message: `${expiredCount} expired URLs marked as inactive.` });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      this.handleError(res, error);
    }
  }
}

module.exports = UrlController;
