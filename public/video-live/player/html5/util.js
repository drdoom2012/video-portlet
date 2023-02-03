function HoverKeeper(name) {
	this.name = name;
	this.inside = [];
	this.emptyCallback = undefined;
	this.nonEmptyCallback = undefined;
}

HoverKeeper.prototype.enterElement = function(element) {
	var id = $(element).attr('id');
	if (this.inside.indexOf(id) == -1) {
		var originalSize = this.inside.length;
		console.log('hoverKeeper ' + this.name + ': adding ', id);
		this.inside.push(id);
		if ((originalSize == 0) && (this.nonEmptyCallback != undefined)) {
			console.log('hoverKeeper ' + this.name + ' not empty');
			this.nonEmptyCallback.call();
		} 
	}
}

HoverKeeper.prototype.leaveElement = function(element) {
	var id = $(element).attr('id');
	var index = this.inside.indexOf(id);
	if (index != -1) {
		console.log('hoverKeeper ' + this.name + ': removing', id);
		this.inside.splice(index, 1);
		if ((this.inside.length == 0) && (this.emptyCallback != undefined)) {
			console.log('hoverKeeper ' + this.name + ' empty');
			this.emptyCallback.call();
		}
	}
}

HoverKeeper.prototype.isInElement = function() {
	return this.inside.length > 0;
}

function TimerHolder(target) {
	this.target = target;
	this.timeout = undefined;
	this.interval = undefined;
}

TimerHolder.prototype.setTimeout = function(time, thisValue, passArguments) {
	this.cancel();
	var thisTimerHolder = this;
	this.timeout = window.setTimeout(
		function() {
			thisTimerHolder.timeout = undefined;
			thisTimerHolder.target.apply(thisValue, passArguments);
		},
	time);
}

TimerHolder.prototype.setInterval = function(time, thisValue, passArguments) {
	this.cancel();
	var thisTimerHolder = this;
	this.interval = window.setInterval(function() {
		thisTimerHolder.target.apply(thisValue, passArguments);
	}, time);
}

TimerHolder.prototype.cancel = function() {
	if (this.timeout != undefined) {
		console.log('clearing timeout');
		window.clearTimeout(this.timeout);
		this.timeout = undefined;
	}
	if (this.interval != undefined) {
		window.clearTimeout(this.interval);
		this.interval = undefined;
	}
}

TimerHolder.prototype.isScheduled = function() {
	return ((this.timeout != undefined) || (this.interval != undefined));
}

function DraggableControl(element, consumer) {
	this.element = element;
	this.consumer = consumer;
	
	var thisControl = this;
	if (this.supportsTouch) {
		element.addEventListener("touchstart", function(event) {
			thisControl.startDragging(event);
		});
		element.addEventListener('touchmove', DraggableControl.prototype.onMove);
		element.addEventListener('touchend', function(event) {
			console.log('touchend');
			DraggableControl.prototype.stopDragging(event);
		});
		element.addEventListener('touchcancel', function(event) {
			console.log('touchcancel');
			DraggableControl.prototype.stopDragging(event);
		});
	} else {
		element.addEventListener("mousedown", function(event) {
			thisControl.startDragging(event);
		});
	}
}

DraggableControl.initializeGlobal = function() {
	console.log('initializing document listener');
	this.prototype.supportsTouch = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? true : false;
	console.log('supportsTouch:', this.prototype.supportsTouch);
	if (this.prototype.supportsTouch) {
		console.log('will use touch events on elements');
	} else {
		console.log('installing document.mouseup');
		document.addEventListener('mouseup', DraggableControl.prototype.stopDragging, true); // use in capturing phase
		
		document.addEventListener('mousemove', DraggableControl.prototype.onMove, true); // use in capturing phase
	}
}

DraggableControl.prototype.startDragging = function(event) {
	console.log("start dragging", this.supportsTouch);
	DraggableControl.prototype.current = this;

	this.lastPosition = this.extractPosition(event);
	
	this.consumer.startDragging(this, this.element, this.lastPosition);
	
	event.preventDefault();
	event.stopPropagation();
}

DraggableControl.prototype.stopDragging = function(event) {
	var current = DraggableControl.prototype.current;
	if (current != undefined) {
		console.log("stop dragging");
		if (event != undefined) {
			console.log("prevent");
			event.preventDefault();
			event.stopPropagation();
		}
		var position = current.extractPosition(event);
		if ((position.pageX != undefined) && (position.pageY != undefined)) {
			current.lastPosition = position;
		}
		current.consumer.stopDragging(current, current.element, current.lastPosition);
		
		var clickPreventer = function(e) {
			console.log("preventing click after dragging");
			e.stopPropagation();
			document.removeEventListener('click', clickPreventer, true); // do this only once
		};
		document.addEventListener('click', clickPreventer, true);
		window.setTimeout(function() {
			document.removeEventListener('click', clickPreventer, true); // just to be safe
		}, 200);
	}
	DraggableControl.prototype.current = undefined;
}

DraggableControl.prototype.onMove = function(event) {
	if (DraggableControl.prototype.current != undefined) {
		DraggableControl.prototype.current.handleMove(event);
	}
}

DraggableControl.prototype.handleMove = function(event) {
	console.log("dragging");
	event.preventDefault();
	event.stopPropagation();
	event.stopImmediatePropagation();
	this.lastPosition = this.extractPosition(event);
	this.consumer.dragging(this, this.element, this.lastPosition);
}

DraggableControl.prototype.extractPosition = function(event) {
	if (event == undefined) {
		return { pageX: undefined, pageY: undefined };
	} else if ((event.touches != undefined) && (event.touches.length > 0)) {
		return {
			pageX: event.touches[0].pageX,
			pageY: event.touches[0].pageY
		};
	} else {
		return {
			pageX: event.pageX,
			pageY: event.pageY
		}
	}
}
