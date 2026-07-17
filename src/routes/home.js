/**
 * Home routes
 */

const express = require('express');
const router = express.Router();
const { getHome, getVersion } = require('../controllers/homeController');

router.get('/', getHome);
router.get('/version', getVersion);

module.exports = router;
