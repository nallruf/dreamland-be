const routes = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middlewares/multer');

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
routes.get('/item/:id', adminController.showEditItem);
routes.put('/item/:id', uploadMultiple, adminController.editItem);
routes.get('/item/show-image/:id', adminController.showImageItem );
routes.post('/item', uploadMultiple, adminController.addItem);
routes.delete('/item/:id/delete', adminController.deleteItem);

routes.get('/booking', adminController.viewBooking);


module.exports = routes;