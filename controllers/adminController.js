const Category = require('../models/Category')
const Bank = require('../models/Bank')
const fs = require('fs-extra')
const path = require('path')


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

    viewItem: (req, res) => {
        res.render('admin/item/view_item', {
            title: 'Dreamland | Item'
        });
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', {
            title: 'Dreamland | Booking'
        });
    },
}