const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const options = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.JWT_KEY || 'HALAMADRID',
}

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    new Promise((resolve, rejected) => {
        if(payload.sub === 'admin'){
            resolve(payload.sub);
        } else {
            rejected("Error");
        }
    })
    .then((user) => done(null, user))
    .catch((err) => done(err, false));
  })
)

module.exports = passport;
