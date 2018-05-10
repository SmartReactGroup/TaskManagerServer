/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/server-dev'
  },

  // Seed database on startup
  seedDB: false,

  devServer: {
    host: 'localhost',
    port: 8080
  }
}
