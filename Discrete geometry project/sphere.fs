
precision mediump float;

varying vec3 norm;
varying vec3 dirLum;

void main(void)
{
	float ambiant = 0.1;
	vec3 norm2 = abs(norm);
	vec3 color = vec3(1,0,0);
	
	vec3 dirL = normalize(dirLum);
	vec3 n = normalize(norm);
	
	float lambert = clamp(dot(n,dirL),0.0,1.0);

	lambert+=0.1;
	
	gl_FragColor = vec4(vec3(lambert),1.0);
}



