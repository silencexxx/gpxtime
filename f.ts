import {
  readFile,
  writeFile
} from 'fs'

import {
  parseString,
  Builder
} from 'xml2js'

import { Itrkpt } from './Itrkpt'

/**
 * remove the milisec-part of iso-string
 * @param datestring
 */
function trimISOString(datestring: string) {
  const m = datestring.match(/^(.*)\.0*Z$/)
  if (m) {
    return `${m[1]}Z`
  }
  return datestring
}

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

function prepend(jsondata, nsec: number) {
  const firstEl = jsondata.gpx.trk[0].trkseg[0].trkpt[0]
  const firstDate = (' ' + firstEl.time[0]).slice(1) /* clone string */

  const addUs = Array.from(Array(nsec).keys()).map((i) => {
    const newTime = reversetime(firstDate, i + 1)
    const newEl = { ...firstEl } /* new reference to the same objects */
    newEl.time = [newTime]    /* the time refers to a new object */

    return newEl

  }).reverse() /* reverse since the time is in reverse order */

  jsondata.gpx.trk[0].trkseg[0].trkpt = [...addUs, ...jsondata.gpx.trk[0].trkseg[0].trkpt] /* add the new object to the begining */

  return jsondata
}

async function saveJsontoXml(jsondata: any, filename: string): Promise<number> {

  return new Promise<number>((resolve, reject) => {
    const builder = new Builder()
    const xml = builder.buildObject(jsondata)
    writeFile(filename, xml, (err) => {
      if (!err) {
        resolve(0)
      }
      reject(1)
    })
  })
}

export {
  reversetime,
  trimISOString,
  xml2json,
  getfirsttrkpt,
  prepend,
  saveJsontoXml
}

