import babel from 'gulp-babel';
import sass from 'gulp-sass';
import pug from 'gulp-pug';
import del from 'del';
import { src, dest, watch, parallel, series } from 'gulp';

const dirs = {
  src: 'src',
  dest: 'dest'
};

const paths = {
  sass: {
    src: `${dirs.src}/scss/styles.scss`,
    watchSrc: `${dirs.src}/scss/**/*.scss`,
    dest: `${dirs.dest}/css/`
  },
  js: {
    src: `${dirs.src}/js/main.js`,
    watchSrc: `${dirs.src}/js/**/*.js`,
    dest: `${dirs.dest}/js/`
  },
  pug: {
    src: `${dirs.src}/pug/index.pug`,
    watchSrc: `${dirs.src}/pug/**/*.pug`,
    dest: dirs.dest,
  },
  images: {
    src: `${dirs.src}/images/**.*`,
    dest: `${dirs.dest}/images/`
  },
  fonts: {
    src: `${dirs.src}/fonts/**.*`,
    dest: `${dirs.dest}/fonts/`
  },
};

export const makeSass = (f) => {
  src(paths.sass.src)
    .pipe(sass.sync())
    .pipe(dest(paths.sass.dest));
  f();
};

export const makeJs = (f) => {
  src(paths.js.src)
    .pipe(babel())
    .pipe(dest(paths.js.dest))
  f();
};

export const makePug = (f) => {
  src(paths.pug.src)
    .pipe(pug({pretty: true}))
    .pipe(dest(paths.pug.dest));
  f();
};

export const copyImages = (f) => {
  src(paths.images.src)
    .pipe(dest(paths.images.dest));
  f();
};

export const copyFonts = (f) => {
  src(paths.fonts.src)
    .pipe(dest(`${paths.sass.dest}/fonts`));
  f();
};

export const clean = () => {
  return del(["./dest/"]);
};

export const watcher = (f) => {
  watch(paths.sass.watchSrc, makeSass);
  watch(paths.js.watchSrc, makeJs);
  watch(paths.pug.watchSrc, makePug);
  f();
};

exports.watch = series(parallel(makePug, makeSass, makeJs, copyImages, copyFonts), watcher);
exports.makeJs = series(makeJs);
exports.build = series(clean, parallel(makePug, makeSass, makeJs, copyImages, copyFonts));
