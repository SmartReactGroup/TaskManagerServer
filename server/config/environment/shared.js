'use strict'
/*eslint no-process-env:0*/

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  // List of user roles
  userRoles: ['guest', 'user', 'admin']
}
