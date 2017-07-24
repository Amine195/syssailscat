module.exports = function(req, res, next){

  if(req.isSocket)
  {
    if(req.session && req.session.passport && req.session.passport.user)
    {

      // Use This :
      // Initialize Passport

      sails.config.passport.Initialize() (req, res, function () {
        // Use He built-in Session
        sails.config.passport.session() (req, res, function () {
          // Make the User avaible throught the frontend
          // res.locals.user = req.user;
          // the user should be deseralized by passport now;

          next();
        });
      });

      // Or this is you dont care about deseralized the user;
      // req.user = req.session.passport.user;
      // return next ();
    } else {
      res.json(401);
    }
  } else if (req.isAthenticated()) {
    return next();
  } else {
    //user is not allowed
    // (default res.forbidden() behavior can be overriden in 'config')
    return res.redirect('/login');
  }
};
