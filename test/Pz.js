'use strict';

const Pz = require('../src/Pz');
const Suites = require('./suites/');

describe("Pz.Pz", function() {
  this.timeout(100);

  const suites = new Suites(Pz);

  describe("infra", suites.infra);

  describe("is PassThrough", suites.isPassThrough);

  describe("#merge()", suites.isMerge);

  describe.only("#split()", suites.isSplit);

  describe("is Box", suites.isBox);

  describe("combinations", function() {
    const expect = require('unexpected');
    const Stream = require('readable-stream');
    const Counter = require('./suites/util/Counter');
    const _ = require('lodash');

    it("merges after splits", function() {
      const pz = Pz.obj();
      const big = pz.split('big', item => item.num > 2 && item.alpha !== 'a').big;
      pz.id = 'pz';
      var counter = Counter();
      var counterBig = Counter();
      ['a', 'b', 'c'].forEach(alpha => {
        const input = new Stream.PassThrough({objectMode: true});
        [1, 2, 3].forEach(num => {
          input.push({alpha: alpha, num: num, id: alpha + num});
        });
        input.pipe(pz);
        input.push(null);
      });
      const promise = Promise.all([
        new Promise(resolve => {
          big
            .pipe(counterBig)
            .on('end', () => {
              expect(counterBig.count, 'to be', 2);
              expect(_.pluck(counterBig.chunks, 'id'), 'to equal', ['b3', 'c3']);
              resolve();
            })
            .resume();
        }),
        new Promise(resolve => {
          pz.pipe(counter)
            .on('end', function() {
              expect(counter.count, 'to be', 7);
              resolve();
            })
            .resume();
        })
      ]);
      return promise;
    });
  });
});
