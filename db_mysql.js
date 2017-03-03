// Wrapper for the mysql library

var mysql = require('mysql');

var config = {
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database',
  port: 3306,
  connectionLimit: 10,
  multipleStatements: true
};

function Db() {
  var self = this;
  var _pool = null;

  this.init = function() {
    _pool = mysql.createPool(config);
    return self;
  }

  this.escape = function(input) {
    return mysql.escape(input);
  }
  
  this.queryOne = function(sql, data) {
    return this.query(sql, data, true);
  }

  this.query = function(sql, data, single) { 
    // return _pool.query(sql, params);
    var single = single || false;
    
    return new Promise((resolve, reject) => {
      var cb = function(err, qr) {
        if (err) {
          console.log(">> Db.query() ERROR -> ", err);
          return reject({ error: err, query: sql, data: data });
        }

        if (single && qr.length)
          return resolve(qr[0]);

        return resolve(qr);
      }

      if (data)
        _pool.query(sql, data, cb);
      else 
        _pool.query(sql, cb);
    });
  }

  return this.init();
}

module.exports = new Db();
