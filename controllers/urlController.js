const UrlServices = require('../services/urlServices'); // Assuming you put the logic in the `urlRepository` class

class UrlController {
  // Error handling
  static handleError(res, error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }

  // Create a new shortened URL
  static async createUrl(req, res) {
    try {
      const urlData = req.body;
      const newUrl = await UrlServices.createUrl(urlData);
      res.status(201).json(newUrl);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Create a new shortened URL with a random short code
  static async createRandomUrl(req, res) {
    try {
      const urlData = req.body;
      const newUrl = await UrlServices.createRandomUrl(urlData);
      res.status(201).json(newUrl);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  // Redirect to the original URL
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
