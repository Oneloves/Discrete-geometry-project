
// =====================================================
var gl;
// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rMatrix = mat4.create();
var objMatrix = mat4.create();
var lumiere = [0,0,5];
// =====================================================


function sub(b,a)
{
	var x = b[0]-a[0];
	var y = b[1]-a[1];
	var z = b[2]-a[2];
	return [x,y,z];
}

function norm(a)
{
	var x= a[0]/lenght(a);
	var y= a[1]/lenght(a);
	var z= a[2]/lenght(a);
	return [x,y,z];
}

function lenght(a)
{
	return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
}


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

	loadShaders(this);
}

// =====================================================
Plane3D.setShadersParams = function()
{
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

	loadShaders(this);
}

// =====================================================
Points3D.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib2 = gl.getAttribLocation(this.shader, "vPos");
	gl.enableVertexAttribArray(this.shader.vAttrib2);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer2);
	gl.vertexAttribPointer(this.shader.vAttrib2, this.vBuffer2.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
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
// SPHERE
// =====================================================

var Sphere = { fname: 'sphere', loaded:-1, shader:null };

// =====================================================
function sphereNormal(xyz, center)
{
	var ab = sub(xyz,center);
	return norm(ab);
}

// =====================================================
function sphericalCoordinate(theta, phi,scale,center) 
{
	var x = Math.sin(theta) * Math.cos(phi);
	var y = Math.sin(theta) * Math.sin(phi);
	var z = Math.cos(theta);
	
	return [x*scale+center[0],y*scale+center[1],z*scale+center[2]];
}

// =====================================================
Sphere.initAll = function()
{
	var center = [0.1,0,0.4];
	var scale =0.25;
	var i, j;
	var nbT = 15;
	var nbP = 2 * nbT;
	var dt = Math.PI / nbT;
	var dp = 2 * Math.PI / nbP;
	
	var vertices = [];
	var normals = [];
	
	for(i = 0; i < nbT; i++) {
		var th1 = i * dt;
		var th2 = (i + 1) * dt
		
		for(j = 0; j < nbP; j++) {
			var ph1 = j * dp;
			var ph2 = (j+1) * dp;
			
			//vertex
			var p1 = sphericalCoordinate(th1, ph1,scale,center);
			var p2 = sphericalCoordinate(th1, ph2,scale,center);			
			var p3 = sphericalCoordinate(th2, ph1,scale,center);			
			var p4 = sphericalCoordinate(th2, ph2,scale,center);
			
			//normals
			var n1 = sphereNormal(p1,center);
			var n2 = sphereNormal(p2,center);
			var n3 = sphereNormal(p3,center);
			var n4 = sphereNormal(p4,center);
			
			//triangle 1
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p3[0], p3[1], p3[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			
			normals.push(n1[0],n1[1],n2[2]);
			normals.push(n3[0],n3[1],n3[2]);
			normals.push(n4[0],n4[1],n4[2]);
			
			// triangle 2
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			vertices.push(p2[0], p2[1], p2[2]);
			
			normals.push(n1[0],n1[1],n2[2]);
			normals.push(n4[0],n4[1],n4[2]);
			normals.push(n2[0],n2[1],n2[2]);
		}
	}
	
	this.vBuffer3 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer3);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer3.itemSize = 3;
	this.vBuffer3.numItems = nbT * nbP * 6;
	
	this.nBuffer3 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer3);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer3.itemSize = 3;
	this.nBuffer3.numItems = nbT * nbP * 6;

	loadShaders(this);
}
	
