const routes = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload } = require('../middlewares/multer');

routes.get('/dashboard', adminController.viewDashboard);
routes.get('/category', adminController.viewCategory);
routes.post('/category', adminController.addCategory);
routes.put('/category', adminController.editCategory);
routes.delete('/category/:id', adminController.deleteCategory);
routes.get('/bank', adminController.viewBank);
routes.post('/bank', upload, adminController.addBank);
routes.delete('/bank/:id', adminController.deleteBank);
routes.put('/bank', upload, adminController.editBank);
routes.get('/item', adminController.viewItem);
routes.get('/booking', adminController.viewBooking);


module.exports = routes;