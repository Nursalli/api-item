//Passport
const passport = require('../lib/passport-jwt');

const restrict = passport.authenticate('jwt', {
    session: false
})

module.exports = restrict