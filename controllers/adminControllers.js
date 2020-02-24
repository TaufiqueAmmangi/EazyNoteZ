const Post = require('../models/PostModel').Post;
 
const Category = require('../models/CategoryModel').Category;

const UserModel = require('../models/UserModel').UserModel;
const UserProfile = require('../models/UserProfile').UserProfile;
const {isEmpty} = require('../config/customFunctions');

 
module.exports = {
    index: (req, res) => {
        res.render('admin/index')
    },
    getPost: (req, res) => {
        
        Post.find().populate('category Users').then(posts => {
            
            
            res.render('admin/posts/index', {posts: posts, user: req.user.firstName});
            
        })
    // getPost: (req, res) => {
        // Post.find({}, (err, results) => {
        //     if (err || !results) {
        //       res.render('admin/posts', { messages: { error: ['User not found'] } });
        //     }
        
        //     res.render('admin/posts/index', { ...results, username });
        //   });
        
        // Post.findOne({id}, function(err, post){
        //     if (err)
        //         return done(err);
        
        //     if (Users) {
            
        //       res.render('admin/posts/index', {
        //         posts: Users
        //       });
        //     }
        //   });
    //     const id = req.params.id;
    //       Post.findOne({id})
    //             .populate('userPost')
    //             .exec(function(err, post) {
    //                 if (err)
    //                 throw err;
        
    //         if (Users) {
            
    //           res.render('admin/posts/index', {
    //             posts: Users
    //           });
    //         }
    //             });
        
     },
    
    submitPosts: (req, res) => {
        const id = req.params.id;
        const commentsAllowed = !req.body.allowComments;

        // Check for any input file
        let filename = '';
        let imgFile = '';
        if (!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            let imgFiles = req.files.uploadedImgFile;
            filename = file.name;
            imgFile = imgFiles.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
            imgFiles.mv(uploadDir + imgFile, (err) => {
                if (err)
                    throw err;
            });
        }
        let errors = [];
        if (!req.body.sem) {
           errors.push({message: 'SEM is mandatory'});
       }
       if (!req.body.sub) {
           errors.push({message: 'SUBJECT is mandatory'});
       }
       if (!req.body.professorName) {
           errors.push({message: 'PROFESSOR NAME is mandatory'});
       }
       if (!req.body.title) {
           errors.push({message: 'TITLE is mandatory'});
       }
    //    if (!req.body.filename) {
    //     errors.push({message: 'FILENAME is mandatory'});
    //     }
    //     if (!req.body.imgFile) {
    //         errors.push({message: 'IMAGE FILE is mandatory'});
    //     }
        if (!req.body.category) {
            errors.push({message: 'CATEEGORY is mandatory'});
        }
       if (!req.body.description) {
           errors.push({message: 'ADDITIONAL MESSAGE Is Required'});
       }
       
    

       if (errors.length > 0) {
           res.render('admin/posts/create', {
               errors: errors,
               semester: req.body.sem,
               subject: req.body.sub,
               professorName: req.body.professorName,
               title: req.body.title,
               description: req.body.description, 
               allowComments:commentsAllowed,
               category: req.body.category,
               file: `/uploads/${filename}`,
               imageF:`/uploads/${imgFile}`
           });
       } 
        else {
            const newPost = new Post({
                semester: req.body.sem,
                subject: req.body.sub,
                professorName: req.body.professorName,
                title: req.body.title,
                description: req.body.description, 
                allowComments:commentsAllowed,
                category: req.body.category,
                file: `/uploads/${filename}`,
                imageF:`/uploads/${imgFile}`
            });
            newPost.save().then(post => {
                console.log(post);
                req.flash('success-message', 'Post Created Successfully');
                res.redirect('/admin/posts');
            });
        }
    },
    createPost: (req, res) => {
        Category.find().then(cats => {
        res.render('admin/posts/create', {categories: cats});
    });
    },

    editPost: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                Category.find().then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                    
                });
            });
       
        
    },

     editPostSubmit: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;
        const id = req.params.id;
        //const fileI = req.files.uploadedFile.name;
        // Post.findById(id)
        // .then(post => {
        //     post.title = req.body.title;
        //     // post.status = req.body.status;
        //     post.allowComments = commentsAllowed;
        //     post.description = req.body.description;
        //     post.category = req.body.category;
        //     post.uploadedFile = req.file;
        //     post.save().then(updatePost => {
        //         req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
        //         res.redirect('/admin/posts');
        //     });
             
        // });

        Post.findById(id)
            .then(post => {
                post.professorName = req.body.professorName;
                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = commentsAllowed;
                post.description = req.body.description;
                post.category = req.body.category;  
                //  TODO:
                //  post.file = req.files;
                // console.log(post.category);

                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');
                });
            });
     },
    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id)
            .then(deletePost => {
                req.flash('success-message', `THe post $(deletePost.title) is deleted`);
                res.redirect('/admin/posts');
            });
    },
    // All Category Methods 
    getCategories: (req, res) => {
         
        
        Category.find().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },

    createCategories: (req, res) => {
        let categoryName = req.body.name;
        console.log(categoryName);        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }

    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find();


        Category.findById(catId).then(cat => {

            res.render('admin/category/edit', {category: cat, categories: cats});

        });

        
    },

    editCategoriesPostRoute: (req, res) =>{
        const catId = req.params.id;
        const newTitle = req.body.name;

        if(newTitle){
            Category.findById(catId).then(category => {
                category.title = newTitle;
                category.save().then(updated => {
                    res.status(200).json({url: '/admin/category'});
                })
            })
        }
    },

    deleteCategory: (req, res) => {
        Category.findByIdAndDelete(req.params.id)
            .then(deleteCategory => {
                req.flash('success-message', `THe post $(deleteCategory.title) is deleted`);
                res.redirect('/admin/category');
            });
    },

    // User's Profile
    getUserProfile: (req, res) => { 
        
        const id = req.params.id;
      
 
        // const newPost = new Post({
             
        // });
        // newPost.save().then(post => {
        //     console.log(post);
        //     req.flash('success-message', 'Post Created Successfully');
        //     res.redirect('/admin/posts');
        // });
            //  res.render('admin/profile/index');
      
            Post.find().populate('userprofiles').then(userProfile => { 
                 
                res.render('admin/profile/index', {userProfile: req.user.firstName});
                
            })
    
        
    },
    postUserProfile: (req, res) => {
        let imgFile = '';
        if (!isEmpty(req.files)) {
            
            let imgFiles = req.files.uploadedImgFile;
             
            imgFile = imgFiles.name;
            let uploadDir = './public/uploads/';
 
            imgFiles.mv(uploadDir + imgFile, (err) => {
                if (err)
                    throw err;
            });
        }
        let errors = [];
        if (!req.body.firstname) {
            errors.push({message: 'FIRSTNAME is mandatory'});
        }
        if (!req.body.lastname) {
            errors.push({message: 'LASTNAME NAME is mandatory'});
        }
        if (!req.body.yrsOfExp) {
            errors.push({message: 'YEARS OF EXPERIENCE is mandatory'});
        }
        if (!req.body.addInfo) {
            errors.push({message: 'ADD INFO Is Required'});
        }
        // if (!req.body.imgFile) {
        //     errors.push({message: 'PROFILE IMAGE is mandatory'});
        // }
        if (errors.length > 0) {
            res.render('admin/profile/index', {
                errors: errors, 
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                experience:req.body.yrsOfExp,
                field:req.body.addInfo
                // imageF:`/uploads/${imgFile}`
            });
        } 
        
        else{
            const newProfile = new UserProfile({
                
                firstName:req.body.firstname,
                lastName:req.body.lastname,
                experience:req.body.yrsOfExp,
                field:req.body.addInfo
                // imageF:`/uploads/${imgFile}`
            });
            // console.log(req.body);
            // const newProfile = new UserProfile(req.body);
            newProfile.save().then(userprofile => {
                console.log(userprofile);
                req.flash('success-message', 'Profile Created Successfully');
                res.redirect('/admin/profile/view');
            })
        }






        
        
    },

    
    // editProfile: (req, res) => {
    //     const id = req.params.id;

    //     Post.findById(id)
    //         .then(userprofiles => {
                
    //                 res.render('admin/profile/edit', {userprofile: userprofiles});                   
               
    //         });
       
        
    // },
    // editProfileSubmit: (req, res) => {
    //     const id = req.params.id;
    //     UserProfile.findById(id)
    //         .then(userprofile => { 

    //             userprofile.firstName=req.body.firstname,
    //             userprofile.lastName=req.body.lastname,
    //             userprofile.experience=req.body.yrsOfExp,
    //             userprofile.field=req.body.addInfo;

    //             userprofile.save().then(updateProfile => {
    //                 req.flash('success-message', `The Post ${updateProfile.title} has been updated.`);
    //                 res.redirect('/admin/profile/viewProfile');
    //             })
    //         })

    // },
    viewtUserProfile: (req, res) => {
        
        UserProfile.find().then(userProfile => { 
                 
            res.render('admin/profile/viewProfile', {userProfile: userProfile});
            
        }) 
        // UserProfile.find().then(userprofiles => { 
                 
        //     res.render('admin/profile/viewProfile', {userprofiles: userprofiles});
            
        // }) 
     }

    
    
       
     
     
}