module.exports = {
  streamingLog: require('./streaming-log')
};


Object.assign(require('rethinkdb').not().constructor.__super__.constructor.__super__.constructor.prototype, {
  debug: function(text) {
    if (text) {
      console.log(text, this.toString());
    } else {
      console.log(this.toString());
    }
  }
})
