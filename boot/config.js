
// # config

var path = require('path');
var autoprefixer = require('autoprefixer-core');

var parentDir = path.join(__dirname, '..');
var appDir = path.join(parentDir, 'app');
var angularDir = path.join(parentDir, 'public');

var pkg = require(path.join(parentDir, 'package'));

var assetsDir = path.join(parentDir, 'assets');
var distDir = path.join(parentDir, 'dist');
var publicDir = path.join(assetsDir, 'public');
var templatesDir = path.join(assetsDir, 'emails');
var viewsDir = path.join(appDir, 'views');

var maxAge = 24 * 60 * 60 * 1000;

exports = module.exports = function() {

  var config = {

    defaults: {
      basicAuth: {
        enabled: false,
        name: 'admin',
        pass: 'password'
      },
      facebook: {
        enabled: false,
        appID: '',
        appSecret: '',
        scope: [ 'email' ]
      },
      google: {
        enabled: false,
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ],
        clientID: '',
        clientSecret: ''
      },
      pkg: pkg,
      cache: false,
      showStack: true,
      assetsDir: assetsDir,
      distDir: distDir,
      publicDir: publicDir,
      views: {
        dir: angularDir,
        engine: 'angular'
      },
      password: {
        minStrength: 0,
        limitAttempts: false
      },
      email: {
        templates: {
          dir: templatesDir,
          options: {
          }
        },
        // <https://github.com/andris9/Nodemailer>
        transport: {
          service: 'gmail',
          auth: {
            user: 'hi@eskimo.io',
            pass: 'abc123'
          }
        },
        headers: {
          from: 'hi@eskimo.io'
        }
      },
      hipchat: {
        level: 'error',
        silent: false,
        token: '',
        notify: false,
        color: 'yellow',
        room: '',
        from: '',
        messageFormat: 'text'
      },
      session: {
        secret: 'NWoeDxt(0I6brDD3XlEOgh#a5AY3U18$YS[uRqkt0W52)TIni3r5j@CPu)xipo])RTYI8]vR)Kgc&Po(r&BzEGrpSAoH@38BV4NK0](egEAvmh]ZU%s[@jRsfEsb@31)9B',
        key: 'green-book',
        cookie: {
          maxAge: maxAge
        },
        resave: true,
        saveUninitialized: true
      },
      trustProxy: true,
      updateNotifier: {
        enabled: true,
        dependencies: {},
        updateCheckInterval: 1000 * 60 * 60,
        updateCheckTimeout: 1000 * 20
      },
      staticServer: {
        maxAge: maxAge
      },
      server: {
        host: 'localhost',
        cluster: false,
        ssl: {
          enabled: false,
          options: {}
        }
      },
      cookieParser: 'jbhESqVPDUXhW6ln!yB@siyi3f]yQWPr0rHNy5[XRi%@JbSdifMzZn$sWH)%vEfJIr1op6G$k[2GCxT#g#4AE]pIgPc8nxIYbqgMZ92d45l5*J4nN1[MyEqU84d$@VhLsX',
      csrf: {
        enabled: true,
        options: {
          cookie: {
            maxAge: maxAge
          }
        }
      },
      mongo: {
        host: 'localhost',
        port: 27017,
        opts: {},
        // faster - don't perform 2nd request to verify
        // log message was received/saved
        safe: false
      },
      knex: {
        client: 'mysql'
      },
      redis: {
        host: 'localhost',
        port: 6379,
        maxAge: maxAge
      },
      output: {
        handleExceptions: false,
        colorize: true,
        prettyPrint: false
      },
      logger: {
        'console': true,
        requests: true,
        mongo: false,
        file: false,
        hipchat: false,
        slack: false
      },
      less: {
        enabled: true,
        path: publicDir,
        options: {
          force: true,
          postprocess: {
            css: function(css, req) {
              return autoprefixer.process(css).css;
            }
          }
        }
      },
      jade: {
        amd: {
          path: '/js/tmpl/',
          options: {}
        }
      },
      liveReload: {
        enabled: false,
        port: 35729
      }
    },

    test: {
      url: 'http://localhost:5000',
      server: {
        env: 'test',
        port: 5000
      },
      mongo: {
        dbname: 'green-book_test',
        db: 'green-book_test' // keep for winston logger
      },
      redis: {
        prefix: 'green-book_test',
      },
      logger: {
        'console': false,
        requests: false
      }
    },

    development: {
      cache: true,
      url: 'http://green-book-dev.herokuapp.com',
      server: {
        env: 'development',
        port: 3000,
      },
      mongo: {
        dbname: 'green-book_development',
        db: 'green-book_development' // keep for winston logger
      },
      knex: {
        debug: true,
        connection: {
          host: '127.0.0.1',
          user: 'root',
          password: '',
          database: 'green-book_development'
        }
      },
      redis: {
        prefix: 'green-book_development'
      }
    },

    staging: {
      cache: true,
      url: 'http://green-book-staging.herokuapp.com',
      password: {
        minStrength: 1,
        limitAttempts: true
      },
      views: {
        dir: path.join(assetsDir, 'dist'),
      },
      publicDir: path.join(assetsDir, 'dist'),
      showStack: false,
      updateNotifier: {
        enabled: false,
      },
      server: {
        env: 'staging',
        port: 3080,
        cluster: true
      },
      mongo: {
        dbname: 'green-book_staging',
        db: 'green-book_staging' // keep for winston logger
      },
      knex: {
        connection: {
          host: '127.0.0.1',
          user: 'root',
          password: '',
          database: 'green-book_staging'
        }
      },
      redis: {
        prefix: 'green-book_staging'
      },
      output: {
        colorize: false
      },
      logger: {
        'console': true,
        requests: true,
        mongo: false,
        file: false
        /*
        // <https://github.com/flatiron/winston#file-transport>
        file: {
          filename: '/var/log/igloo.log',
          // TODO: maxsize
          // TODO: maxFiles
          timestamp: true
        }
        */
      }
    },

    production: {
      cache: true,
      url: 'http://green-book.herokuapp.com',
      password: {
        minStrength: 1,
        limitAttempts: true
      },
      views: {
        dir: path.join(distDir, 'views'),
      },
      publicDir: path.join(distDir, 'assets'),
      showStack: false,
      updateNotifier: {
        enabled: false,
      },
      server: {
        env: 'production',
        port: 3080,
        cluster: true
      },
      mongo: {
        dbname: 'green-book_production',
        db: 'green-book_production' // keep for winston logger
      },
      knex: {
        connection: {
          host: '127.0.0.1',
          user: 'root',
          password: '',
          database: 'green-book_production'
        }
      },
      redis: {
        prefix: 'green-book_production'
      },
      output: {
        colorize: false
      },
      logger: {
        'console': true,
        requests: true,
        mongo: false,
        file: false
        /*
        // <https://github.com/flatiron/winston#file-transport>
        file: {
          filename: '/var/log/igloo.log',
          // TODO: maxsize
          // TODO: maxFiles
          timestamp: true
        }
        */
      }
    }

  };

  return config;

};

exports['@singleton'] = true;
