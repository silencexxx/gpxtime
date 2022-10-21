import {
  getfirsttrkpt,
  reversetime,
  trimISOString,
  xml2json,
  prepend
} from '../f'
//import { assert } from 'assert'
import assert = require('assert');

describe('f', function () {
  describe('#reversetime', function () {
    it('1 sec', function () {
      const x = reversetime('2022-10-19T17:21:35Z', 1)
      assert.strictEqual(x, '2022-10-19T17:21:34Z')
    });
    it('2 sec', function () {
      const x = reversetime('2022-10-19T17:21:35Z', 2)
      assert.strictEqual(x, '2022-10-19T17:21:33Z')
    });
    it('60 sec', function () {
      const x = reversetime('2022-10-19T17:21:35Z', 60)
      assert.strictEqual(x, '2022-10-19T17:20:35Z')
    });
  });
  describe('#trim', function () {
    it('3 zeroes', function () {
      const x = trimISOString('2022-10-19T17:21:34.000Z')
      assert.strictEqual(x, '2022-10-19T17:21:34Z')
    });
  });
  describe('#xml', function () {
    it('load xml', async function () {

      try {
        const ret = await xml2json('test\\Evening_Ride.gpx')
        assert.ok('load ok')
      }
      catch (err) {
        assert.fail('expetion is failure')
      }

    });

    it('get first', async function () {

      try {
        const ret = await xml2json('test\\Evening_Ride.gpx')
        const o = getfirsttrkpt(ret)
        assert.strictEqual(o.ele[0], '14.5')
      }
      catch (err) {
        assert.fail('expetion is failure')
      }

    });

    it('prepend', async function () {

      try {
        const ret = await xml2json('test\\Evening_Ride.gpx') as any
        assert.strictEqual(ret.gpx.trk[0].trkseg[0].trkpt.length, 3)
        const o = prepend(ret, 2)
        assert.strictEqual(o.gpx.trk[0].trkseg[0].trkpt.length, 5)
        
      }
      catch (err) {
        assert.fail('expetion is failure')
      }

    });

  });
});