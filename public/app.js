var socket = io.connect("http://localhost:1337");

function cleanupQueue(queue) {
	queue.lastEnqueued = queue.lastEnqueued || 0;
	queue.lastDequeued = queue.lastDequeued || 0;
	return queue;
}

function createQueueNode(queue) {
	var div = document.createElement("div");
	div.innerHTML = document.getElementById("queueTemplate").innerHTML;

	var $ = function(x){ return div.querySelector(x); };
	$(".queueBlock").setAttribute("data-queue-name", queue.name);
	$(".leftOfQueue .date").innerHTML = queue.lastEnqueued?timeDifference(queue.now, queue.lastEnqueued):"";
	$(".rightOfQueue .date").innerHTML = queue.lastDequeued?timeDifference(queue.now, queue.lastDequeued):"";
	$("h3").innerHTML = queue.name;
	$("h2").innerHTML = formatCount(queue.count);

	return div.childNodes[1];
}

socket.on("queues", function(queues) {
	var frag = document.createDocumentFragment();

	for(var i=0; i<queues.length; i+=2) {
		var row = document.createElement("div");
		row.className = "row-fluid";

		for(var j=0; j<2; j++) {
			if(queues[i+j]) {
				row.appendChild(createQueueNode(queues[i+j]));
			}
		}

		frag.appendChild(row);
	}
	document.getElementById("pageLoading").style.display = "none";
	document.getElementById("queueBlocks").innerHTML = "";
	document.getElementById("queueBlocks").appendChild(frag);
});

if(document.querySelector) {
	socket.on("queue", function(queue) {
		var node = document.querySelector("div[data-queue-name='" + queue.name + "']");

		if(node) {
			var selectorPrefix = "." + ({"qmin.enqueued": "leftOfQueue", "qmin.dequeued": "rightOfQueue"})[queue.event] + " ";
			var arrow = node.querySelector(selectorPrefix + ".arrow");
			if(arrow && arrow.classList) arrow.classList.add("pulse");
			node.querySelector(selectorPrefix + ".date").innerHTML = timeDifference(queue.now, queue[({"qmin.enqueued": "lastEnqueued", "qmin.dequeued": "lastDequeued"})[queue.event]]);
			node.querySelector(".queueLength").innerHTML = formatCount(queue.count);
		} else {
			window.location.reload();
		}
	});

	document.body.addEventListener("webkitAnimationEnd", function(ev) {
		ev.target.classList && ev.target.classList.remove("pulse");
	});
}

function formatCount(count) {
	return "<span style='color: " +
		(count<10?"none":count<20?"#f89406":"#b94a48")
		+ "'>" + count + "</span>";
}

function timeDifference(current, previous) {
	// From: http://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time-eg-2-seconds-ago-one-week-ago-etc-best
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;

	var elapsed = current - previous;

	if (elapsed < msPerMinute) {
		return Math.round(elapsed/1000) + ' seconds ago';   
	}

	else if (elapsed < msPerHour) {
		return Math.round(elapsed/msPerMinute) + ' minutes ago';   
	}

	else if (elapsed < msPerDay ) {
		return Math.round(elapsed/msPerHour ) + ' hours ago';   
	}

	else if (elapsed < msPerMonth) {
		return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
	}

	else if (elapsed < msPerYear) {
		return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
	}

	else {
		return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
	}
}