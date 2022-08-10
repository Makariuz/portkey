/* const mongoose = require('mongoose');
const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model')

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://portkey1.herokuapp.com/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleID: profile.id })
        console.log(profile)
        if (!user) {
            try {
                const newUser = await User.create({
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value
                })
                done(null, newUser)
                console.log(profile, 'created successfully')
            } catch (err) {
                done(err)
            }
        } else if (user) {
            done(null, user)
            console.log(user, 'user exists already')
        }
    } catch (err) {
        done(err)
    }
    }))
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })
  passport.deserializeUser((user, done) => {
    User.findOne(user.email, (err, user) => {
      done(err, user)
    })
  })
}


 */