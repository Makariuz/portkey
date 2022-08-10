const router = require('express').Router();
const {isLoggedIn} = require('../middlewares/guard')
const upload = require('../config/cloudstorage')
const Post = require('../models/post.model')
const City = require('../models/cities.model')
const override = require('method-override')
const User = require('../models/user.model')

router.get('/create/:id', isLoggedIn, async (req,res) => {
    res.render('post/add-post', { cityId: req.params.id})
})

router.post('/create/:id', isLoggedIn, upload.single('picture'), async (req,res) => {
    const user = await User.findById(req.session.currentUser._id)
    const city = await City.findById(req.params.id)
    if(!req.file) {const post = await Post.create({ ...req.body, author: req.session.currentUser})
            // adds created content to the user db
            user.content.push(post)
            city.posts.push(post.id)

        try{
            await city.save()
            await post.save()
            await user.save()
            res.redirect('/post/all-posts')

        } catch (error) {
            console.log(error)
        }
    } else {
        {const post = await Post.create({ ...req.body, picture: req.file.path, author: req.session.currentUser})
            // adds created content to the user db
            user.content.push(post)
            city.posts.push(post.id)

        try{
            await city.save()
            await post.save()
            await user.save()
            res.redirect('/post/all-posts')

        } catch (error) {
            console.log(error)
        }
    }
}})

router.get('/all-posts', async (req,res) => {
    const post = await Post.find()
    res.render('post/all-posts', { post })
})

router.get('/read/:id', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author')
    res.render('post/read-post', { post }) 
})

router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post/edit-post', { post }) 
})

router.post('/:id/update', isLoggedIn, async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, {...req.body, author: req.session.currentUser}, {new: true})
    res.render('post/read-post', { post }) 
})

// route for deleting a post
router.post('/:id/delete', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect(`/post/all-posts`)
})


module.exports = router