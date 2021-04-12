const core = require("./core")
const fs = require("fs")
var fileCont = fs.readFileSync(process.argv[2]).toString()
const say = core.say
const dbg = false
if(dbg)core.setDebug(true)
const debug = core.debug
say("Bit Operations File Reader v0.1")
say("Type [text]=[binary] to set a start variable and reinterpret.")
say("Loaded File.")
var header = fileCont.match(/((.|\n|\s)*)-]/)[1]
var outVar = header.match(/\:(\w+)/)[1]
var sByteMatch = header.match(/^(\w*)=([0-1]*)$/gm)
var startBytes = {}
sByteMatch.forEach((str)=>{
    var match = str.match(/^(\w*)=([0-1]*)$/)
    startBytes[match[1]] = core.stob(match[2])
})
say("Editables:")
Object.keys(startBytes).forEach((key)=>{
    say(`\t${key}\t${core.btos(startBytes[key])}:${startBytes[key]}`)
})
var execCont = fileCont.match(/[^(-\])]-\]([^]*)/)[1].trim()
var lines = execCont.split("\n")
function runFile(){
    core.setBytes(startBytes)
    core.setEcho(false)
    lines.forEach((ln)=>{
        core.interpretCmd(core.parseIn(ln))
    })
    var outputtable = core.getBytes()
    outputtable[core.getName()] = core.getCbyte()
    var output = outputtable[outVar]
    core.setEcho(true)
    say("Result:", `${core.btos(output)}:${output}`)
}
runFile()
function setVariable(ln){
    ln = ln.trim()
    var match = ln.match(/(\w+)\s*=\s*([0-1]+)/)
    if(!match)return
    startBytes[match[1]] = core.stob(match[2])
    runFile()
}
core.inf.on("line", (text)=>{
    setVariable(core.parseIn(text.trim()))
})
core.inf.resume()