var sys = require('sys');
var queue = exports;

var Queue = queue.Queue = function(){
	this.queue = [];
};
sys.inherits(Queue, process.EventEmitter);

Queue.prototype.push = function(data){
	// Parse to json and test sanity
	try{
		var obj = JSON.parse(data);
	}
	catch(err){
		throw('Invalid json');
	}
	
	if (obj){
		if (!obj.url){
			throw('Missing url');
		}
		else if (!obj.payload){
			throw('Missing payload');
		}
		else{
			this.queue.push(obj);
	
			this.emit('added', obj);
		}
	}
};