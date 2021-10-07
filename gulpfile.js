////////////////////////////////////////////////////////////////////////////////
// GULP
////////////////////////////////////////////////////////////////////////////////

import gulp from 'gulp'

import autoprefixer from 'gulp-autoprefixer'
import cache from 'gulp-cache'
import debug from 'gulp-debug'
import concat from 'gulp-concat'
import terser from 'gulp-terser'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import gs from 'gulp-sass'
import ss from 'sass'
import bs from 'browser-sync'
import del from 'del'
import favicon from 'favicons'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import { config } from './config.js'

const { task, series, parallel, src, dest, watch } = gulp

////////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC
////////////////////////////////////////////////////////////////////////////////

const instance = bs.create()

const server = () => instance.init({
  host: config.host.local,
  proxy: config.host.local,
  logPrefix: process.env.npm_package_name,
  logLevel: process.env.DEBUG === 'True' ? 'debug' : 'info',
  logConnections: process.env.DEBUG === 'True' ? true : false,
  logFileChanges: process.env.DEBUG === 'True' ? true : false,
  notify: false,
  ghostMode: false,
  reloadDelay: 320,
  injectChanges: false,
  online: false,
  open: true,
  ui: false
})

const reload = (done) => {
  instance.reload()
  done()
}

////////////////////////////////////////////////////////////////////////////////
// CONTENT
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__content = () => del(config.path.root_dist + config.path.content)

// COPY  -------------------------------------------------------------

const copy__content = () => {
  return src(config.path.db + '**/*')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## CONTENT:' })))
    .pipe(dest(config.path.dist + config.path.content))
}

// WATCH -------------------------------------------------------------

const watch__content = () => {
  watch(config.path.db + '**/*', series(content, reload))
}

// COMPOSITION -------------------------------------------------------------

const content = series(clean__content, copy__content)

////////////////////////////////////////////////////////////////////////////////
// VENDOR
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__vendor = () => del(config.vendor.dest + 'vendor.js')

// PROCESS -------------------------------------------------------------

