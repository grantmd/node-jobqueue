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

var parsed_endpoint = url.parse(config.queue_endpoint);
var request_options = {
	host: parsed_endpoint['hostname'],
	port: parsed_endpoint['port'],
	path: parsed_endpoint['pathname'] + (parsed_endpoint['search'] ? parsed_endpoint['search'] : ''),
	method: 'POST'
};

var threads = 0;
var processed = 0;
var errors = 0;

queue.on('added', function(added_data){
	if (threads < config.max_threads){
		// We want the oldest on the stack
		var data = queue.shift();

		threads++;
		var req = http.request(request_options, function(res){

			res.on('end', function(){
				if (res.statusCode != 200){
					queue.push(data);
					errors++;
				}

				threads--;
				processed++;
			});
		});

		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
			queue.push(data);
			threads--;

			errors++;
		});

		// write data to request body
		req.write(JSON.stringify(data.payload));
		req.end();
	}
});


//
// Set an interval for stats reporting
//

setInterval(function(){
	console.log('Queue size: '+queue.length()+', threads: '+threads+', processed: '+processed+', errors: '+errors);
}, 10000);