// =====================================================
Sphere.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib3 = gl.getAttribLocation(this.shader, "vPosSphere");
	gl.enableVertexAttribArray(this.shader.vAttrib3);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer3);
	gl.vertexAttribPointer(this.shader.vAttrib3, this.vBuffer3.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.nAttrib3 = gl.getAttribLocation(this.shader, "vNormal");
	gl.enableVertexAttribArray(this.shader.nAttrib3);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer3);
	gl.vertexAttribPointer(this.shader.nAttrib3, this.nBuffer3.itemSize, gl.FLOAT, false, 0, 0);
	
	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
	this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");	

	var transX = gl.getUniformLocation(this.shader, "transX");
	gl.uniform1f(transX, sliderSphereTranslateX.value/10);
	
	var lum = gl.getUniformLocation(this.shader,"lumPos");
	gl.uniform3f(lum,lumiere[0],lumiere[1],lumiere[2]);
}

// =====================================================
Sphere.draw = function()
{
	if(this.shader) {		
			this.setShadersParams();
			setMatrixUniforms(this);
			gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer3.numItems);
	}
}




// =====================================================
// TOR
// =====================================================

var Tor = { fname: 'tor', loaded:-1, shader:null };

// =====================================================
function torusCoordinate(r1, r2, theta, phi) 
{
	var x = (r1 + r2 * Math.cos(theta)) * Math.cos(phi);
	var y = (r1 + r2 * Math.cos(theta)) * Math.sin(phi);
	var z = r2 * Math.sin(theta);
	
	return [-0.4+x/2, 0.3+y/2, 0.15+z/2];
}

// =====================================================
function torusNormal(vertex, theta, phi, r1, r2) {
	
	var tx = -Math.sin(phi);
	var ty = Math.cos(phi);
	var tz = 0;
	
	var sx = Math.cos(phi) * (-Math.sin(theta));
	var sy = Math.sin(phi) * (-Math.sin(theta));
	var sz = Math.cos(theta);
	
	var nx = ty * sz - tz * sy;
	var ny = tz * sx - tx * sz;
	var nz = tx * sy - ty * sx;
	
	return norm([nx, ny, nz]);
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
	var normals = [];
	
	var vertices = [];
	
	for(i = 0; i < nbT; i++) {
		var th1 = i * dt;
		var th2 = (i + 1) * dt;
		
		for(j = 0; j < nbP; j++) {
			var ph1 = j * dp;
			var ph2 = (j+1) * dp;
			
			//vertex
			var p1 = torusCoordinate(r1, r2, th1, ph1);
			var p2 = torusCoordinate(r1, r2, th1, ph2);
			var p3 = torusCoordinate(r1, r2, th2, ph1);
			var p4 = torusCoordinate(r1, r2, th2, ph2);			
			
			//normals
			var n1 = torusNormal(p1, th1, ph1, r1, r2);
			var n2 = torusNormal(p2, th1, ph2, r1, r2);
			var n3 = torusNormal(p3, th2, ph1, r1, r2);
			var n4 = torusNormal(p4, th2, ph2, r1, r2);			
		
			//triangle 1
			vertices.push(p1[0], p1[1], p1[2]);			 
			vertices.push(p3[0], p3[1], p3[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			
			normals.push(n1[0],n1[1],n2[2]);
			normals.push(n3[0],n3[1],n3[2]);
			normals.push(n4[0],n4[1],n4[2]);
			
			// triangle 2
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p4[0], p4[1], p4[2]);
			vertices.push(p2[0], p2[1], p2[2]);
			
			normals.push(n1[0],n1[1],n2[2]);
			normals.push(n4[0],n4[1],n4[2]);
			normals.push(n2[0],n2[1],n2[2]);
		}
	}
	
	this.vBuffer4 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer4);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer4.itemSize = 3;
	this.vBuffer4.numItems = nbT * nbP * 6;
	
	this.nBuffer4 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer4);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer4.itemSize = 3;
	this.nBuffer4.numItems = nbT * nbP * 6;

	loadShaders(this);
}

