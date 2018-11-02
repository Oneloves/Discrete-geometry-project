
attribute vec3 vPosCone;
attribute vec3 vNormal;

uniform float transX;
uniform vec3 lumPos;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;

varying vec3 L;
varying vec3 N;
varying vec3 V;
varying vec3 H;

void main(void) {
	
	vec3 p3d = (uMVMatrix*vec4(vPosCone,1.0)).xyz ;
	V = -p3d;
	vec3 lPos = (uMVMatrix*vec4(lumPos,1.0)).xyz;
	
	N = (uRMatrix*vec4(vNormal,1.0)).xyz;
	L = lPos-p3d;
	H = L+V;
	gl_Position = uPMatrix * uMVMatrix * vec4(vPosCone, 1.0);
}