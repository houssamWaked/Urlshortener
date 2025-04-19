const express = require('express');
const router = express.Router();
const UrlController = require('../controllers/urlController');
const {
  ValidateUrlCreation,
  ValidateRandomUrlCreation,
  ValidateshortCodeParam,
} = require('../validators/urlsDTO.JS');

router.post('/', ValidateUrlCreation, (req, res) =>
  UrlController.createUrl(req, res)
); // Create a URL
router.post('/random', ValidateRandomUrlCreation, (req, res) =>
  UrlController.createRandomUrl(req, res)
); // Create a random URL
router.get('/:short_code', ValidateshortCodeParam, (req, res) =>
  UrlController.redirectToOriginalUrl(req, res)
);
router.put('/', (req, res) => UrlController.ExpiredUrl(req, res));

module.exports = router;
