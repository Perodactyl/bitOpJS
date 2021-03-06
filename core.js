var inf = require("readline").createInterface(process.stdin, process.stdout)
inf.pause()
var dbg = false
var bytes = {}
var activeByte = "default"
var cbyte = 0
var echo = true
const say = console.log
const byteMask = 0xff
const help = `! NOT the current data
&[bin]   AND the current data
|[bin]  OR the current data
[bin]   Outputs binary and integer data inputted
!&[bin] NAND the current data
!|[bin]  NOR the current data
=[bin]  sets the current data
bin([num])  equivalent to the binary data of the inputted number
val equivalent to the current binary data.
!D  Toggles the debug flag.
clear   Clears the screen.
cls Alias of clear`
function debug(...text){
    if(!dbg)return
    say.apply(this, text)
}
function stob(str){
    var outByte = 0
    str.split("").forEach((bit)=>{
        debug(bit)
        outByte = outByte<<1
        if(bit == "1"){
            debug("|1")
            outByte = outByte | 1
        }
    })
    return outByte
}
function btos(num){
    var outStr = ""
    const testByte = 1
    for(let cbit = 0; cbit < 8; cbit++){
        if(num&testByte == testByte)outStr = "1"+outStr
        else outStr = "0"+outStr
        num = num>>1
    }
    return outStr
}
function btot(num){
    return String.fromCharCode(num)
}
function interpretCmd(cmd){
    if(cmd == "help"){
        say(help)
        return
    }
    if(cmd == "cls" || cmd == "clear"){
        console.clear()
        return
    }
    var matchCases = {
        not:cmd.match(/\!\s*/),
        or:cmd.match(/\!?\|\s*(.*)/),
        and:cmd.match(/\!?\&\s*(.*)/),
        eq:cmd.match(/\!?\=\s*(.*)/),
        echo:cmd.match(/^\s*([0-1]+)\s*$/),
        nop:cmd.match(/^\s*\!(.)\s*([0-1]+)\s*$/),
        var:cmd.match(/^\s*var\s+(\w+)(\s+([0-1]+))?\s*$/),
        dbg:cmd.match(/\!D/)
    }
    if(matchCases.dbg){
        dbg = !dbg
        say(`Debug flag set to:${dbg}`)
        return
    }
    var mc = null
    var nopFlag = false
    if(matchCases.echo){
        mc = matchCases.echo
        if(echo)say(`${mc[1]}:${stob(mc[1])}`)
        return
    }
    if(matchCases.nop){
        nopFlag = true
    }
    if(matchCases.not && !nopFlag){
        mc = matchCases.not
        cbyte = ~cbyte
    }else if(matchCases.or){
        mc = matchCases.or
        cbyte = cbyte|stob(mc[1])
    }else if(matchCases.and){
        mc = matchCases.and
        cbyte = cbyte&stob(mc[1])
    }else if(matchCases.eq){
        mc = matchCases.eq
        cbyte = stob(mc[1])
    }else if(matchCases.var){
        mc = matchCases.var
        bytes[activeByte] = cbyte
        activeByte = mc[1]
        if(typeof bytes[mc[1]] == "undefined"){
            bytes[mc[1]] = stob(mc[3])
        }
        cbyte = bytes[mc[1]]
    }
    if(nopFlag){
        cbyte = ~cbyte
    }
    if(mc == null){
        if(echo)say("Operation not recognized.")
        return
    }
    cbyte = cbyte & byteMask
    if(echo)say(`${btos(cbyte)}:${cbyte}`)
}
function parseIn(text){
    text = text.replace(/(.*)bin\(([0-9]+)\)/g, (s, bc, g1)=>{debug(s, bc, g1); return bc+btos(parseInt(g1.trim()))})
    text = text.replace(/(.*)val/g, (s, bc)=>{return bc+btos(cbyte)})
    text = text.replace(/%(\w+)%/g, (s, g1)=>{return btos(bytes[g1])})
    debug(text)
    return text.trim()
}
module.exports = {
    parseIn:parseIn,
    interpretCmd:interpretCmd,
    inf:inf,
    say:say,
    getCbyte:()=>{return cbyte},
    setCbyte:(val)=>{cbyte = val},
    getBytes:()=>{return bytes},
    setBytes:(val)=>{bytes = val},
    setBytesKey:(key, val)=>{bytes[key] = val},
    getName:()=>{return activeByte},
    setName:(val)=>{activeByte = val},
    debug:debug,
    setDebug:(val)=>{dbg = val},
    btos:btos,
    stob:stob,
    setEcho:(val)=>{echo = val}
}
say("BitOp succesfully loaded.")