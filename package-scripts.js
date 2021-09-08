// eslint-disable-next-line
const npsUtils = require("nps-utils");

const {
 series, concurrent, rimraf, crossEnv,
} = npsUtils;

module.exports = {
  scripts: {
    test: {
      default: crossEnv('NODE_ENV=test jest --coverage'),
      update: crossEnv('NODE_ENV=test jest --coverage'),
      watch: crossEnv('NODE_ENV=test jest --watch'),
      codeCov: crossEnv(
        'cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js',
      ),
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(
        rimraf('dist'),
        concurrent.nps(
          'compileToes5',
          'build.es',
          'build.cjs',
          'build.umd.main',
          'build.umd.min',
        ),
      ),
      es: {
        description: 'run the build with rollup (uses rollup.config.js)',
        script: 'rollup --config --environment FORMAT:es',
      },
      cjs: {
        description: 'run rollup build with CommonJS format',
        script: 'rollup --config --environment FORMAT:cjs',
      },
      umd: {
        min: {
          description: 'run the rollup build with sourcemaps',
          script: 'rollup --config --sourcemap --environment MINIFY,FORMAT:umd',
        },
        main: {
          description: 'builds the cjs and umd files',
          script: 'rollup --config --sourcemap --environment FORMAT:umd',
        },
      },
      andTest: series.nps('build'),
    },
    copyTypes: series(npsUtils.copy('dist')),
    compileToes5: series(rimraf('lib')),
    lint: {
      description: 'lint the entire project',
      script: 'eslint .',
    },
    validate: {
      description:
        'This runs several scripts to make sure things look good before committing or on clean install',
      default: concurrent.nps('compileToes5', 'lint', 'build.andTest'),
    },
  },
  options: {
    silent: false,
  },
};
