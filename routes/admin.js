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

routes.put('/item/show-image/:id', upload, adminController.editImageItem );
routes.delete('/item/show-image/:id', adminController.deleteImageItem );


routes.get('/item/detail-item/:itemId', adminController.viewDetailItem);
routes.post('/item/add/featured', upload, adminController.addFeatured);
routes.put('/item/update/featured', upload, adminController.editFeatured);
routes.delete('/item/:itemId/delete/feature/:id', adminController.deleteFeature);

routes.post('/item/add/activity', upload, adminController.addActivity);
routes.put('/item/update/activity', upload, adminController.editActivity);
routes.delete('/item/:itemId/delete/activity/:id', adminController.deleteActivity);


routes.get('/booking', adminController.viewBooking);


module.exports = routes;