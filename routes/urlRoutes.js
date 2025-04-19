const express = require('express');
const router = express.Router();
const UrlController = require('../controllers/urlController');


router.post('/', (req, res) => UrlController.createUrl(req, res)); // Create a URL
router.get('/:short_code', (req, res) => UrlController.redirectToOriginalUrl(req, res)); // Get all URLs



module.exports = router;