const passport = require('passport');
const MITStrategy = require('passport-mitopenid').MITStrategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');

passport.use('mitopenid', new MITStrategy({
  clientID: process.env.MIT_CLIENT_ID,
  clientSecret: process.env.MIT_CLIENT_SECRET,
  callbackURL: '/auth/mitopenid/callback'
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({mitid: profile.id}, function (err, user) {
    if (err) {
      return done(err);
    } else if (!user) {
      return createUser();
    } else {
      return done(null, user);
    }
  });
  function createUser() {
    const new_user = new User({
      name: profile.name,
      email: profile.email,
      mitid: profile.id,
      location: 'Unknown Location'
    });
    new_user.save(function (err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // config variables
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  User.findOne({
    'mitid': profile.id
  }, function(err, user) {
    if (err) return done(err);

    if (!user) {
      const user = new User({
        name: profile.displayName,
        mitid: profile.id,
        location: 'Unknown Location',
        email: profile.emails[0].value
      });

      user.save(function(err) {
        if (err) console.log(err);

        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;