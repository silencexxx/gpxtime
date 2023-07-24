import { argv } from 'process'
import {
  xml2json,
  prependsec,
  saveJsontoXml,
  removesec
} from './f'

const [inputfile, nSec, outputfile] = argv.slice(2)

console.log('---moveit---')

// const prependCall = (n: number) => (j) => prependsec(j, n)
// const removesecCall = (n: number) => (j) => removesec(j, n)

const callSelector = (n: number) => (j) => n > 0 ? prependsec(j, n) : removesec(j, -1 * n)

const saveJsontoXmlCall = (fn: string) => (data) => saveJsontoXml(data, fn)

xml2json(inputfile)
  .then(callSelector(parseInt(nSec)))
  .then(saveJsontoXmlCall(outputfile))
  .then(() => { console.log(`completed! (${outputfile}) byebye`) })
  .catch(console.log)
