const router = require('express').Router();
var axios = require("axios").default;
const Place = require('../models/places.model')
const Cities = require('../models/cities.model')
const multer  = require('multer')
const upload = require('../config/cloudstorage')
const dbDetails = require('../db.json')
const {isLoggedIn} = require('../middlewares/guard')

// route for creating a new place
router.post('/city/:id/add-place', isLoggedIn, upload.single('image'), async (req, res) => {
    const city = await Cities.findById(req.params.id)
    if(!req.file) {const place = await Place.create({ ...req.body, author: req.session.currentUser}); city.places.push(place.id); 
    try {
        await place.save()
        await city.save()
    } catch (err) {
        console.error(err)
    }}
    else {const place = await Place.create({ ...req.body, image: req.file.path, author: req.session.currentUser}); city.places.push(place.id);
    try {
        await place.save()
        await city.save()
    } catch (err) {
        console.error(err)
    }}    
    res.redirect(`/city/${city.id}`)
})

// route for editing an existing place
router.get('/city/:id/edit', async (req, res) => {
    const result = await Place.findById(req.params.id)
    res.render('cities/place-edit', { result })
})

// route for updating a place after editing
router.put('/city/:id/update', async (req, res) => {
    const result = await Cities.findById(req.params.id)
    let place = await Place.findByIdAndUpdate(req.params.id, {...req.body, author: req.session.currentUser})
    await place.save()
    res.send('update')
})

// route for deleting a place
router.delete('/city/:id/delete', async (req, res) => {
    await Place.findByIdAndDelete(req.params.id)
    res.redirect(`/`)
})

module.exports = router