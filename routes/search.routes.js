const router = require('express').Router()
const Cities = require('../models/cities.model')
const Post = require('../models/post.model')
const Map = require('../models/map.model')
const axios = require('axios')

// route to search for a city or a country 
router.post('/search', async (req, res) => {
    const result = await Cities.find({
        $or: [
                {name: req.body.search.charAt(0).toUpperCase() + req.body.search.substr(1).toLowerCase()},
                {country: req.body.search.charAt(0).toUpperCase() + req.body.search.substr(1).toLowerCase()}
            ],          
    })
    console.log(result)
    res.render('cities/all-cities', {result})
})

// route to list all major cities of a country
router.get('/:country', async (req, res) => {
    const result = await Cities.find(req.params)
    res.render('cities/all-cities', { result })
})

// route for getting all the infos on that specific city
router.get('/city/:id', async (req, res) => {
    const result = await Cities.findById(req.params.id).populate({path: 'places', populate: {path: 'author'}}).populate({path: 'posts', populate: {path: 'author'}})
    // options to get weather for a city
   /*  const city = result.name
    const weatherOptions = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {q: `${city}`, days: '3'},
    headers: {
    'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
    'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    }
    // send request to weather api 
   const response = await axios.request(weatherOptions)

    // options to get latitude and longitude for a city
   const locationOptions = {
        method: 'GET',
        url: `https://api.myptv.com/geocoding/v1/locations/by-text?searchText=${city}`,
        headers: { 'apiKey': 'MjYxMTAxZjJkODc3NDhmMmIwZTYwMGQyZGQ2YTdkZWM6NWI1ODQ2MDgtODBlYi00NmYxLWJiNDEtOGZkMzI5MTMyNTlk', "Content-Type": "application/json"  }
        }
    // send request to api to get coordinates
    const locationResponse = await axios.request(locationOptions)
    // passing coordinates to map
    const coordinates = [locationResponse.data.locations[0].referencePosition.latitude, locationResponse.data.locations[0].referencePosition.longitude]
 */
    res.render('cities/city-info2', { result })
})

module.exports = router