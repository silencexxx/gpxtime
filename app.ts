import { argv } from 'process'
import {
  xml2json,
  prepend,
  saveJsontoXml
} from 'f'

const [inputfile, nSec, outputfile] = argv

console.log('moveit');

const prependCall = (n) => (j) => prepend(j, n)
const saveJsontoXmlCall = (fn) => (data) => saveJsontoXml(data, fn)

xml2json(inputfile)
  .then(prependCall(nSec))
  .then(saveJsontoXmlCall(outputfile))
  .then(() => { console.log('completed!') })
  .catch(console.log)
