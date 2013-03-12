var express = require("express"),
	async = require("async"),
	redis = require("redis").createClient(),
	pubClient = require("redis").createClient(),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server);

app.use(express.static(__dirname + '/public'));

server.listen(1337);

app.get("/", function(req, res) {
	res.sendfile(__dirname + "/public/index.html");
});

function getQueues(done) {
	getQueueNames(function(err, queues) {
		if(err) return done(err);

		async.map(queues, getQueueDetails, done);
	});
}

function getQueueNames(done) {
	redis.smembers("qminqueues", done);
}

function getQueueDetails(queueName, done) {
	async.parallel([
		function(done) { redis.hgetall("qminmeta." + queueName, done); },
		function(done) { redis.llen("qmin." + queueName, done); }
	], function(err, data) {
		if(err) return done(err);

		var queueInfo = data[0];
		queueInfo.name = queueName;
		queueInfo.count = data[1];
		queueInfo.now = Date.now();
		done(null, queueInfo);
	});
}

io.sockets.on("connection", function(socket) {
	getQueues(function(err, queues) {
		socket.emit("queues", queues);
	});
});

pubClient.on("message", function(event, details) {
	var details = JSON.parse(details);

	getQueueDetails(details.queueName, function(err, queueInfo) {
		queueInfo.event = event;
		io.sockets.emit("queue", queueInfo);
	});
});

pubClient.subscribe("qmin.dequeued", "qmin.enqueued");
