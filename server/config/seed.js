/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict'
import Thing from '../api/thing/thing.model'
import User from '../api/user/user.model'
import Doc from '../api/doc/doc.model'
import config from './environment/'

export default function seedDatabaseIfNeeded() {
  if (!config.seedDB) {
    return Promise.resolve()
  }

  const thingPromise = Thing.find({})
    .remove()
    .then(() =>
      Thing.create(
        {
          name: 'Development Tools',
          info:
            'Integration with popular tools such as Webpack, Babel, TypeScript, Karma, Mocha, ESLint, Protractor, '
            + 'Pug, Stylus, Sass, and Less.'
        },
        {
          name: 'Server and Client integration',
          info: 'Built with a powerful and fun stack: MongoDB, Express, Angular, and Node.'
        },
        {
          name: 'Smart Build System',
          info:
            'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of '
            + 'scripts and styles into your app.html'
        },
        {
          name: 'Modular Structure',
          info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
        },
        {
          name: 'Optimized Build',
          info:
            'Build process packs up your templates as a single JavaScript payload, minifies your '
            + 'scripts/css/images, and rewrites asset names for caching.'
        },
        {
          name: 'Deployment Ready',
          info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
        }
      )
    )
    .then(() => console.log('finished populating things'))
    .catch((err) => console.log('error populating things', err))

  const userPromise = User.find({})
    .remove()
    .then(() =>
      User.create(
        {
          provider: 'local',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test'
        },
        {
          provider: 'local',
          role: 'admin',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin'
        }
      )
        .then(() => console.log('finished populating users'))
        .catch((err) => console.log('error populating users', err))
    )

  const docPromise = Doc.find({})
    .remove()
    .then(() =>
      Doc.create(
        {
          url: '/api/users/auth/local',
          method: 'POST',
          params: [{ name: 'email', type: 'string' }, { name: 'password', type: 'string' }],
          description: 'User login API reference',
          response: `{
            _id: string
            name: String,
            email: {
              type: String,
              lowercase: true,
              required: true
            },
            role: {
              type: String,
              default: 'user'
            },
            provider: String,
            }`,
          example: {}
        }
      )
        .then(() => console.log('finished populating docs'))
        .catch((err) => console.log('error populating docs', err))
    )
  return Promise.all([
    thingPromise,
    userPromise,
    docPromise
  ])
}
