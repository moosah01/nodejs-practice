const path = require('path');
const os = require('os');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

var pathObj = path.parse(__filename);

console.log(pathObj);


var totalMemory = os.totalmem();
var freeMemory = os.freemem();

console.log(`Total Memory: ${totalMemory}`);
console.log(`Free Memory: ${freeMemory}`);


const files = fs.readdirSync('./');
console.log(files);

fs.readdir('./', function(err, files){
    if(err) console.log('Error', err);
    else console.log('Result', files);
});

emitter.on('messageLogged', function(){
    console.log('Listener called');
});

emitter.emit('messageLogged');