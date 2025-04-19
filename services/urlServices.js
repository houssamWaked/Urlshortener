const UrlRepository = require('../repositories/urlRepositories');
const UserRepository = require('../repositories/userRepositories');

class UrlServices {
  static async createUrl(urlData) {
    console.log(urlData);
    if (urlData.user_id) {
      const user = await UserRepository.userExistsByID(urlData.user_id);
      if (!user) {
        throw new Error('User not found');
      }
    }
    return UrlRepository.createUrl(urlData);
  }
  static async createRandomUrl(urlData) {
    if (urlData.user_id) {
      const user = await UserRepository.userExistsByID(urlData.user_id);
      if (!user) {
        throw new Error('User not found');
      }
    }
    return UrlRepository.createRandomUrl(urlData);
  }
  static async getUrlCountbyShortCode(short_code) {
    return UrlRepository.getUrlCountbyShortCode(short_code);
  }

  static async redirectToOriginalUrl(short_code) {
    return UrlRepository.redirectToOriginalUrl(short_code);
  }
  static async ExpiredUrl() {
    return UrlRepository.ExpiredUrl();
  }
}
module.exports = UrlServices;
