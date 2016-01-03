module.exports = {
  description: '',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },
  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function(options) {
    // Perform extra work here.
    return this.addBowerPackagesToProject([
      {name: 'ace-builds', target: '~1.2.2'},
    ]);
  }
};
