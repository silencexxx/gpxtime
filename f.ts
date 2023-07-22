/*
edit online
...again
*/

import {
  readFile,
  writeFile
} from 'fs'
/*stuff*/
import {
  parseString,
  Builder
} from 'xml2js'

import { Itrkpt } from './Itrkpt'

import { InvalidSecError} from './InvalidSecError'

/**
 * remove the milisec-part of iso-string
 * @param datestring
 */
function trimISOString(datestring: string) {
  type Z = 'Z'
  const z: Z = 'Z'

  const m = datestring.match(`^(.*)\\.0*${z}$`)
  
  return m ? `${m[1]}${z}` : datestring
}

/**
 * the datestring will not be modified here - but a 
 * new string will be constructed
 * @param datestring
 * @param sec
 */
function reversetime(datestring: string, sec: number) {
  const d = new Date(datestring)
  const milsec = d.getTime()
  const deductMe = sec * 1000 /* millisec */
  const newMilsec = milsec - deductMe
  d.setTime(newMilsec)
  return trimISOString(d.toISOString())
}

async function xml2json(filename: string) {
  return new Promise((resolve, reject) => {
    readFile(filename, (err, data) => {
      if (err) {
        throw new Error('could not read file')
      }

      /* read ok now load xml */

      parseString(data, (err, result) => {
        if (err) {
          throw new Error('xml could not be parsed')
        }

        resolve(result)
      })
    })
  })
}

function getfirsttrkpt(jsondata) {
  
  const b = jsondata.gpx.trk[0].trkseg[0].trkpt[0]
  const ret = b
  return ret
}

function prependsec(jsondata, nsec: number) {

  const firstEl: Itrkpt = jsondata.gpx.trk[0].trkseg[0].trkpt[0] as Itrkpt

  const firstDate: string = firstEl.time[0] /* note that this is a reference to 
                                              * the string - so dont modify this */

  const mp = function* () {
    for (let i of Array(nsec).keys()) {
      /* nsec - i = the number of seconds in
       * reverse order.
       * the _last_ will be "1".
       * so you dont need to reverse the array
       * */

      const newTime: string = reversetime(firstDate, nsec - i)
      const newEl: Itrkpt = { ...firstEl } /* new reference to the same objects */
      newEl.time = [newTime]    /* the time refers to a new object */

      yield newEl
    }
  }

  const addUs = mp()

  jsondata.gpx.trk[0].trkseg[0].trkpt = [...addUs, ...jsondata.gpx.trk[0].trkseg[0].trkpt] /* add the new object to the begining */

  return jsondata
}

async function saveJsontoXml(jsondata: any, filename: string): Promise<number> {

  return new Promise<number>((resolve, reject) => {
    const builder = new Builder()
    const xml = builder.buildObject(jsondata)
    writeFile(filename, xml, (err) => {
      if (err) {
        throw new Error('write file error')
      }
      resolve(0)
    })
  })
}

function assertSecValid(n: number) {
  if (n < 1) {
    throw new InvalidSecError()
  }
}

function removesec(jsondata, nsec: number) {

  try {
    assertSecValid(nsec);
    jsondata.gpx.trk[0].trkseg[0].trkpt = jsondata.gpx.trk[0].trkseg[0].trkpt.slice(nsec) /* remove some blocks */
  }
  catch (err) {
    //console.log(err)
  }

  return jsondata
}

export {
  reversetime,
  trimISOString,
  xml2json,
  getfirsttrkpt,
  prependsec,
  saveJsontoXml,
  removesec
}

