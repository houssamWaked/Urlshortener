const UrlRepository = require('../repositories/urlRepositories');
const UserRepository = require('../repositories/userRepositories');

class UrlServices {
  // Method to create a URL, validating the user's existence first
  static async createUrl(urlData) {
    console.log(urlData); // Log the URL data for debugging purposes
    if (urlData.user_id) {
      const user = await UserRepository.userExistsByID(urlData.user_id);
      if (!user) {
        throw new Error('User not found');
      }
    }
    // If user exists, create the URL
    return UrlRepository.createUrl(urlData);
  }

  // Method to create a random URL, validating the user's existence first
  static async createRandomUrl(urlData) {
    if (urlData.user_id) {
      const user = await UserRepository.userExistsByID(urlData.user_id);
      if (!user) {
        throw new Error('User not found');
      }
    }
    // If user exists, create the random URL
    return UrlRepository.createRandomUrl(urlData);
  }

  // Method to get the click count for a URL using its short code
  static async getUrlCountbyShortCode(short_code) {
    return UrlRepository.getUrlCountbyShortCode(short_code);
  }

  // Method to handle the redirection of a shortened URL to the original URL
  static async redirectToOriginalUrl(short_code) {
    return UrlRepository.redirectToOriginalUrl(short_code);
  }

  // Method to mark expired URLs as inactive
  static async ExpiredUrl() {
    return UrlRepository.ExpiredUrl();
  }
}

module.exports = UrlServices;
