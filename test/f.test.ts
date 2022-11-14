import {
  getfirsttrkpt,
  reversetime,
  trimISOString,
  xml2json,
  prependsec,
  saveJsontoXml,
  removesec
} from '../f'
//import { assert } from 'assert'
import assert = require('assert');
import { Itrkpt } from '../Itrkpt';

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

      const ret = await xml2json('test\\Evening_Ride.gpx') as any
      assert.strictEqual(ret.gpx.trk[0].trkseg[0].trkpt.length, 3)
      const o = prependsec(ret, 2)
      assert.strictEqual(o.gpx.trk[0].trkseg[0].trkpt.length, 5)
    });

    it('prepend and verify date', async function () {

      const ret = await xml2json('test\\Evening_Ride.gpx') as any
      assert.strictEqual(ret.gpx.trk[0].trkseg[0].trkpt.length, 3)
      const o = prependsec(ret, 2)

      const firstthree = (o.gpx.trk[0].trkseg[0].trkpt.slice(0, 3) as Itrkpt[])
        .map(x => x.time[0])

      const exp =
        [
          '2022-10-19T17:21:33Z',
          '2022-10-19T17:21:34Z',
          '2022-10-19T17:21:35Z'
        ]

      assert.deepStrictEqual(firstthree, exp)
    });

    it('savexml', async function () {

      type t = {
        a: string;
        b: number;
      }

      const o: t = {
        a: 'test',
        b: 55
      }

      const ret = await saveJsontoXml(o, 'test\\test_out.xml')
      assert.strictEqual(ret, 0)

    });

    it('removesec', async function () {

      const ret = await xml2json('test\\Evening_Ride.gpx') as any
      assert.strictEqual(ret.gpx.trk[0].trkseg[0].trkpt.length, 3)
      const o = removesec(ret, 2)
      assert.strictEqual(o.gpx.trk[0].trkseg[0].trkpt.length, 1)
    });

    it('removesec invalid', async function () {

      const ret = await xml2json('test\\Evening_Ride.gpx') as any
      assert.strictEqual(ret.gpx.trk[0].trkseg[0].trkpt.length, 3)
      const o = removesec(ret, -2)
      assert.strictEqual(o.gpx.trk[0].trkseg[0].trkpt.length, 3)
    });

  });
});