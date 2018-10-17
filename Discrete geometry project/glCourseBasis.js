
// =====================================================
var gl;
// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
// =====================================================






// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

var Plane3D = { fname:'plane', loaded:-1, shader:null };

// =====================================================
Plane3D.initAll = function()
{

	vertices = [
		-0.7, -0.7, 0.0,
		 0.7, -0.7, 0.0,
		 0.7,  0.7, 0.0,
		-0.7,  0.7, 0.0
	];

	texcoords = [
		0.0,0.0,
		0.0,1.0,
		1.0,1.0,
		1.0,0.0
	];

	this.vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer.itemSize = 3;
	this.vBuffer.numItems = 4;

	this.tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
	this.tBuffer.itemSize = 2;
	this.tBuffer.numItems = 4;

	console.log("Plane3D : init buffers ok.");

	loadShaders(this);

	console.log("Plane3D : shaders loading...");
}


// =====================================================
Plane3D.setShadersParams = function()
{
	console.log("Plane3D : setting shader parameters...")

	gl.useProgram(this.shader);

	this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
	gl.enableVertexAttribArray(this.shader.vAttrib);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
	gl.enableVertexAttribArray(this.shader.tAttrib);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
	gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

	console.log("Plane3D : parameters ok.")

}


// =====================================================
Plane3D.draw = function()
{
	if(this.shader) {		
			this.setShadersParams();
			setMatrixUniforms(this);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
	}
}




// =====================================================
// POINTS 3D
// =====================================================

var Points3D = { fname: 'points', loaded:-1, shader:null };

// =====================================================
Points3D.initAll = function()
{

	vertices = [
		-0.5, -0.1, 0.1,
		-0.2,  0.3, 0.2,
		 0.1,  0.1, 0.3,
		 0.3, -0.2, 0.4
	];

	this.vBuffer2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer2.itemSize = 3;
	this.vBuffer2.numItems = 4;

	console.log("Points3D : init buffers ok.");

	loadShaders(this);

	console.log("Points3D : shaders loading...");
}


// =====================================================
Points3D.setShadersParams = function()
{
	console.log("Points3D : setting shader parameters...")
	gl.useProgram(this.shader);

	this.shader.vAttrib2 = gl.getAttribLocation(this.shader, "vPos");
	gl.enableVertexAttribArray(this.shader.vAttrib2);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer2);
	gl.vertexAttribPointer(this.shader.vAttrib2, this.vBuffer2.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

	console.log("Points3D : parameters ok.")

}

// =====================================================
Points3D.draw = function()
{
	if(this.shader) {		
			this.setShadersParams();
			setMatrixUniforms(this);
			gl.drawArrays(gl.POINTS, 0, this.vBuffer2.numItems);
	}
}







// =====================================================
// SPHERE --> SPHERE
// =====================================================

var Sphere = { fname: 'sphere', loaded:-1, shader:null };

// =====================================================
function sphericalCoordinate(theta, phi) {
	var x = Math.sin(theta) * Math.cos(phi);
	var y = Math.sin(theta) * Math.sin(phi);
	var z = Math.cos(theta);
	
	return [0.4+x/4, 0.2+y/4, 0.3+z/4];
}

// =====================================================
Sphere.initAll = function()
{
	var i, j;
	var nbT = 10;
	var nbP = 2 * nbT;
	var dt = Math.PI / nbT;
	var dp = 2 * Math.PI / nbP;
	
	var vertices = [];
	
	for(i = 0; i < nbT; i++) {
		var th1 = i * dt;
		var th2 = (i + 1) * dt
		
		for(j = 0; j < nbP; j++) {
			var ph1 = j * dp;
			var ph2 = (j+1) * dp;
			
			var p1 = sphericalCoordinate(th1, ph1);
			var p2 = sphericalCoordinate(th1, ph2);
			var p3 = sphericalCoordinate(th2, ph1);
			var p4 = sphericalCoordinate(th2, ph2);
			
			//triangle 1
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p3[0], p3[1], p3[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			
			// triangle 2
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			vertices.push(p2[0], p2[1], p2[2]);
		
		}
	}
	
	this.vBuffer3 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer3);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer3.itemSize = 3;
	this.vBuffer3.numItems = nbT * nbP * 6;

	console.log("Sphere : init buffers ok.");

	loadShaders(this);

	console.log("Sphere : shaders loading...");
}

	
// =====================================================
Sphere.setShadersParams = function()
{
	console.log("Sphere : setting shader parameters...")
	gl.useProgram(this.shader);

	this.shader.vAttrib3 = gl.getAttribLocation(this.shader, "vPosSphere");
	gl.enableVertexAttribArray(this.shader.vAttrib3);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer3);
	gl.vertexAttribPointer(this.shader.vAttrib3, this.vBuffer3.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

	console.log("Sphere : parameters ok.")

}

// =====================================================
Sphere.draw = function()
{
	if(this.shader) {		
			this.setShadersParams();
			setMatrixUniforms(this);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer3.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer3.numItems);
	}
}







