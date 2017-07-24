var Bcrypt = require('bcrypt');
var Crypto = require('crypto');

module.exports = {
  // Generate a bcrypt hash from input
  generate: function(options, input, cb){
    var saltComplexity = options.saltComplexity || 10;
    Bcrypt.genSalt(saltComplexity, function(err, salt) {
      Bcrypt.hash(input, salt, function(err, hash) {
        if(err) return cb(err);
        return cb(null, hash);
      });
    });
  },
  // Compare a given string against a hash
  compare: function(input, hash,cb) {
    Bcrypt.compare(input, hash, function (err, res){
      return cb(res);
    });
  },
  // Generate md5 Token
  token: function(input){
    var hash = Crypto.createHash('md5').update(input).digest('hex');
    return hash;
  }
}
