'use strict';

const expect = require('unexpected');

var Suites = require('./suites/');
const Reset = require('../src/Reset');
const Stream = require('readable-stream');

describe("Pz.Reset", function() {

  new Suites(Reset)
    .infra();

  it('PassThrough example', function() {
    var a = new Stream.PassThrough({objectMode: true});
    var b = new Stream.PassThrough({objectMode: true});

    a.write({id: 1});
    a.write({id: 2});
    a.end();

    a.pipe(b).resume();

    return Promise.all([
      new Promise((resolve, reject) => {
        a.on('end', resolve);
      }),
      new Promise((resolve, reject) => {
        a.on('finish', resolve);
      }),
      new Promise((resolve, reject) => {
        // b.resume() needed to get there
        b.on('end', () => resolve());
      }),
      new Promise((resolve, reject) => {
        b.on('finish', resolve);
      })
    ])
  });

  it("wraps another stream", function() {
    var input = new Stream.PassThrough({objectMode: true});
    input.push({id: 1});
    input.push({id: 2});
    input.push(null);

    var streams = [];

    var stream = Reset.obj(function() {
      const newStream = new Stream.PassThrough({
        objectMode: true
      });
      streams.push(newStream);
      return newStream;
    });

    expect(streams.length, 'to be', 1);
    input.pipe(stream).resume();

    return new Promise((resolve, reject) => {
      stream
        .on('end', function() {
          expect(streams.length, 'to be', 2);
          stream.end();
          resolve();
        })
        .on('error', reject);
    });
  });
});