// =====================================================
Tor.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib4 = gl.getAttribLocation(this.shader, "vPosTor");
	gl.enableVertexAttribArray(this.shader.vAttrib4);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer4);
	gl.vertexAttribPointer(this.shader.vAttrib4, this.vBuffer4.itemSize, gl.FLOAT, false, 0, 0);
	
	this.shader.nAttrib4 = gl.getAttribLocation(this.shader, "vNormal");
	gl.enableVertexAttribArray(this.shader.nAttrib4);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer4);
	gl.vertexAttribPointer(this.shader.nAttrib4, this.nBuffer4.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
}

// =====================================================
Tor.draw = function()
{
	if(this.shader) {		
		this.setShadersParams();
		setMatrixUniforms(this);
		gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer4.numItems);
		gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer4.numItems);
	}
}




// =====================================================
// Bezier Surface
// =====================================================

var BSurface = { fname: 'bsurface', loaded:-1, shader:null };

// =====================================================
function bezier(k, mu, n)
{
	var k, mu, n;
	var nn,kn,nkn;
	var blend=1;

	nn = n;
	kn = k;
	nkn = n - k;

	while(nn >= 1) {
		blend *= nn;
		nn--;
		
		if(kn > 1) {
			blend /= kn;
			kn--;
		}
		
		if(nkn > 1) {
			blend /= nkn;
			nkn--;
		}
	}
	
	if (k > 0)
		blend *= Math.pow(mu,k);
	if (n-k > 0)
		blend *= Math.pow(1-mu, (n-k));

	return blend;
}

// =====================================================
function sumOfBjPj(controlPoints, bj, ni, nj, i, v)
{
	var j;
	var sumX = 0;
	var sumY = 0;
	var sumZ = 0;
	
	for(j=0; j<nj; j++){
		sumX = bj * controlPoints[i * ni + j][0];
		sumY = bj * controlPoints[i * ni + j][1];
		sumZ = bj * controlPoints[i * ni + j][2];		
	}
	
	return [sumX, sumY, sumZ];
}

// =====================================================
function sumOfBiPi(controlPoints, bi, ni, j, v)
{
	var i;
	var sumX = 0;
	var sumY = 0;
	var sumZ = 0;
	
	for(i=0; i<ni; i++){
		sumX = bi * controlPoints[i * ni + j][0];
		sumY = bi * controlPoints[i * ni + j][1];
		sumZ = bi * controlPoints[i * ni + j][2];		
	}
	
	return [sumX, sumY, sumZ];
}

// =====================================================
function bezierDU(controlPoints, bj, ni, nj, u, v) 
{
	var sum0j = sumOfBjPj(controlPoints, bj, ni, nj, 0, v);
	var sum1j = sumOfBjPj(controlPoints, bj, ni, nj, 1, v);
	var sum2j = sumOfBjPj(controlPoints, bj, ni, nj, 2, v);
	var sum3j = sumOfBjPj(controlPoints, bj, ni, nj, 3, v);
	
	var x = -3*(1-u)*(1-u)*sum0j[0] + 3*(1-u)*(1-u)-6*u*sum1j[0] + 6*u*(1-u)-3*u*u*sum2j[0] + 3*u*u*sum3j[0];
	var y = -3*(1-u)*(1-u)*sum0j[1] + 3*(1-u)*(1-u)-6*u*sum1j[1] + 6*u*(1-u)-3*u*u*sum2j[1] + 3*u*u*sum3j[1];
	var z = -3*(1-u)*(1-u)*sum0j[2] + 3*(1-u)*(1-u)-6*u*sum1j[2] + 6*u*(1-u)-3*u*u*sum2j[2] + 3*u*u*sum3j[2];
	
	return [x, y, z];
}

