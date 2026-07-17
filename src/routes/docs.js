/**
 * Documentation route
 */

const express = require('express');
const router = express.Router();
const { getDocs } = require('../controllers/docsController');

router.get('/', getDocs);

module.exports = router;
