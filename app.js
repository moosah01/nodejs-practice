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

fs.readdir('./', function(err, files){
    if(err) console.log('Error', err);
    else console.log('Result', files);
});

emitter.on('messageLogged', (arg) => {
    console.log('Listener called for messageLogged', arg);
});

emitter.on('logging', (arg) => {
    console.log('Listener called for logging', arg);
});

emitter.emit('messageLogged', {id: 1, url: 'http://' });
emitter.emit('logging', {data: 'message'}); 