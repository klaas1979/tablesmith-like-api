const argv = require('yargs').argv;
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const peggy = require('./gulp-peggy');

/********************/
/*  CONFIGURATION   */
/********************/

const name = path.basename(path.resolve('.'));
const sourceDirectory = './src';
const buildDirectory = './src/module/tablesmith';
const distDirectory = './lib';
const sourceFileExtension = 'ts';
const peggyGrammarExtension = 'pegjs';
const grammarFilePath = 'src/peggy/';

/********************/
/* Peggy Parser Gen */
/********************/

async function peggyCopyDTS() {
  return gulp.src(`${grammarFilePath}*.d.ts`).pipe(gulp.dest(`${buildDirectory}`));
}

async function peggyGen() {
  return gulp
    .src(`${grammarFilePath}*.${peggyGrammarExtension}`)
    .pipe(peggy())
    .pipe(gulp.dest(`${buildDirectory}/parser`));
}

/********************/
/*      BUILD       */
/********************/

/**
 * Watch for changes in grammars
 */
function buildWatchPeggy() {
  gulp.watch(`${sourceDirectory}/**/*.${peggyGrammarExtension}`, { ignoreInitial: false }, peggyGen);
  gulp.watch(`${grammarFilePath}*.d.ts`, { ignoreInitial: false }, peggyCopyDTS);
}

/**
 * Watch for changes for each build step
 */
function buildWatch() {
  buildWatchPeggy();
  gulp.watch(`${sourceDirectory}/**/*.${sourceFileExtension}`, { ignoreInitial: false }, buildCode, compilePacks);
}

/********************/
/*      CLEAN       */
/********************/

/**
 * Remove built files from `lib` folder while ignoring source files
 */
async function clean() {
  const distFiles = [distDirectory];

  console.log(' ', 'Dist files to clean:');
  console.log('   ', distFiles.join('\n    '));

  for (const filePath of distFiles) {
    await fs.remove(`${filePath}`);
  }
}

const execPeggy = gulp.parallel(peggyCopyDTS, peggyGen);

exports.peggy = execPeggy;
exports.build = gulp.series(clean, execPeggy);
exports.watch = buildWatch;
exports.watchpeggy = buildWatchPeggy;
exports.clean = clean;
