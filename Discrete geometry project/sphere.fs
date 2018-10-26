#define M_PI 3.1415926535897932384626433832795
precision mediump float;

varying vec3 N;
varying vec3 L;
varying vec3 V;
varying vec3 H;

void main(void)
{
	float rug = 0.1;	
	//coef spéculaire de cook
	
	vec3 l = normalize(L);
	vec3 n = normalize(N);
	vec3 v = normalize(V);
	vec3 h = normalize(H);

	//beckman
	float c = dot(n,h);
	float tan2 = (1.0-c*c)/(c*c);
	float cos4 = pow(c,4.0);
	float m2 = rug*rug;
	float D = (exp((-tan2)/m2))/(M_PI*m2*cos4);
	
	//coeff G dans cook
	float t1 = (2.0*dot(h,n)*dot(v,n))/dot(v,h);
	float t2 = (2.0*dot(h,n)*dot(l,n))/dot(v,h);
	float G = min(t1,t2);
	G = min(G,1.0);
	
	//terme de fresnel
	float n1=1.0;
	float n2=1.55;
	float r0 = ((n1-n2)/(n1+n2))*((n1-n2)/(n1+n2));
	float costh = dot(n,v);
	
	float F = r0 + (1.0-r0)*pow((1.0-costh),5.0);
	
	//terme bas de cook
	float bas = 4.0*dot(v,n)*dot(n,l);

	//calcul de cook complet
	float ks = (D*F*G)/bas;
	
	ks = clamp(ks,0.0,1.0);

	float kd =0.7;
	float ka =0.2;
	
	float co = kd *clamp(dot(n,l),0.0,1.0)+ ka;
	co += ks;
	vec3 couleur = vec3(1,0,1)*co;
	couleur = clamp(couleur,0.0,1.0);
	
	gl_FragColor = vec4(couleur,1.0);
}



