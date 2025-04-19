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
);
router.post('/random', ValidateRandomUrlCreation, (req, res) =>
  UrlController.createRandomUrl(req, res)
);
router.get('/:short_code/count', ValidateshortCodeParam, (req, res) =>
  UrlController.getUrlCountbyShortCode(req, res)
);
router.get('/:short_code', ValidateshortCodeParam, (req, res) =>
  UrlController.redirectToOriginalUrl(req, res)
);
router.put('/', (req, res) => UrlController.ExpiredUrl(req, res));

module.exports = router;
