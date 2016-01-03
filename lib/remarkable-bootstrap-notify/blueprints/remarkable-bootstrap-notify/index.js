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
      {name: 'remarkable-bootstrap-notify', target: '~3.1.3'},
    ]);
  }

};
