'use strict';

LogHuman.API_HOST = 'data.loghuman.com';
LogHuman.API_PORT = 443;
LogHuman.API_PATH = '/messages';
LogHuman.API_METHOD = 'POST';

LogHuman.STATUSES = [ 'debug', 'success', 'info', 'warning', 'error' ];

var querystring = require('querystring');
var https = require( 'https' );

function LogHuman ( api_key ) {
  
  if ( ! ( this instanceof LogHuman ) )
    return new LogHuman( api_key );

  this._api = {
    key: api_key
  };

};

LogHuman.prototype = {

  send: function ( message, status, options, f ) {

    if ( LogHuman.STATUSES.indexOf(status) == -1 )
      throw 'The message status must be one of ' + LogHuman.STATUSES.join(', ')

    var payload = options || {};
    payload.message = message;
    payload.status = status;
    payload.timestamp = (new Date()).getTime();
    payload.date = this._formatDate();

    this._execute( [payload], f );

  },

  _execute: function ( payloads ) {

    var options = {
      hostname: LogHuman.API_HOST,
      port: LogHuman.API_PORT,
      path: LogHuman.API_PATH,
      method: LogHuman.API_METHOD,
      auth: this._api.key + ':',
    };

    var req = https.request( options )
    req.write( JSON.stringify(payloads) );
    req.end();

  },

  _formatDate: function ( ) {
    var date = new Date()
    var str = date.getFullYear()
    str += '-' + ( date.getMonth() < 9 ? '0' + (date.getMonth()+1) : (date.getMonth()+1) );
    str += '-' + ( date.getDate() < 10 ? '0' + date.getDate() : date.getDate() );
    return str;
  }

}

module.exports = LogHuman
