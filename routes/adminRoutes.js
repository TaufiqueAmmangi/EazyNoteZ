const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const {isUserAuthenticated} = require("../config/customFunctions");
router.all('/*', isUserAuthenticated, (req, res, next) => {
    
    req.app.locals.layout = 'admin';
    
    next();
})

router.route('/')
        .get(adminController.index)
        .post(adminController.index);




router.route('/posts')
        .get(adminController.getPost);

router.route('/posts/create/')
        .get(adminController.createPost)
        .post(adminController.submitPosts);

router.route('/posts/edit/:id')
        .get(adminController.editPost)
        .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
        .delete(adminController.deletePost);

// Admin Category Routes

router.route('/category')
        .get(adminController.getCategories);

router.route('/category/create')
        .post(adminController.createCategories);

router.route('/category/edit/:id')
        .get(adminController.editCategoriesGetRoute)
        .post(adminController.editCategoriesPostRoute);
 
router.route('/category/delete/:id')
        .delete(adminController.deleteCategory);

// User's Profile
router.route('/profile')
        .get(adminController.getUserProfile);

router.route('/profile/create')        
        .post(adminController.postUserProfile);

router.route('/profile/view')
        .get(adminController.viewtUserProfile); 


// router.route('/profile/edit/:id')
//         .get(adminController.editProfile)
//        .put(adminController.editProfileSubmit);

        module.exports = router;