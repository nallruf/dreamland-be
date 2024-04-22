const routes = require('express').Router();
const apiController = require('../controllers/apiController');
// const { upload, uploadMultiple } = require('../middlewares/multer');

routes.get('/landing', apiController.landingPage);


module.exports = routes; 