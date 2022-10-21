import { readFile } from 'fs'
import { parseString } from 'xml2js'
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
  const firstDate = (' ' + firstEl.time[0]).slice(1)
  const newTime = reversetime(firstDate, 1)
  const newEl = {...firstEl} /* new reference to the same objects */
  newEl.time = [newTime]    /* the time refers to a new object */

  const l: [any] = jsondata.gpx.trk[0].trkseg[0].trkpt
  jsondata.gpx.trk[0].trkseg[0].trkpt = [newEl, ...jsondata.gpx.trk[0].trkseg[0].trkpt]
  return jsondata
}

export {
  reversetime,
  trimISOString,
  xml2json,
  getfirsttrkpt,
  prepend
}

