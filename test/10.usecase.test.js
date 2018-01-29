'use strict';

const should = require('should');
const builder = require('../lib/builder');
const injected = require('../lib/injected');

describe('Use cases', () => {
  const NODE_ENV = process.env.NODE_ENV;

  const testTable = [
    {
      env: 'test',
      defaults: [undefined, 'lorem', undefined, 'lorem', 'ipsum']
    },
    {
      env: 'development',
      defaults: [undefined, 'lorem', undefined, undefined, 'dolor']
    },
    {
      env: 'staging',
      defaults: [undefined, 'lorem', undefined, undefined, undefined]
    },
    {
      env: 'production',
      defaults: [undefined, 'lorem', undefined, undefined, undefined]
    }
  ];

  describe('defaults', () => {
    for (var i = 0; i < testTable.length; i++) {
      const tt = testTable[i];
      describe(`With default arguments and ${tt.env} env`, () => {
        let defaults;

        before(() => {
          process.env.NODE_ENV = tt.env;
          defaults = builder();
        });

        after(() => {
          process.env.NODE_ENV = NODE_ENV;
        });

        it('should yield nothing with nothing', () => {
          should(defaults()).equal(tt.defaults[0]);
        });

        it('should yield string with string', () => {
          should(defaults('lorem')).equal(tt.defaults[1]);
        });

        it('should yield nothing with empty array', () => {
          should(defaults([])).equal(tt.defaults[2]);
        });

        it('should yield value with an array', () => {
          should(defaults(['lorem'])).equal(tt.defaults[3]);
        });

        it('should yield value with an array', () => {
          should(defaults(['ipsum', 'dolor'])).equal(tt.defaults[4]);
        });
      });
    }
  });

  describe('injected', () => {
    for (var i = 0; i < testTable.length; i++) {
      const tt = testTable[i];
      describe(`The injected with default arguments and ${tt.env} env`, () => {
        let env;

        before(() => {
          process.env.NODE_ENV = tt.env;
          env = injected();
        });

        after(() => {
          process.env.NODE_ENV = NODE_ENV;
        });

        it('should yield nothing with nothing', () => {
          should(env.get('TEST_LOREM').asString()).equal(tt.defaults[0]);
          process.env.TEST_LOREM = 'test_lorem';
          should(env.get('TEST_LOREM').asString()).equal('test_lorem');
          delete process.env.TEST_LOREM;
        });

        it('should yield string with string', () => {
          should(env.get('TEST_LOREM', 'lorem').asString()).equal(tt.defaults[1]);
          process.env.TEST_LOREM = 'test_lorem';
          should(env.get('TEST_LOREM', 'lorem').asString()).equal('test_lorem');
          delete process.env.TEST_LOREM;
        });

        it('should yield nothing with empty array', () => {
          should(env.get('TEST_LOREM', []).asString()).equal(tt.defaults[2]);
          process.env.TEST_LOREM = 'test_lorem';
          should(env.get('TEST_LOREM', []).asString()).equal('test_lorem');
          delete process.env.TEST_LOREM;
        });

        it('should yield value with an array', () => {
          should(env.get('TEST_LOREM', ['lorem']).asString()).equal(tt.defaults[3]);
          process.env.TEST_LOREM = 'test_lorem';
          should(env.get('TEST_LOREM', ['lorem']).asString()).equal('test_lorem');
          delete process.env.TEST_LOREM;
        });

        it('should yield value with an array', () => {
          should(env.get('TEST_LOREM', ['ipsum', 'dolor']).asString()).equal(tt.defaults[4]);
          process.env.TEST_LOREM = 'test_lorem';
          should(env.get('TEST_LOREM', ['ipsum', 'dolor']).asString()).equal('test_lorem');
          delete process.env.TEST_LOREM;
        });
      });
    }
  });
});