// =====================================================
function bezierDV(controlPoints, bi, ni, u, v)
{
	var sumi0 = sumOfBiPi(controlPoints, bi, ni, 0, v);
	var sumi1 = sumOfBiPi(controlPoints, bi, ni, 1, v);
	var sumi2 = sumOfBiPi(controlPoints, bi, ni, 2, v);
	var sumi3 = sumOfBiPi(controlPoints, bi, ni, 3, v);
	
	var x = -3*(1-v)*(1-v)*sumi0[0] + 3*(1-v)*(1-v)-6*v*sumi1[0] + 6*v*(1-v)-3*v*v*sumi2[0] + 3*v*v*sumi3[0];
	var y = -3*(1-v)*(1-v)*sumi0[1] + 3*(1-v)*(1-v)-6*v*sumi1[1] + 6*v*(1-v)-3*v*v*sumi2[1] + 3*v*v*sumi3[1];
	var z = -3*(1-v)*(1-v)*sumi0[2] + 3*(1-v)*(1-v)-6*v*sumi1[2] + 6*v*(1-v)-3*v*v*sumi2[2] + 3*v*v*sumi3[2];
	
	return [x, y, z];
}

// =====================================================
function crossProduct(u, v)
{
	var x = u[1] * v[2] - u[2] * v[1];
	var y = u[2] * v[0] - u[0] * v[2];
	var z = u[0] * v[1] - u[1] * v[0];
	
	return [x, y, z];
}
 
// =====================================================
BSurface.initAll = function()
{
	var i, j, ki, kj;
	var u,v,bi,bj;
	var ni = 5;//5;
	var nj = 4;//4;
	var controlPoints = [ni * nj];
	var iResolution = 25 * ni;
	var jResolution = 25 * nj;
	var size = 17;
	var out = [iResolution * jResolution];
	var n = [iResolution * jResolution];
	var normals = [];

	for(i = 0; i <= ni; i++) {
		for(j = 0; j <= nj; j++) {
			var x = i/size;
			var y = (j - 0.5)/size;
			var z = Math.floor((Math.random() * 3) + 1)/size;
			controlPoints[i * ni + j] = [x-0.4, y-0.5, z];
		}
	}
	
	for(i = 0; i < iResolution; i++) {
		u = i / (iResolution-1);
		
		for( j = 0; j < jResolution; j++) {
			v = j / (jResolution-1);
			out[i * iResolution + j] = [0, 0, 0];
			
			for(ki = 0; ki <= ni; ki++) {
				bi = bezier(ki, u, ni);
				for(kj = 0; kj <= nj; kj++) {
					bj = bezier(kj, v, nj);
					out[i * iResolution + j][0] += (controlPoints[ki * ni + kj][0] * bi * bj);
					out[i * iResolution + j][1] += (controlPoints[ki * ni + kj][1] * bi * bj);
					out[i * iResolution + j][2] += (controlPoints[ki * ni + kj][2] * bi * bj);
				}
				
				// Calcul de la normale
				// La formule vient de : https://www.scratchapixel.com/lessons/advanced-rendering/bezier-curve-rendering-utah-teapot/bezier-patch-normal
				if(ki == ni) {
					var dv = bezierDV(controlPoints, bi, ni, u, v);				
					var du = bezierDU(controlPoints, bj, ni, nj, u, v);
					n[i * iResolution + j] = norm(crossProduct(du, dv));
				}
			}
		}
	}
   
	var vertices = [];
	
	for (i=0;i<iResolution-1;i++) {
		for (j=0;j<jResolution-1;j++) {
			var p1 = i * iResolution + j;
			var p2 = (i + 1) * iResolution + j;
			var p3 = i * iResolution + j + 1;
			var p4 = (i + 1) * iResolution + j + 1;
			
			vertices.push(out[p4][0], out[p4][1], out[p4][2]);
			vertices.push(out[p3][0], out[p3][1], out[p3][2]);
			vertices.push(out[p1][0], out[p1][1], out[p1][2]);
			
			vertices.push(out[p2][0], out[p2][1], out[p2][2]);
			vertices.push(out[p4][0], out[p4][1], out[p4][2]);
			vertices.push(out[p1][0], out[p1][1], out[p1][2]);
			
			normals.push(n[p4][0], n[p4][1], n[p4][2]);
			normals.push(n[p3][0], n[p3][1], n[p3][2]);
			normals.push(n[p1][0], n[p1][1], n[p1][2]);

			normals.push(n[p2][0], n[p2][1], n[p2][2]);
			normals.push(n[p4][0], n[p4][1], n[p4][2]);
			normals.push(n[p1][0], n[p1][1], n[p1][2]);
		}
	}
   
	this.vBuffer5 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer5);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer5.itemSize = 3;
	this.vBuffer5.numItems = (iResolution-1) * (jResolution-1) * 6;

	this.nBuffer5 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer5);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer5.itemSize = 3;
	this.nBuffer5.numItems = (iResolution-1) * (jResolution-1) * 6;

	
	loadShaders(this);
}

	
// =====================================================
BSurface.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib5 = gl.getAttribLocation(this.shader, "vPosBSurface");
	gl.enableVertexAttribArray(this.shader.vAttrib5);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer5);
	gl.vertexAttribPointer(this.shader.vAttrib5, this.vBuffer5.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.nAttrib5 = gl.getAttribLocation(this.shader, "vNormal");
	gl.enableVertexAttribArray(this.shader.nAttrib5);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer5);
	gl.vertexAttribPointer(this.shader.nAttrib5, this.nBuffer5.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
}