const process__vendor = () => {
  return src(config.vendor.src)
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## VENDOR:' })))
    .pipe(concat('vendor.js'))
    .pipe(gulpif((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'), terser()))
    .pipe(dest(config.vendor.dest))
}

// COMPOSITION -------------------------------------------------------------

const vendor = series(clean__vendor, process__vendor)

////////////////////////////////////////////////////////////////////////////////
// SCRIPT
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__scripts__main = () => del(config.path.dist + config.path.scripts + '{main,main-legacy}.{js,js.map}')
const clean__scripts__panel = () => del(config.path.dist + config.path.scripts + 'panel.{js,js.map}')

// PROCESS -------------------------------------------------------------

const process__scripts__main = () => {
  return src([config.path.src + config.path.resources + 'main.js', config.path.src + config.path.snippets + '**/script.js'], { sourcemaps: true })
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## MAIN:' })))
    .pipe(concat('main.js'))
    .pipe(gulpif(!process.env.NODE_ENV === 'development', terser()))
    .pipe(dest(config.path.dist + config.path.scripts, { sourcemaps: process.env.NODE_ENV === 'development' ? true : '.' }))
}

const process__scripts__panel = () => {
  return src(config.path.src + config.path.resources + 'panel.js', { sourcemaps: true })
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## MAIN:' })))
    .pipe(concat('panel.js'))
    .pipe(gulpif(!process.env.NODE_ENV === 'development', terser()))
    .pipe(dest(config.path.dist + config.path.scripts, { sourcemaps: process.env.NODE_ENV === 'development' ? true : '.' }))
}

// WATCH -------------------------------------------------------------

const watch__scripts = () => {
  watch([config.path.src + config.path.resources + 'main.js', config.path.src + config.path.snippets + '**/script.js'], series(scripts__main, reload))
  watch(config.path.src + config.path.resources + 'panel.js', series(scripts__panel, reload))
}

// COMPOSITION -------------------------------------------------------------

const scripts__main = series(clean__scripts__main, process__scripts__main)
const scripts__panel = series(clean__scripts__panel, process__scripts__panel)

////////////////////////////////////////////////////////////////////////////////
// STYLE
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__styles = () => del(config.path.dist + config.path.styles + '*.{css,css.map}')

// PROCESS -------------------------------------------------------------

const process__styles = () => {
  const scss = gs(ss)
  return src(config.path.src + config.path.resources + '{main,panel}.scss', { sourcemaps: true })
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## STYLE:' })))
    .pipe(scss({ outputStyle: !process.env.NODE_ENV === 'development' ? 'compressed' : 'expanded' }).on('error', scss.logError))
    .pipe(dest(config.path.dist + config.path.styles, { sourcemaps: process.env.NODE_ENV === 'development' ? true : '.' }))
}

// WATCH -------------------------------------------------------------

const watch__styles = () => {
  watch(config.path.src + config.path.snippets + '**/*.scss', series(styles, reload))
  watch(config.path.src + config.path.resources + '**/*.scss', series(styles, reload))
}

// COMPOSITION -------------------------------------------------------------

const styles = series(clean__styles, process__styles)

////////////////////////////////////////////////////////////////////////////////
// SEO
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__robots = () => del(config.path.dist + config.path.public + 'robots.txt')

// COPY -------------------------------------------------------------

const copy__robots = () => {
  return src(config.path.src + config.path.configs + `robots.${process.env.NODE_ENV}`)
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## ROBOTS:' })))
    .pipe(rename('robots.txt'))
    .pipe(dest(config.path.dist + config.path.public))
}

// COMPOSITION -------------------------------------------------------------

const robots = series(clean__robots, copy__robots)

////////////////////////////////////////////////////////////////////////////////
// LOGIC
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__dotenv = () => del(config.path.dist + '.env')
const clean__application = () => del(config.path.dist + config.path.env + 'application.php')
const clean__enviroments = () => del(config.path.dist + config.path.env + config.path.enviroments)
const clean__license = () => del(config.path.dist + config.path.site + config.path.configs + '.license')
const clean__config = () => del(config.path.dist + config.path.site + config.path.configs + 'config.php')
const clean__languages = () => del(config.path.dist + config.path.site + config.path.languages)
const clean__blueprints = () => del(config.path.dist + config.path.site + config.path.blueprints)
const clean__collections = () => del(config.path.dist + config.path.site + config.path.collections)
const clean__controllers = () => del(config.path.dist + config.path.site + config.path.controllers)
const clean__snippets = () => del(config.path.dist + config.path.site + config.path.snippets)
const clean__templates = () => del(config.path.dist + config.path.site + config.path.templates)
const clean__htaccess = () => del(config.path.dist + config.path.public + '.htaccess')
const clean__index = () => del(config.path.dist + config.path.public + 'index.php')

// COPY -------------------------------------------------------------

const copy__dotenv = () => {
  return src(config.path.root + '.env')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## DOTENV:' })))
    .pipe(dest(config.path.dist))
}

const copy__license = () => {
  return src(config.path.secure + config.path.license + `.license.${process.env.NODE_ENV}`)
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## LICENSE:' })))
    .pipe(rename('.license'))
    .pipe(dest(config.path.dist + config.path.site + config.path.configs))
}

const copy__enviroments = () => {
  return src(config.path.root + config.path.env + config.path.enviroments + `${process.env.NODE_ENV}.php`)
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## ENVIROMENTS:' })))
    .pipe(dest(config.path.dist + config.path.env + config.path.enviroments))
}

const copy__application = () => {
  return src(config.path.root + config.path.env + 'application.php')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## APPLICATION:' })))
    .pipe(dest(config.path.dist + config.path.env))
}

const copy__config = () => {
  return src(config.path.src + config.path.configs + 'config.php')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## CONFIG:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.configs))
}

const copy__languages = () => {
  return src(config.path.src + config.path.languages + '**/*.php')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## LANGUAGES:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.languages))
}

const copy__blueprints = () => {
  return src(config.path.src + config.path.blueprints + '**/*.yml')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## BLUEPRINTS:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.blueprints))
}

const copy__collections = () => {
  return src(config.path.src + config.path.collections + '**/*')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## COLLECTIONS:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.collections))
}

const copy__controllers = () => {
  return src(config.path.src + config.path.controllers + '**/*')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## CONTROLLERS:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.controllers))
}

const copy__snippets = () => {
  return src(config.path.src + config.path.snippets + '**/*.php')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## SNIPPETS:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.snippets))
}

const copy__templates = () => {
  return src(config.path.src + config.path.templates + '**/*.php')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## TEMPLATES:' })))
    .pipe(dest(config.path.dist + config.path.site + config.path.templates))
}

const copy__htaccess = () => {
  return src(config.path.src + '.htaccess')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## HTACCESS:' })))
    .pipe(dest(config.path.dist + config.path.public))
}

const copy__index = () => {
  return src(config.path.src + 'index.php')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## INDEX:' })))
    .pipe(dest(config.path.dist + config.path.public))
}

// WATCH -------------------------------------------------------------

const watch__logic = () => {
  watch(config.path.root + '.env', series(dotenv, reload))
  watch(config.path.root + config.path.env + 'application.php', series(application, reload))
  watch(config.path.root + config.path.env + config.path.enviroments + '*.php', series(enviroments, reload))
  watch(config.path.src + config.path.configs + '.license.development', series(license, reload))
  watch(config.path.src + config.path.configs + 'config.php', series(configs, reload))
  watch(config.path.src + config.path.languages + '**/*.php', series(languages, reload))
  watch(config.path.src + config.path.blueprints + '**/*.yml', series(blueprints, reload))
  watch(config.path.src + config.path.collections + '**/*.php', series(collections, reload))
  watch(config.path.src + config.path.controllers + '**/*.php', series(controllers, reload))
  watch(config.path.src + config.path.snippets + '**/*.php', series(snippets, reload))
  watch(config.path.src + config.path.templates + '**/*.php', series(templates, reload))
  watch(config.path.src + '.htaccess', series(htaccess, reload))
  watch(config.path.src + 'index.php', series(index, reload))
}

// COMPOSITION -------------------------------------------------------------

const dotenv = series(clean__dotenv, copy__dotenv)
const license = series(clean__license, copy__license)
const application = series(clean__application, copy__application)
const enviroments = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') ? series(clean__enviroments, copy__enviroments) : series(clean__enviroments)
const configs = series(clean__config, copy__config)
const languages = series(clean__languages, copy__languages)
const blueprints = series(clean__blueprints, copy__blueprints)
const collections = series(clean__collections, copy__collections)
const controllers = series(clean__controllers, copy__controllers)
const snippets = series(clean__snippets, copy__snippets)
const templates = series(clean__templates, copy__templates)
const htaccess = series(clean__htaccess, copy__htaccess)
const index = series(clean__index, copy__index)

////////////////////////////////////////////////////////////////////////////////
// ASSETS
////////////////////////////////////////////////////////////////////////////////

// CLEAN -------------------------------------------------------------

const clean__images = () => del(config.path.dist + config.path.public + config.path.assets + config.path.images)
const clean__icons = () => del(config.path.dist + config.path.public + config.path.assets + config.path.icons)
const clean__favicons = () => del(config.path.dist + config.path.public + config.path.assets + config.path.favicons)
const clean__fonts = () => del(config.path.dist + config.path.public + config.path.assets + config.path.fonts)

// PROCESS -------------------------------------------------------------

const process__images = () => {
  return src(config.path.src + config.path.resources + config.path.assets + config.path.images + '**/*.{png,jpg,jpeg,gif}')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## IMAGES:' })))
    .pipe(cache(imagemin([
      gifsicle({ interlaced: true }),
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 7 })
    ])))
    .pipe(dest(config.path.dist + config.path.public + config.path.assets + config.path.images))
}

const process__icons = () => {
  return src(config.path.src + config.path.resources + config.path.assets + config.path.icons + '**/*.svg')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## ICONS:' })))
    .pipe(cache(imagemin([
      svgo({
        plugins: [
          { removeTitle: true },
          { removeViewBox: false },
          { cleanupIDs: true },
          { removeXMLNS: false }
        ],
        verbose: process.env.DEBUG === 'True' ? true : false
      })
    ])))
    .pipe(dest(config.path.dist + config.path.public + config.path.assets + config.path.icons))
}

const process__favicons = () => {
  return src(config.path.src + config.path.resources + config.path.assets + config.path.favicons + 'favicon_src.png')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## FAVICON:' })))
    .pipe(favicon.stream({
      path: '/' + config.path.assets + config.path.favicons,
      appName: 'Glas & Gebäudereinigung - Uwe Schramm',
      appShortName: 'Schramm Reinigung',
      appDescription: 'Company Website',
      url: config.host.live,
      version: process.env.npm_package_version,
      developerName: 'Uwe Schramm',
      developerURL: config.host.live,
      lang: 'de-DE',
      display: 'browser',
      orientation: 'any',
      appleStatusBarStyle: 'black-translucent',
      background: 'rgba(0,0,0,0)',
      theme_color: 'rgba(0,0,0,0)',
      pixel_art: false,
      scope: '/',
      html: 'all.html',
      start_url: '/index.php',
      logging: true,
      pipeHTML: true,
      replace: true,
      icons: {
        android: process.env.NODE_ENV === 'development' ? true : true,
        appleIcon: process.env.NODE_ENV === 'development' ? false : true,
        appleStartup: process.env.NODE_ENV === 'development' ? false : true,
        coast: process.env.NODE_ENV === 'development' ? false : true,
        favicons: true,
        firefox: process.env.NODE_ENV === 'development' ? false : true,
        windows: process.env.NODE_ENV === 'development' ? false : true,
        yandex: process.env.NODE_ENV === 'development' ? false : true
      }
    }))
    .pipe(dest(config.path.dist + config.path.public + config.path.assets + config.path.favicons))
}

const copy__fonts = () => {
  return src(config.path.src + config.path.resources + config.path.assets + config.path.fonts + '**/*.{woff,woff2}')
    .pipe(gulpif(process.env.DEBUG === 'True', debug({ title: '## FONTS:' })))
    .pipe(dest(config.path.dist + config.path.public + config.path.assets + config.path.fonts))
}

// WATCH -------------------------------------------------------------

const watch__assets = () => {
  watch(config.path.src + config.path.resources + config.path.assets + config.path.fonts + '**/*.{woff,woff2}', series(fonts, reload))
  watch(config.path.src + config.path.resources + config.path.assets + config.path.images + '**/*.{png,jpg,jpeg,gif}', series(images, reload))
  watch(config.path.src + config.path.resources + config.path.assets + config.path.icons + '**/*.svg', series(icons, reload))
  watch(config.path.src + config.path.resources + config.path.assets + config.path.favicons + 'favicon_src.png', series(favicons, reload))
}

// COMPOSITION -------------------------------------------------------------

const fonts = series(clean__fonts, copy__fonts)
const images = series(clean__images, process__images)
const icons = series(clean__icons, process__icons)
const favicons = series(clean__favicons, process__favicons)

////////////////////////////////////////////////////////////////////////////////
// COMPOSITION
////////////////////////////////////////////////////////////////////////////////

const WATCH = series(server, parallel(watch__logic, watch__assets, watch__styles, watch__scripts, watch__content))
const DATA = series(content)
const LOGIC = parallel(dotenv, application, enviroments, htaccess, configs, languages, blueprints, collections, controllers, snippets, templates, license, index, vendor)
const STYLE = parallel(styles, scripts__main, scripts__panel)
const ASSET = series(fonts, images, icons, favicons)
const SEO = series(robots)
const RUN = series(DATA, LOGIC, STYLE, ASSET, process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' ? SEO : WATCH)

export default RUN

////////////////////////////////////////////////////////////////////////////////
// HELPER
////////////////////////////////////////////////////////////////////////////////

task('clear', () => cache.clearAll())
