let AGSpiel = function () {
  this.zins = require('./zins.js')
  this.retrieve = require('./retrieve.js')
  this.format = require('./format.js')
  this.auth = function(phpsessid, agspiel) {
    let a = require('./auth.js')
    a.PHPSESSID = phpsessid
    a.agspiel = agspiel
    return this
  }
  this.preset = require('./anleihenpreset.js').preset
}

module.exports = new AGSpiel();
