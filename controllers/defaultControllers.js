const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const User = require('../models/UserModel').User;
const Comment = require('../models/CommentModel').Comment;
const bcrypt = require('bcrypt');
const fdownload = require("file-downloadr");
 
module.exports = {
    index: async (req, res) => {
        const posts = await Post.find();
        const categories = await Category.find();
        const user = await User.find();
        res.render('default/index', {posts: posts, categories: categories})
    },
    loginGet: (req, res) => {
        // User.find().then(users => {
             
        res.render('default/login')
    // });
    },
    loginPost: (req, res) => {
        // User.findById(req.params.id)
        //  User.find().then(users => {
            res.render('default/login', { user: req.user.firstName });
        //   });
        // res.send('default/login')
    },
    registerGet: (req, res) => {
        res.render('default/register')
    },
    registerPost: (req, res) => { 
         let errors = [];
         if (!req.body.firstName) {
            errors.push({message: 'First name is mandatory'});
        }
        if (!req.body.lastName) {
            errors.push({message: 'Last name is mandatory'});
        }
        if (!req.body.email) {
            errors.push({message: 'Email field is mandatory'});
        }
        if (!req.body.password || !req.body.passwordConfirm) {
            errors.push({message: 'Password field is mandatory'});
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({message: 'Passwords do not match'});
        }

        if (errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else {
            User.findOne({email: req.body.email}).then(user => {
                if (user) {
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                } else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'You are now registered');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }


    },
downloadNotes: (req, res) => {
     const id = req.params.id;
     //const file = req.params.getUploadedFile;
      
     
     Post.findById(id)
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(post => {
            if (!post) {
                res.status(404).json({message: 'No Post Found'});
            }
            else {
                console.log()
                
                const file = post.file;
                console.log(file);
                 var str = './public';
                 str += `${file}`;
                 console.log(str);
                 res.download(str);
                
            }
        })
      
   //var file = __dirname + `/public/${}` 
    
    // const url = require('url'); // built-in utility
// res.redirect(url.parse(req.url).pathname);





   // const post = req.query.post;
 
//    Post.findById(id)
//    .then(post => {
       
        
//    });
 

// const file = "./public/uploads/cc.PNG";

// const cats = await Post.find();

      
         
      
    //  console.log(file);
  //res.download(file); // Set disposition and send it.

//  - - --- - - - - - - -- - - - - - - - -- - - - -
    
    //     res.send(fp);
        // Post.find(function(err,docs) {
        //     res.send(docs)
        //   });
     
        // Post.find({post})
        //     .select('file')
        //         .exec((err, docs) => {
                    
        //             if (err) {
        //                 return res.status(500)
        //                 .json({ message: 'error querying cities', error: err });
        //             }
        //             if (!docs) {
        //                 return res.status(404)
        //                 .json({ message: 'No valid entry found for provided City' });
        //             }
        //             return res.status(200)
        //                 .json({
        //                 count: docs.length,
        //                 facility: docs
        //             });
                   
        //             // next(); 
        //         })

       
    
},
    getSinglePost: (req, res) => {
        const id = req.params.id;
        const categories =  Category.find();
        // https://www.mindstick.com/Articles/1499/upload-and-download-file-in-node-js

        // https://stackfame.com/downloading-files-from-server-express
       
        Post.findById(id)
            .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
            .then(post => {
            if (!post) {
                res.status(404).json({message: 'No Post Found'});
            }
            else {
                console.log()
                res.render('default/singlePost', {post: post, comments: post.comments});
                 const file = post.file;
                  //console.log(file);
                // var str = './public';
                // str += `${file}`;
                //  res.download(str);
                  
            }
        })
    },
    getSinglePostName: (req, res) => {
        const name = req.params.name;
        console.log(name);
        res.render('default/singlePost');
       
        // Post.findOne({name})
        //     .populate({path: 'comments', populate: {path: 'user', model: 'user'}})
        //     .then(post => {
        //     if (!post) {
        //         res.status(404).json({message: 'No Post Found'});
        //     }
        //     else {
        //         console.log()
        //         res.render('default/singlePost', {post: post, comments: post.comments});
        //          const file = post.file; 
                  
        //     }
        // })
    },

submitComment: (req, res) => {

        if (req.user) {
            Post.findById(req.body.id).then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                });

                post.comments.push(newComment);
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                      req.flash('success-message', 'Your comment was submitted for review.');
                      res.redirect(`/post/${post._id}`);
                    });
                });


            })
        }

        else {
            req.flash('error-message', 'Login first to comment');
            res.redirect('/login');
        }

    }

}