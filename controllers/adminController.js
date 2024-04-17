const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Featured = require('../models/Feature');
const fs = require('fs-extra');
const path = require('path');
const { error } = require('console');


module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: 'Dreamland | Dashboard'
        });
    },

    viewCategory: async (req, res) => {
        try {
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus};
            res.render('admin/category/view_category', { 
                category,
                alert,
                title: 'Dreamland | Category'
            
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.render('admin/category/view_category');
            
        }
        
    },

    addCategory: async (req, res) =>{
        try {
            const {name} = req.body;
            // console.log(name)
            await Category.create({ name });
            req.flash('alertMessage', 'Success add category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category')
            
        }

       
    },

    editCategory: async (req, res) => {
        try {
            const {id, name} = req.body;
            const category = await Category.findOne({ _id : id });
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success update category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category')
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
            
        }

    },

    deleteCategory: async (req, res) => { 
        try {
            const {id} = req.params;
            const category = await Category.findOne({ _id:id });
            await category.deleteOne();
            req.flash('alertMessage', 'Success delete category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
            
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
            
        }
    },

    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus};
            res.render('admin/bank/view_bank', {
                title: 'Dreamland | Bank',
                bank,
                alert
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
            
        }
    },

    addBank: async (req, res) => {
        try {
            const {nameBank, nomerRekening, name} = req.body;
            await Bank.create({
                nameBank,
                nomerRekening,
                name,
                imageUrl : `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success add bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
            
        }
    },

    editBank: async (req, res) => {
        try {
            const { id, name, nameBank, nomerRekening} = req.body;
            const bank = await Bank.findOne({ _id : id});
            if (req.file == undefined){
                bank.name = name;
                bank.nomerRekening = nomerRekening;
                bank.nameBank = nameBank;
                await bank.save();
            req.flash('alertMessage', 'Success update bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank')
            }else{
                await fs.unlink(path.join(`public/${bank.imageUrl}`))
                bank.name = name;
                bank.nomerRekening = nomerRekening;
                bank.nameBank = nameBank;
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save();
                req.flash('alertMessage', 'Success update bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
            
        }
    },

    deleteBank: async (req, res) => {
        try {
            const {id} = req.params;
            const bank = await Bank.findOne({ _id : id });
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.deleteOne();
            req.flash('alertMessage', 'Success delete bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    viewItem: async (req, res) => {
        try {
            const item = await Item.find()
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });

            const ctg = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus};
            res.render('admin/item/view_item', {
                title: 'Dreamland | Item',
                ctg,
                alert,
                item,
                action: 'view'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
            
        }
    },

    addItem: async (req, res) => {
        try {
            const {title, price, city, categoryId, desc} = req.body;
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id : categoryId });
                console.log(category)
                const newItem= {
                    categoryId,
                    title,
                    price,
                    city,
                    description: desc
                }

                const item = await Item.create(newItem);
                console.log(item)
                console.log(category.schema)


                category.itemId.push({ _id: item._id});
                await category.save();

                
                for (let i = 0; i < req.files.length; i++) {
                    const imgSave = await Image.create({ imageUrl: `images/${req.files[i].filename}`});
                    item.imageId.push({ _id : imgSave._id });
                    await item.save();
                }

                req.flash('alertMessage', 'Success add item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item')

            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
            
        }
    },

    showImageItem: async (req, res) => {
        try {
            const  {id} = req.params;
            const item = await Item.findOne({ _id: id})
                .populate({ path: 'imageId', select: 'id imageUrl' });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus};
            res.render('admin/item/view_item', {
                title: 'Dreamland | Show Image Item',
                alert,
                item,
                action: 'show image'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
            
        }
    },

    showEditItem: async (req, res) => {
        try {
            const  {id} = req.params;
            const item = await Item.findOne({ _id: id})
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });;

            const ctg = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus};
            res.render('admin/item/view_item', {
                title: 'Dreamland | Edit Item',
                alert,
                item,
                ctg,
                action: 'edit'
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
            
        }
    },

    editItem: async (req, res) => {
        try {
            const {id} = req.params;
            const {title, price, city, categoryId, desc} = req.body;

            console.log(req.body)
            const item = await Item.findOne({ _id: id})
                .populate({ path: 'imageId', select: 'id imageUrl' })
                .populate({ path: 'categoryId', select: 'id name' });;

            if (req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    const imageUpdate = await Image.findOne({ _id : item.imageId[i]._id});
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
 
                item.title = title,
                item.price = price,
                item.description = desc,
                item.city = city,
                item.categoryId = categoryId
                await item.save();

                req.flash('alertMessage', 'Success update item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item') 
                
            }else{
                item.title = title,
                item.price = price,
                item.description = desc,
                item.city = city,
                item.categoryId = categoryId
                await item.save();

                req.flash('alertMessage', 'Success update item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item')


            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },


    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({ _id : id }).populate('imageId');

            for (let i = 0; i < item.imageId.length; i++){
                // Image.findOne({ _id: item.imageId[i].id}).then( async (image) => {
                //     await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                //     image.remove();
                // }).catch((error) => {
                //     req.flash('alertMessage', `${error.message}`);
                //     req.flash('alertStatus', 'danger');
                //     res.redirect('/admin/item');
                // });        

                const image = await Image.findOne({ _id: item.imageId[i].id });

                await fs.unlink(path.join(`public/${image.imageUrl}`));
                await image.deleteOne();
            }

            await item.deleteOne();
            req.flash('alertMessage', 'Success delete item');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item')


        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    
    viewDetailItem: async (req, res) => {
        const { itemId } = req.params;
        
        try {
            const item = await Featured.find({ itemId: itemId });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus};
            
            res.render('admin/item/detail/view_detail', {
                title: 'Dreamland | Detail Item',
                alert,
                item,
                itemId
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail/view_detail/${itemId}`);
            
        }

    },

    addFeatured: async (req, res) => {
        const {name, qty, itemId} = req.body;
        try {

            if (!req.file) {
                req.flash('alertMessage', `Image not found`);
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }

            const featured = await Featured.create({
                name,
                qty,
                itemId,
                imageUrl : `images/${req.file.filename}`
            });

            const item = await Item.findOne({ _id : itemId });
            item.featureId.push({ _id : featured.id });
            await item.save();

            req.flash('alertMessage', 'Success add Featured');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail-item/${itemId}`);
            
        }
    },

    editFeatured: async (req, res) => {
        const { id, name, qty , itemId } = req.body;
        try {
            const featured = await Featured.findOne({ _id : id});
            if (req.file == undefined){
                featured.name = name;
                featured.qty = qty;
                await featured.save();
                req.flash('alertMessage', 'Success update feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }else{
                await fs.unlink(path.join(`public/${featured.imageUrl}`))
                featured.name = name;
                featured.nomerRekening = qty;
                featured.imageUrl = `images/${req.file.filename}`
                await featured.save();
                req.flash('alertMessage', 'Success update feature');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/detail-item/${itemId}`);
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail-item/${itemId}`);  
            
        }
    },

    deleteFeature: async (req, res) => {
        const {id, itemId} = req.params;

        try {
            const featured = await Featured.findOne({ _id : id });

            const item = await Item.findOne({ _id : itemId }).populate('featureId');

            for (let i = 0; i < item.featureId.length; i++) {
                if (item.featureId[i]._id.toString() === featured._id.toString()) {
                    item.featureId.pull({ _id : featured._id });
                    await item.save();
                }
                              
            }
            await fs.unlink(path.join(`public/${featured.imageUrl}`));
            await featured.deleteOne();

            req.flash('alertMessage', 'Success delete feature');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/detail-item/${itemId}`);


        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail-item/${itemId}`);  
        }
    },


    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', {
            title: 'Dreamland | Booking'
        });
    }


    
}