// =====================================================
// TOR
// =====================================================

var Tor = { fname: 'tor', loaded:-1, shader:null };

function torusCoordinate(r1, r2, theta, phi) {
	var x = (r1 + r2 * Math.cos(theta)) * Math.cos(phi);
	var y = (r1 + r2 * Math.cos(theta)) * Math.sin(phi);
	var z = r2 * Math.sin(theta);
	
	return [-0.2+x/2, y/2, 0.15+z/2];
}

// =====================================================
Tor.initAll = function()
{
	var i, j;
	var r1 = 0.3;
	var r2 = 0.1;
	var nbT = 100;
	var nbP = 2 * nbT;
	var dt = 2 * Math.PI / nbT;
	var dp = 2 * Math.PI / nbP;
	
	var vertices = [];
	
	for(i = 0; i < nbT; i++) {
		var th1 = i * dt;
		var th2 = (i + 1) * dt;
		
		for(j = 0; j < nbP; j++) {
			var ph1 = j * dp;
			var ph2 = (j+1) * dp;
			
			var p1 = torusCoordinate(r1, r2, th1, ph1);
			var p2 = torusCoordinate(r1, r2, th1, ph2);
			var p3 = torusCoordinate(r1, r2, th2, ph1);
			var p4 = torusCoordinate(r1, r2, th2, ph2);
			
			//triangle 1
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p3[0], p3[1], p3[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			
			// triangle 2
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			vertices.push(p2[0], p2[1], p2[2]);
		
		}
	}
	
	this.vBuffer4 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer4);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer4.itemSize = 3;
	this.vBuffer4.numItems = nbT * nbP * 6;

	console.log("Tor : init buffers ok.");

	loadShaders(this);

	console.log("Tor : shaders loading...");
}

	
// =====================================================
Tor.setShadersParams = function()
{
	console.log("Tor : setting shader parameters...")
	gl.useProgram(this.shader);

	this.shader.vAttrib4 = gl.getAttribLocation(this.shader, "vPosTor");
	gl.enableVertexAttribArray(this.shader.vAttrib4);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer4);
	gl.vertexAttribPointer(this.shader.vAttrib4, this.vBuffer4.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

	console.log("Tor : parameters ok.")

}

// =====================================================
Tor.draw = function()
{
	if(this.shader) {		
			this.setShadersParams();
			setMatrixUniforms(this);
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer4.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer4.numItems);
	}
}





// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================

// =====================================================
function webGLStart() {
	var canvas = document.getElementById("WebGL-test");

	mat4.identity(objMatrix);
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;

	initGL(canvas);

	//Plane3D.initAll();
	//Points3D.initAll();

	tick();
}

// =====================================================
function initGL(canvas)
{
	try {
		
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
	  gl.cullFace(gl.BACK); 

	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}



// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
			if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
			if(Obj3D.loaded==2) {
				Obj3D.loaded ++;
				compileShaders(Obj3D);
				Obj3D.setShadersParams();
				console.log("Shader ok : "+Obj3D.fname+".");
				Obj3D.loaded ++;
			}
    }
  }
  Obj3D.loaded = 0;
  xhttp.open("GET", Obj3D.fname+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	console.log("compiling vshader "+Obj3D.fname);

	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.fname+".vs");
		console.log(Obj3D.vsTxt);
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
		return null;
	}

	console.log("compiling fshader "+Obj3D.fname);

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.fname+".fs");
		return null;
	}

	console.log("linking ("+Obj3D.fname+") shader");

	Obj3D.shader = gl.createProgram();

	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);

	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	console.log("Compilation performed for ("+Obj3D.fname+") shader");

}




// =====================================================
function setMatrixUniforms(Obj3D) {
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
		mat4.multiply(mvMatrix, objMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.mvMatrixUniform, false, mvMatrix);
}


// =====================================================
function shadersOk()
{
	if(Plane3D.loaded == 4 && Points3D.loaded == 4 && Sphere.loaded == 4 && Tor.loaded == 4) return true;

	if(Plane3D.loaded < 0) {
		Plane3D.loaded = 0;
		Plane3D.initAll();
		return false;
	}

	if(Plane3D.loaded == 4 && Points3D.loaded < 0) {
		Points3D.loaded = 0;
		Points3D.initAll();
		return false;
	}

	if(Plane3D.loaded == 4 && Sphere.loaded < 0) {
		Sphere.loaded = 0;
		Sphere.initAll();
		return false;
	}

	if(Plane3D.loaded == 4 && Tor.loaded < 0) {
		Tor.loaded = 0;
		Tor.initAll();
		return false;
	}
	
	return false;

}

// =====================================================
function drawScene() {

	gl.clear(gl.COLOR_BUFFER_BIT);
	if(shadersOk()) {
		Plane3D.draw();
		Points3D.draw();
		Sphere.draw();
		Tor.draw();
	}

}


