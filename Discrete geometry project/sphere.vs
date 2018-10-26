
attribute vec3 vPosSphere;
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

mat4 translate(float x, float y, float z){
    return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(x,   y,   z,   1.0)
    );
}

void main(void) {
	
	vec3 p3d = (uMVMatrix*vec4(vPosSphere,1.0)).xyz ;
	V = -p3d;
	vec3 lPos = (uMVMatrix*vec4(lumPos,1.0)).xyz;
	
	N = (uRMatrix*vec4(vNormal,1.0)).xyz;
	L = lPos-p3d;
	H = L+V;
	gl_Position = uPMatrix * uMVMatrix * (translate(transX, 0.0, 0.0) * vec4(vPosSphere, 1.0));
}