// =====================================================
BSurface.draw = function()
{
	if(this.shader) {		
		this.setShadersParams();
		setMatrixUniforms(this);
		gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer5.numItems);
	}
}




// =====================================================
// CONE
// =====================================================

var Cone = { fname: 'cone', loaded:-1, shader:null };

// =====================================================
function circleCoordinate(theta, phi, center, scale) {
	var x = Math.cos(theta);
	var y = Math.sin(theta);
	var z = 0;
	
	return [center[0] + scale * x, center[1] + scale * y, scale * center[2] + scale * z];
}

// =====================================================
function coneNormal(vertex, center, h){
	var x = vertex[0] - center[0];
	var y = 0;
	var z = vertex[2] - center[2];
	
	var m = Math.sqrt(x*x + z*z);
	x = x/m;
	y = y/m;
	
	return norm([x*h, 1/h, z*h]);
}

// =====================================================
Cone.initAll = function()
{
	var i;
	var center = [0.0, 0.0, 0.0];
	var scale = 0.2;
	var h = 0.7;
	var top = [0, 0.0, h];
	var nbT = 2000;
	var dt = 2 * Math.PI / nbT;
	
	var vertices = [];
	var normals = [];
	
	var nH = coneNormal(top, center, h);
	var nCenter = coneNormal(center, center, h);
	
	//Cone construct
	for(i = 0; i < nbT; i++) {
		var th1 = i * dt;
		var th2 = (i + 1) * dt;
		
		var p2 = circleCoordinate(th1, 0, center, scale);
		var p3 = circleCoordinate(th2, 0, center, scale);
		
		var n2 = coneNormal(p2, center, h);
		var n3 = coneNormal(p3, center, h);
		
		//triangle 1
		vertices.push(top[0], top[1], top[2]);		
		vertices.push(p2[0], p2[1], p2[2]);		
		vertices.push(p3[0], p3[1], p3[2]);
		
		normals.push(nH[0], nH[1], nH[2]);
		normals.push(n2[0], n2[1], n2[2]);
		normals.push(n3[0], n3[1], n3[2]);
		
		//triangle 2
		vertices.push(center[0], center[1], center[2]);
		vertices.push(p3[0], p3[1], p3[2]);
		vertices.push(p2[0], p2[1], p2[2]);
		
		normals.push(nCenter[0], nCenter[1], nCenter[2]);
		normals.push(n2[0], n2[1], n2[2]);
		normals.push(n3[0], n3[1], n3[2]);
		
	}
	
	this.vBuffer6 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer6);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer6.itemSize = 3;
	this.vBuffer6.numItems = nbT * 6;
		
	this.nBuffer6 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer6);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer6.itemSize = 3;
	this.nBuffer6.numItems = nbT * 6;

	loadShaders(this);
}

	
// =====================================================
Cone.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib6 = gl.getAttribLocation(this.shader, "vPosCone");
	gl.enableVertexAttribArray(this.shader.vAttrib6);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer6);
	gl.vertexAttribPointer(this.shader.vAttrib6, this.vBuffer6.itemSize, gl.FLOAT, false, 0, 0);
	
	this.shader.nAttrib6 = gl.getAttribLocation(this.shader, "vNormal");
	gl.enableVertexAttribArray(this.shader.nAttrib6);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer6);
	gl.vertexAttribPointer(this.shader.nAttrib6, this.nBuffer6.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

}

