const core = require("./core")
const say = core.say
core.inf.on("line", (text)=>{
    core.interpretCmd(core.parseIn(text.trim()))
})
core.inf.resume()
//Resume the terminal so that it can be used.
say("Bit Operations Terminal v0.1")
say("Type \"help\" for a list of commands.")