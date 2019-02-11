let express = require('express')
let app = express()
const port = 3000
var util = require('util')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) {
    let pingMsg = stdout
}

app.get('/ping', function (req, res) {
    var util = require('util')
    var exec = require('child_process').exec
    // getting ip address from ajax data
    var ip = req.query.ip
    function puts(error, stdout, stderr) {
        res.send(stdout)
    }
    // determine the current platform
    // excute proper command based on platform
    exec(`ping -c 1 ${ip} | tail -1| awk '{print $4}' | cut -d '/' -f 2`, puts)
})

app.listen(port, function () {
    //console.log(`Server is running on port: ${port}`)
})