// =====================================================
Cone.draw = function()
{
	if(this.shader) {		
		this.setShadersParams();
		setMatrixUniforms(this);
		gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer6.numItems);
		gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer6.numItems);
	}
}




// =====================================================
// CYLINDER
// =====================================================

var Cylinder = { fname: 'cylinder', loaded:-1, shader:null };

// =====================================================
function cylinderNormal(vertex, center)
{
	var ab = sub(vertex,center);
	return norm(ab);
}

// =====================================================
Cylinder.initAll = function()
{
	var i, j;
	var scale = 0.2;
	var h = 0.7;
	var downCenter = [0.0, 0.0, 0.0];
	var upCenter = [0.0, 0.0, h]; 
	var nbT = 10;
	var dt = 2 * Math.PI / nbT;
	
	var vertices = [];
	var normals = [];
	
	//Cylinder construct
	for(i = 0; i < nbT; i++) {
		var th1 = i * dt;
		var th2 = (i + 1) * dt;
		
		var ph1 = i * dt;
		var ph2 = (i + 1) * dt;
		
		var p1 = circleCoordinate(th1, 0, downCenter, scale);
		var p2 = circleCoordinate(th2, 0, downCenter, scale);
		
		var p3 = circleCoordinate(ph1, 0, upCenter, scale);
		var p4 = circleCoordinate(ph2, 0, upCenter, scale);
		
		var n1 = cylinderNormal(p1, [0.0, 0.0, 0.35 * scale]);
		var n2 = cylinderNormal(p2, [0.0, 0.0, 0.35 * scale]);
		var n3 = cylinderNormal(p3, [0.0, 0.0, 0.35 * scale]);
		var n4 = cylinderNormal(p4, [0.0, 0.0, 0.35 * scale]);
		
		//triangle 1
		vertices.push(p1[0], p1[1], p1[2]);
		vertices.push(p2[0], p2[1], p2[2]);		
		vertices.push(p3[0], p3[1], p3[2]);	
		
		normals.push(n1[0], n1[1], n1[2]);
		normals.push(n2[0], n2[1], n2[2]);
		normals.push(n3[0], n3[1], n3[2]);
		
		//triangle 2
		vertices.push(p2[0], p2[1], p2[2]);	
		vertices.push(p4[0], p4[1], p4[2]);
		vertices.push(p3[0], p3[1], p3[2]);	
		
		normals.push(n2[0], n2[1], n2[2]);
		normals.push(n4[0], n4[1], n4[2]);
		normals.push(n3[0], n3[1], n3[2]);	
		
		//down base
		vertices.push(p1[0], p1[1], p1[2]);
		vertices.push(downCenter[0], downCenter[1], downCenter[2]);
		vertices.push(p2[0], p2[1], p2[2]);		
		
		normals.push(0, 0, -1);
		normals.push(0, 0, -1);
		normals.push(0, 0, -1);
		
		//up base
		vertices.push(p4[0], p4[1], p4[2]);
		vertices.push(upCenter[0], upCenter[1], upCenter[2] * scale);
		vertices.push(p3[0], p3[1], p3[2]);		
		
		normals.push(0, 0, 1);
		normals.push(0, 0, 1);
		normals.push(0, 0, 1);
	}
	
	this.vBuffer7 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer7);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer7.itemSize = 3;
	this.vBuffer7.numItems = nbT * 12;

	this.nBuffer7 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer7);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer7.itemSize = 3;
	this.nBuffer7.numItems = nbT * 12;

	loadShaders(this);
}

	
// =====================================================
Cylinder.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib7 = gl.getAttribLocation(this.shader, "vPosCylinder");
	gl.enableVertexAttribArray(this.shader.vAttrib7);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer7);
	gl.vertexAttribPointer(this.shader.vAttrib7, this.vBuffer7.itemSize, gl.FLOAT, false, 0, 0);
	
	this.shader.nAttrib7 = gl.getAttribLocation(this.shader, "vNormal");
	gl.enableVertexAttribArray(this.shader.nAttrib7);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer7);
	gl.vertexAttribPointer(this.shader.nAttrib7, this.nBuffer7.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

}

