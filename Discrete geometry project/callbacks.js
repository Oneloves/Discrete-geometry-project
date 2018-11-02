

// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var rotZ = 0;
var rotX = 0;
var transZ = 0;

// =====================================================
window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback,
									/* DOMElement Element */ element)
         {
            window.setTimeout(callback, 1000/60);
         };
})();

// ==========================================
function tick() {
	requestAnimFrame(tick);
	drawScene();
}

// =====================================================
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}

// =====================================================
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

// =====================================================
function handleMouseUp(event) {
	mouseDown = false;
}

function handleEvent(event){
}

// =====================================================
function handleMouseMove(event) {
	
	if (!mouseDown) {
		return;
	}
	
	if(event.buttons == 1) {	
		var newX = event.clientX;
		var newY = event.clientY;

		var deltaX = newX - lastMouseX;
		var deltaY = newY - lastMouseY;

		rotX += degToRad(deltaY / 2);
		rotZ += degToRad(deltaX / 2);

		mat4.identity(objMatrix);
		mat4.rotate(objMatrix, rotX, [1, 0, 0]);
		mat4.rotate(objMatrix, rotZ, [0, 0, 1]);
		mat4.translate(objMatrix,  [0, transZ, transZ], objMatrix);

		lastMouseX = newX
		lastMouseY = newY;
	}
	
	else if(event.buttons == 2) {
	}
	
}

// =====================================================
function handleMouseWheel(event) {
	console.log(event);		
	mat4.translate(objMatrix,  [0, -event.detail/20, -event.detail/20], objMatrix);
		transZ = transZ - event.detail/20;
}
