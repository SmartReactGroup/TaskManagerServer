import _ from 'lodash'
import del from 'del'
import gulp from 'gulp'
import grunt from 'grunt'
import path from 'path'
import through2 from 'through2'
import gulpLoadPlugins from 'gulp-load-plugins'
import http from 'http'
import open from 'open'
import gutil from 'gulp-util'
import lazypipe from 'lazypipe'
import nodemon from 'nodemon'
import { Server as KarmaServer } from 'karma'
import runSequence from 'run-sequence'
import { protractor, webdriver_update } from 'gulp-protractor'
import { Instrumenter } from 'isparta'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

const appConfig = require('./server/config/environment/development')
const plugins = gulpLoadPlugins()
let config

const clientPath = 'client'
const serverPath = 'server'
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [`${clientPath}/**/!(*.spec|*.mock).js`],
    styles: [`${clientPath}/{app,components}/**/*.styl`],
    mainStyle: `${clientPath}/app/app.styl`,
    views: `${clientPath}/{app,components}/**/*.html`,
    mainView: `${clientPath}/app.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ['e2e/**/*.spec.js']
  },
  server: {
    scripts: [`${serverPath}/**/!(*.spec|*.integration).js`, `!${serverPath}/config/local.env.sample.js`],
    json: [`${serverPath}/**/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, 'mocha.global.js'],
      unit: [`${serverPath}/**/*.spec.js`, 'mocha.global.js']
    }
  },
  karma: 'karma.conf.js',
  dist: 'dist'
}

function onServerLog(log) {
  const white = plugins.util.colors.white('[')
  const yellow = plugins.util.colors.yellow('nodemon')
  console.log(`${white}${yellow}${white} ${log.message}`)
}

function checkAppReady(cb) {
  http
    .get({
      host: 'localhost',
      port: config.port
    },
    () => cb(true)
    )
    .on('error', () => cb(false))
}

// Call page until first success
function whenServerReady(cb) {
  let serverReady = false
  const appReadyInterval = setInterval(
    () =>
      checkAppReady((ready) => {
        if (!ready || serverReady) {
          return
        }
        clearInterval(appReadyInterval)
        serverReady = true
        cb()
      }),
    100
  )
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
  .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
  .pipe(plugins.eslint.format)
// const lintClientTestScripts = lazypipe()
//   .pipe(plugins.eslint, {
//     configFile: `${clientPath}/.eslintrc`,
//     envs: ['browser', 'es6', 'mocha']
//   })
//   .pipe(plugins.eslint.format)

let lintServerScripts = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format)

let lintServerTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${serverPath}/.eslintrc`,
    envs: ['node', 'es6', 'mocha']
  })
  .pipe(plugins.eslint.format)

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: ['transform-class-properties', 'transform-runtime']
  })
  .pipe(plugins.sourcemaps.write, '.')

let mocha = lazypipe()
  .pipe(plugins.mocha, {
    reporter: 'spec',
    timeout: 5000,
    require: ['./mocha.conf']
  })

let istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: './coverage',
    rootDirectory: ''
  })

/********************
 * Env
 ********************/

gulp.task('env:all', () => {
  let localConfig
  try {
    localConfig = require(`./${serverPath}/config/local.env`)
  } catch (e) {
    localConfig = {}
  }
  plugins.env({
    vars: localConfig
  })
})

gulp.task('env:test', () => {
  plugins.env({
    vars: { NODE_ENV: 'test' }
  })
})
gulp.task('env:prod', () => {
  plugins.env({
    vars: { NODE_ENV: 'production' }
  })
})

/********************
 * Tasks
 ********************/

gulp.task('inject', (cb) => {
  runSequence(['inject:styl'], cb)
})

gulp.task('inject:styl', () =>
  gulp
    .src(paths.client.mainStyle)
    .pipe(
      plugins.inject(
        gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), { read: false }).pipe(plugins.sort()),
        {
          starttag: '/* inject:styl */',
          endtag: '/* endinject */',
          transform: (filepath) => {
            let newPath = filepath
              .replace(`/${clientPath}/app/`, '')
              .replace(`/${clientPath}/components/`, '../components/')
              .replace(/_(.*).styl/, (match, p1) => p1)
              .replace('.styl', '')
            return `@import '${newPath}';`
          }
        }
      )
    )
    .pipe(gulp.dest(`${clientPath}/app`))
)

// function webpackCompile(options, cb) {
//   let compiler = webpack(makeWebpackConfig(options))

//   compiler.run((err, stats) => {
//     if (err) return cb(err)
//     plugins.util.log(
//       stats.toString({
//         colors: true,
//         timings: true,
//         chunks: options.BUILD
//       })
//     )
//     cb()
//   })
// }

gulp.task('webpack:dev', () => {
  const makeWebpackConfig = require('./webpack.make')
  const configs = makeWebpackConfig({ DEV: true })
  const compiler = webpack(configs)
  // const devOptions = {
  //   publicPath: configs.output.publicPath,
  //   contentBase: './client/',
  //   historyApiFallback: true,
  //   host: '0.0.0.0',
  //   disableHostCheck: true,
  //   hot: true,
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  //   },
  //   stats: {
  //     modules: false,
  //     cached: false,
  //     colors: true,
  //     chunk: false,
  //     children: false
  //   }
  // }
  new WebpackDevServer(compiler, {
    publicPath: configs.output.publicPath,
    contentBase: './client/',
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    stats: {
      modules: false,
      cached: false,
      colors: true,
      chunk: false,
      children: false
    },
    quiet: false,
    noInfo: false,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        secure: false
      },
      '/auth': {
        target: 'http://localhost:9000',
        secure: false
      },
      '/primus': {
        target: 'http://localhost:9000',
        secure: false,
        ws: true
      }
    }
  }).listen(appConfig.devServer.port, appConfig.devServer.host, (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log('webpack-dev-server => address:', configs.output.publicPath)
    gutil.log('webpack-dev-server => process: building modules ...')
  })
})

gulp.task('env:dev', (cb) => {
  process.env.NODE_ENV = 'development'
  cb()
})

gulp.task('env:prod', (cb) => {
  process.env.NODE_ENV = 'production'
  cb()
})

// gulp.task('webpack:dist', (cb) => webpackCompile({ BUILD: true }, cb))
// gulp.task('webpack:test', (cb) => webpackCompile({ TEST: true }, cb))

gulp.task('transpile:server', () =>
  gulp
    .src(_.union(paths.server.scripts, paths.server.json))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`))
)