// =====================================================
Cylinder.draw = function()
{
	if(this.shader) {		
			this.setShadersParams();
			setMatrixUniforms(this);
			gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer7.numItems);
	}
}




// =====================================================
// Bézier curve
// =====================================================

var Fur = { fname: 'fur', loaded:-1, shader:null };

// =====================================================
function furNormal(vertex)
{
	return norm(vertex);
}

// =====================================================
Fur.initAll = function()
{
	var nbSegments = 100;
	var i;
	var controlPoints =  [
		[0.0, 0.0, 0.0],
		[0.2, 0.5, 0.0],
		[0.35, 0.52, 0.0],
		[0.47, 0.14, 0.0]
	];
	
	var bezierPoints = [];
	
	for(i=0; i<=nbSegments; i++){
		var t = i / nbSegments;
		
		var k1 = (1 - t) * (1 - t) * (1 - t);
		var k2 = 3 * (1 - t) * (1 - t) * t;
		var k3 = 3 * (1 - t) * t * t;
		var k4 = t * t * t; 
		
		var x = controlPoints[0][0] * k1 + controlPoints[1][0] * k2 + controlPoints[2][0] * k3 + controlPoints[3][0] * k4; 
		var y = controlPoints[0][1] * k1 + controlPoints[1][1] * k2 + controlPoints[2][1] * k3 + controlPoints[3][1] * k4; 
		var z = controlPoints[0][2] * k1 + controlPoints[1][2] * k2 + controlPoints[2][2] * k3 + controlPoints[3][2] * k4;

		bezierPoints.push(x, y, z);	
	}
   
   	var scale = 0.1;
	var nbT = 10;
	var dt = 2 * Math.PI / nbT;
	
	var vertices = [];
	var normals = [];
   
	for(bezierInd=0; bezierInd<nbSegments; bezierInd++) {
		for(i = 0; i < nbT; i++) {
			var th1 = i * dt;
			var th2 = (i + 1) * dt;
			
			var ph1 = i * dt;
			var ph2 = (i + 1) * dt;
			
			var p1 = circleCoordinate(th1, 0, bezierPoints[bezierInd], scale);
			var p2 = circleCoordinate(th2, 0, bezierPoints[bezierInd], scale);
			
			var p3 = circleCoordinate(ph1, 0, bezierPoints[bezierInd+1], scale);
			var p4 = circleCoordinate(ph2, 0, bezierPoints[bezierInd+1], scale);
			
			var n1 = cylinderNormal(p1, [0.0, 0.0, 0.35 * scale]);
			var n2 = cylinderNormal(p2, [0.0, 0.0, 0.35 * scale]);
			var n3 = cylinderNormal(p3, [0.0, 0.0, 0.35 * scale]);
			var n4 = cylinderNormal(p4, [0.0, 0.0, 0.35 * scale]);
			
			//triangle 1
			vertices.push(p1[0], p1[1], p1[2]);
			vertices.push(p2[0], p2[1], p2[2]);		
			vertices.push(p3[0], p3[1], p3[2]);	
			
			normals.push(n1[0], n1[1], n1[2]);
			normals.push(n2[0], n2[1], n2[2]);
			normals.push(n3[0], n3[1], n3[2]);
			
			//triangle 2
			vertices.push(p2[0], p2[1], p2[2]);	
			vertices.push(p4[0], p4[1], p4[2]);
			vertices.push(p3[0], p3[1], p3[2]);	
			
			normals.push(n2[0], n2[1], n2[2]);
			normals.push(n4[0], n4[1], n4[2]);
			normals.push(n3[0], n3[1], n3[2]);	
		}
		
	}
	
	
	this.vBuffer8 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer8);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vBuffer8.itemSize = 3;
	this.vBuffer8.numItems =  nbSegments * nbT * 3;

	this.nBuffer8 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer8);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer8.itemSize = 3;
	this.nBuffer8.numItems =  nbSegments * nbT * 3;

	loadShaders(this);
}

	
// =====================================================
Fur.setShadersParams = function()
{
	gl.useProgram(this.shader);

	this.shader.vAttrib7 = gl.getAttribLocation(this.shader, "vPosFur");
	gl.enableVertexAttribArray(this.shader.vAttrib7);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer8);
	gl.vertexAttribPointer(this.shader.vAttrib7, this.vBuffer8.itemSize, gl.FLOAT, false, 0, 0);
	
	this.shader.nAttrib8 = gl.getAttribLocation(this.shader, "vNormal");
	gl.enableVertexAttribArray(this.shader.nAttrib8);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer8);
	gl.vertexAttribPointer(this.shader.nAttrib8, this.nBuffer8.itemSize, gl.FLOAT, false, 0, 0);

	this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

}

