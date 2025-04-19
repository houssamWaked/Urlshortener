const express = require('express');
const router = express.Router();
const UrlController = require('../controllers/urlController');
const {
  ValidateUrlCreation,
  ValidateRandomUrlCreation,
  ValidateshortCodeParam,
} = require('../validators/urlsDTO.js');

// Route to create a URL
router.post('/', ValidateUrlCreation, (req, res) =>
  UrlController.createUrl(req, res)
);

// Route to create a random URL
router.post('/random', ValidateRandomUrlCreation, (req, res) =>
  UrlController.createRandomUrl(req, res)
);

// Route to get the count of a URL by short_code
router.get('/:short_code/count', ValidateshortCodeParam, (req, res) =>
  UrlController.getUrlCountbyShortCode(req, res)
);

// Route to redirect to the original URL by short_code
router.get('/:short_code', ValidateshortCodeParam, (req, res) =>
  UrlController.redirectToOriginalUrl(req, res)
);

// Route to mark expired URLs as inactive
router.put('/', (req, res) => UrlController.ExpiredUrl(req, res));

module.exports = router;
