var source = new EventSource("stream");

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
	$(".leftOfQueue .date").setAttribute("data-lastActivity", queue.lastEnqueued);
	$(".rightOfQueue .date").innerHTML = queue.lastDequeued?timeDifference(queue.now, queue.lastDequeued):"";
	$(".rightOfQueue .date").setAttribute("data-lastActivity", queue.lastDequeued);
	$("h3").innerHTML = queue.name;
	$("h2").innerHTML = formatCount(queue.count);

	return div.childNodes[1];
}

source.addEventListener("queues", function(evt) {
	var queues = JSON.parse(evt.data);

	var frag = document.createDocumentFragment();

	var frag = queues.reduce(function(frag, queue) {
		frag.appendChild(createQueueNode(queue));
		return frag;
	}, document.createDocumentFragment());

	document.getElementById("pageLoading").style.display = "none";
	document.getElementById("queueBlocks").innerHTML = "";
	document.getElementById("queueBlocks").appendChild(frag);
}, false);

if(document.querySelector) {
	source.addEventListener("update", function(evt) {
		var queues = JSON.parse(evt.data);

		queues.forEach(function(queueItem) {
			var node = document.querySelector("div[data-queue-name='" + queueItem.name + "']");

			if(node) {
				var $ = function(x) { return node.querySelector(x); };

				if($(".leftOfQueue .date").getAttribute("data-lastActivity") != queueItem.lastEnqueued) {
					$(".leftOfQueue .arrow").classList.add("pulse");
					$(".leftOfQueue .date").innerHTML = timeDifference(queueItem.now, queueItem.lastEnqueued);
					$(".leftOfQueue .date").setAttribute("data-lastActivity", queueItem.lastEnqueued);
				}

				if($(".rightOfQueue .date").getAttribute("data-lastActivity") != queueItem.lastDequeued) {
					$(".rightOfQueue .arrow").classList.add("pulse");
					$(".rightOfQueue .date").innerHTML = timeDifference(queueItem.now, queueItem.lastDequeued);
					$(".rightOfQueue .date").setAttribute("data-lastActivity", queueItem.lastDequeued);
				}

				$(".queueLength").innerHTML = formatCount(queueItem.count);
			} else {
				window.location.reload();
			}
		});
	}, false);

	document.body.addEventListener("webkitAnimationEnd", function(ev) {
		ev.target.classList && ev.target.classList.remove("pulse");
	});
}

function formatCount(count) {
	return "<span style='color: " +
		(count<50?"#468847":count<150?"#f89406":"#b94a48")
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