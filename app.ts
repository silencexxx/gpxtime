import { argv } from 'process'
import {
  xml2json,
  prependsec,
  saveJsontoXml
} from './f'

const [inputfile, nSec, outputfile] = argv.slice(2)

console.log('---moveit---')

const prependCall = (n: number) => (j) => prependsec(j, n)
const saveJsontoXmlCall = (fn: string) => (data) => saveJsontoXml(data, fn)

xml2json(inputfile)
  .then(prependCall(parseInt(nSec)))
  .then(saveJsontoXmlCall(outputfile))
  .then(() => { console.log('completed!') })
  .catch(console.log)
