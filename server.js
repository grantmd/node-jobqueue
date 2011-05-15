var config = require('./config').config;

var q = require('./lib/queue');
var queue = new q.Queue();

//
// Start our server listening for requests
//

var http = require('http');
var url = require('url');
http.createServer(function(req, res){
	
	//
	// GET or POST ?
	//
	
	if (req.method == 'POST'){
		req.setEncoding('utf8');
		
		// How much data to read?
		var content_length = req.headers['content-length'];
		
		var payload = ''; // The data that got posted
		req.on('data', function(data){
			payload += data;
			
			// Are we done?
			if (Buffer.byteLength(payload) == content_length){
				
				// Attempt to push on the queue
				try{
					queue.push(payload);
					res.statusCode = 200;
					res.end('ok');
				}
				catch(err){
					res.statusCode = 400;
					res.end(err);
				}
			}
		});
	}
	else{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end("This isn't what you want. You want to POST here.");
	}
	
}).listen(config.listen_port, config.listen_host);

console.log('Server running at http://'+config.listen_host+':'+config.listen_port+'/');

//
// The queue processor
//

queue.on('added', function(data){
	console.log('Added: '+data);
});