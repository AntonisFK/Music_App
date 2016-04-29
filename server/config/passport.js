//config passport.js

//load all the things we need 
var LocalStrategy = require('passport-local').Strategy;
//load up the user model
var User = require('../models/user');
//load up facebook Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
// load up variables from auth.js 
var configAuth = require('./auth')

module.exports= function(passport){

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

      // check to see if theres already a user with that email
        if (user) {
           return done(null, false, {error:'That email is already taken.'});
        } else {

      // if there is no user with that email
      // create the user
        var newUser = new User();

        // set the user's local credentials
        newUser.local.email    = email;
        newUser.local.password = newUser.generateHash(password);

        // save the user
        newUser.save(function(err) {
          if (err)
            throw err;
            return done(null, newUser);
          });
        }
      }); 

    });

  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
    function(req, email, password, done) { // callback with email and password from our form

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.email' :  email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err)
      return done(err);

    // if no user is found, return the message
    if (!user)
      return done(null, false, {error: "No user found"}); // send json No user found

  // if the user is found but the password is wrong
  if (!user.validPassword(password))
  return done(null, false, {error: 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

  // all is well, return successful user
  return done(null, user);
  });

  }));


  //code for login (use('local-login, new LocalSategy'))
  // code for signup (use('local-sginup', new LocalStategy))

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================


  passport.use(new FacebookStrategy ({

    //pul in our app id and secret from our auth.js file 
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['emails', 'displayName', 'name']

  },
    //facebook will send back the token and profile 
    function(token, refreshToken, profile, done){

  //asynchronous 
  process.nextTick(function(){

  //find the user in the databse based on their facebookid
  User.findOne({'faebook.id': profile.id}, function(err, user){

  //if there is an error, stop and return error
    if(err){
      console.log(err);
      return done(err);
    }
    //if there is a user log them in 
    if(user){
      return done(null, user); // user found return that user 

    }else{ //if there is no user found then let make one  
      var newUser = new User(); //create an instance of user 

      //set all of the facebook information in our user model
      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.facebook.name = profile.name.givenName + ' ' +  profile.name.familyName; //set first and last name 
      // newUser.facebook.email = profle.emails[0].value; // facebook can retunr mutiple email set it to the first  

     //save our user to the databse 
    newUser.save(function(err){
      if(err){
      console.log(err);
    }
      return done(null, newUser); 
    });
    }
  })
  })
  }
  ))

}