var express = require("express"),
	async = require("async"),
	redis = require("redis").createClient(),
	pubClient = require("redis").createClient(),
	app = express(),
	server = require("http").createServer(app);

app.use(express.static(__dirname + '/public'));
server.listen(1337);

var connectedClients = [];

app.get("/", function(req, res) {
	res.sendfile(__dirname + "/public/index.html");
});

app.get("/stream", function(req, res, next) {
	connectedClients.push(res);

	res.writeHead(200, {
		"content-type": "text/event-stream"
	})

	getQueues(function(err, queues) {
		if(err) return next(err);

		res.write("event: queues\ndata: " + JSON.stringify(queues) + "\n\n");
	});
});

function getQueues(done) {
	getQueueNames(function(err, queues) {
		if(err) return done(err);

		async.map(queues, getQueueDetails, done);
	});
}

function getQueueNames(done) {
	redis.smembers("cuminqueues", done);
}

function getQueueDetails(queueName, done) {
	async.parallel([
		function(done) { redis.hgetall("cuminmeta." + queueName, done); },
		function(done) { redis.llen("cumin." + queueName, done); }
	], function(err, data) {
		if(err) return done(err);

		var queueInfo = data[0];
		queueInfo.name = queueName;
		queueInfo.count = data[1];
		queueInfo.now = Date.now();
		done(null, queueInfo);
	});
}

pubClient.on("message", function(event, details) {
	var details = JSON.parse(details);

	getQueueDetails(details.queueName, function(err, queueInfo) {
		queueInfo.event = event;
		
		var queueInfoStringified = JSON.stringify(queueInfo);
		connectedClients.forEach(function(client) {
			client.write("event: queue\ndata: " + queueInfoStringified + "\n\n");
		});
	});
});

pubClient.subscribe("cumin.dequeued", "cumin.enqueued");