gulp.task('lint:scripts', (cb) => runSequence(['lint:scripts:client', 'lint:scripts:server'], cb))

gulp.task('lint:scripts:client', () =>
  gulp.src(_.union(paths.client.scripts, _.map(paths.client.test, (blob) => `!${blob}`))).pipe(lintClientScripts())
)

gulp.task('lint:scripts:server', () =>
  gulp.src(_.union(paths.server.scripts, _.map(paths.server.test, (blob) => '!' + blob))).pipe(lintServerScripts())
)

gulp.task('lint:scripts:clientTest', () => gulp.src(paths.client.test).pipe(lintClientScripts()))

gulp.task('lint:scripts:serverTest', () => gulp.src(paths.server.test).pipe(lintServerTestScripts()))

gulp.task('jscs', () =>
  gulp.src(_.union(paths.client.scripts, paths.server.scripts))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter())
)

gulp.task('clean:tmp', () => del(['.tmp/**/*'], { dot: true }))

gulp.task('start:client', () =>
  whenServerReady(() => {
    open(`http://localhost:${config.port}`)
    // cb()
  })
)

gulp.task('start:server', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${serverPath}/config/environment`)
  nodemon(`-w ${serverPath} ${serverPath}`).on('log', onServerLog)
})

gulp.task('start:server:prod', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  config = require(`./${paths.dist}/${serverPath}/config/environment`)
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`).on('log', onServerLog)
})

