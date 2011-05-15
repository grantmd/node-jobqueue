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
		
		var content_length = req.headers['content-length'];
		
		var payload = '';
		req.on('data', function(data){
			payload += data;
			
			if (Buffer.byteLength(payload) == content_length){
				console.log('POST full data: '+payload);
				
				queue.push(payload);
				
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end('ok');
			}
		});
		
		req.on('end', function(){
			console.log("FIN\n");
		});
	}
	else{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello World\n');
	}
	
}).listen(config.listen_port, config.listen_host);

console.log('Server running at http://'+config.listen_host+':'+config.listen_port+'/');