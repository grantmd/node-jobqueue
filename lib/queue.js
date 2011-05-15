var sys = require('sys');
var queue = exports;

var Queue = queue.Queue = function() {
	this.queue = [];
};
sys.inherits(Queue, process.EventEmitter);

Queue.prototype.push = function(data) {
	this.queue.push(data);
	
	this.emit('added', data);
};