// =====================================================
Fur.draw = function()
{
	if(this.shader) {		
		this.setShadersParams();
		setMatrixUniforms(this);
		gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer8.numItems);
		gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer8.numItems);
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
	}
}

// =====================================================
function loadShaders(Obj3D)
{
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) 
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
			if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
			if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
			if(Obj3D.loaded==2) {
				Obj3D.loaded ++;
				compileShaders(Obj3D);
				Obj3D.setShadersParams();
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
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		return null;
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		return null;
	}

	Obj3D.shader = gl.createProgram();

	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);

	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
	}
}

// =====================================================
function setMatrixUniforms(Obj3D) {
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [0.0, 0.0, -2.0]);
		mat4.multiply(mvMatrix, objMatrix);
		mat4.identity(rMatrix);
		mat4.multiply(rMatrix, objMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.rMatrixUniform, false, rMatrix);
		gl.uniformMatrix4fv(Obj3D.shader.mvMatrixUniform, false, mvMatrix);
}

// =====================================================
function shadersOk()
{
	if(Plane3D.loaded == 4 && Points3D.loaded == 4 && Sphere.loaded == 4 && Tor.loaded == 4 && BSurface.loaded == 4 && Cone.loaded == 4 && Cylinder.loaded == 4 && Fur.loaded == 4) return true;

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
	
	if(Plane3D.loaded == 4 && BSurface.loaded < 0) {
		BSurface.loaded = 0;
		BSurface.initAll();
		return false;
	}
		
	if(Plane3D.loaded == 4 && Cone.loaded < 0) {
		Cone.loaded = 0;
		Cone.initAll();
		return false;
	}
	
	if(Plane3D.loaded == 4 && Cylinder.loaded < 0) {
		Cylinder.loaded = 0;
		Cylinder.initAll();
		return false;
	}
	
	if(Plane3D.loaded == 4 && Fur.loaded < 0) {
		Fur.loaded = 0;
		Fur.initAll();
		return false;
	}
	
	return false;
}

// =====================================================
function drawScene() 
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	if(shadersOk()) {
		Plane3D.draw();
		Points3D.draw();
		Sphere.draw();
		Tor.draw();
		Cone.draw();
		Cylinder.draw();
		BSurface.draw();
		//Fur.draw();
	}
}