gulp.task('start:server:debug', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'
  config = require(`./${serverPath}/config/environment`)
  // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
  nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`).on('log', onServerLog)
})

gulp.task('watch', () => {
  const testFiles = _.union(paths.client.test, paths.server.test.unit, paths.server.test.integration)
  plugins
    .watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts())
  plugins
    .watch(_.union(paths.server.test.unit, paths.server.test.integration))
    .pipe(plugins.plumber())
    .pipe(lintServerTestScripts())
})

gulp.task('serve', (cb) => {
  runSequence(
    'clean:tmp',
    'lint:scripts',
    'inject',
    'copy:fonts:dev',
    'env:dev',
    ['webpack:dev', 'start:server'],
    'start:client',
    'watch',
    cb
  )
})

gulp.task('serve:debug', (cb) => {
  runSequence(
    ['clean:tmp', 'lint:scripts', 'inject', 'copy:fonts:dev', 'env:dev'],
    'webpack:dev',
    ['start:server:debug', 'start:client'],
    'watch',
    cb
  )
})

gulp.task('serve:dist', (cb) => {
  runSequence('build', 'env:all', 'env:prod', ['start:server:prod', 'start:client'], cb)
})

gulp.task('test', (cb) => runSequence('test:server', 'test:client', cb))

gulp.task('test:server', (cb) => {
  runSequence('env:all', 'env:test', 'mocha:unit', 'mocha:integration', cb)
})

gulp.task('mocha:unit', () => gulp.src(paths.server.test.unit).pipe(mocha()))

gulp.task('mocha:integration', () => gulp.src(paths.server.test.integration).pipe(mocha()))

gulp.task('test:server:coverage', (cb) => {
  runSequence('coverage:pre', 'env:all', 'env:test', 'coverage:unit', 'coverage:integration', cb)
})

gulp.task('coverage:pre', () =>
  gulp
    .src(paths.server.scripts)
    // Covering files
    .pipe(
      plugins.istanbul({
        instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
        includeUntested: true
      })
    )
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire())
)

// Creating the reports after tests ran
gulp.task('coverage:unit', () => gulp
  .src(paths.server.test.unit)
  .pipe(mocha())
  .pipe(istanbul()))

// Creating the reports after tests ran
gulp.task('coverage:integration', () => gulp
  .src(paths.server.test.integration)
  .pipe(mocha())
  .pipe(istanbul()))

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update)

gulp.task('test:e2e', ['webpack:dist', 'env:all', 'env:test', 'start:server', 'webdriver_update'], () => {
  gulp
    .src(paths.client.e2e)
    .pipe(
      protractor({
        configFile: 'protractor.conf.js'
      })
    )
    .on('error', (e) => {
      throw e
    })
    .on('end', () => {
      process.exit()
    })
})

gulp.task('test:client', (done) => {
  new KarmaServer(
    {
      configFile: `${__dirname}/${paths.karma}`,
      singleRun: true
    },
    (err) => {
      done(err)
      process.exit(err)
    }
  ).start()
})

gulp.task('build', (cb) => {
  runSequence(
    ['clean:dist', 'clean:tmp'],
    'inject',
    'transpile:server',
    ['build:images'],
    ['copy:extras', 'copy:assets', 'copy:fonts:dist', 'copy:server', 'webpack:dist'],
    'revReplaceWebpack',
    cb
  )
})

gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true }))

gulp.task('build:images', () =>
  gulp
    .src(paths.client.images)
    .pipe(
      plugins.imagemin([
        plugins.imagemin.optipng({ optimizationLevel: 5 }),
        plugins.imagemin.jpegtran({ progressive: true }),
        plugins.imagemin.gifsicle({ interlaced: true }),
        plugins.imagemin.svgo({ plugins: [{ removeViewBox: false }] })
      ])
    )
    .pipe(plugins.rev())
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
    .pipe(
      plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
        base: `${paths.dist}/${clientPath}/assets`,
        merge: true
      })
    )
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
)

gulp.task('revReplaceWebpack', function() {
  return gulp
    .src('dist/client/app.*.js')
    .pipe(plugins.revReplace({ manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`) }))
    .pipe(gulp.dest('dist/client'))
})

gulp.task('copy:extras', () =>
  gulp
    .src([`${clientPath}/favicon.ico`, `${clientPath}/robots.txt`, `${clientPath}/.htaccess`], { dot: true })
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`))
)

/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */
function flatten() {
  return through2.obj(function(file, enc, next) {
    if (!file.isDirectory()) {
      try {
        let dir = path.dirname(file.relative).split(path.sep)[0]
        let fileName = path.normalize(path.basename(file.path))
        file.path = path.join(file.base, path.join(dir, fileName))
        this.push(file)
      } catch (e) {
        this.emit('error', new Error(e))
      }
    }
    next()
  })
}

gulp.task('copy:fonts:dev', () =>
  gulp
    .src('node_modules/{bootstrap,font-awesome}/fonts/*')
    .pipe(flatten())
    .pipe(gulp.dest(`${clientPath}/assets/fonts`))
)

gulp.task('copy:fonts:dist', () =>
  gulp
    .src('node_modules/{bootstrap,font-awesome}/fonts/*')
    .pipe(flatten())
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`))
)

gulp.task('copy:assets', () =>
  gulp.src([paths.client.assets, '!' + paths.client.images]).pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`))
)

gulp.task('copy:server', () => gulp.src(['package.json'], { cwdbase: true }).pipe(gulp.dest(paths.dist)))

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
  buildcontrol: {
    options: {
      dir: paths.dist,
      commit: true,
      push: true,
      connectCommits: false,
      message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
    },
    heroku: {
      options: {
        remote: 'heroku',
        branch: 'master'
      }
    },
    openshift: {
      options: {
        remote: 'openshift',
        branch: 'master'
      }
    }
  }
})

grunt.loadNpmTasks('grunt-build-control')

gulp.task('buildcontrol:heroku', function(done) {
  grunt.tasks(
    ['buildcontrol:heroku'], //you can add more grunt tasks in this array
    { gruntfile: false }, //don't look for a Gruntfile - there is none. :-)
    function() {
      done()
    }
  )
})
gulp.task('buildcontrol:openshift', function(done) {
  grunt.tasks(
    ['buildcontrol:openshift'], //you can add more grunt tasks in this array
    { gruntfile: false }, //don't look for a Gruntfile - there is none. :-)
    function() {
      done()
    }
  )
})
