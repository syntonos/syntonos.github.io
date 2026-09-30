import { $ } from './dom.js';

// Procedural cover sky haze (canvas). Tweak alpha/threshold values to taste.
export function makeClouds(){
 const W=620,H=400,c=$('#cA');c.width=W;c.height=H;const x=c.getContext('2d'),im=x.createImageData(W,H),D=im.data;
 const hs=(a,b)=>{let n=(Math.imul(a,374761393)+Math.imul(b,668265263))|0;n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
 const vn=(a,b)=>{const i=Math.floor(a),j=Math.floor(b),u=a-i,v=b-j,s=u*u*(3-2*u),t=v*v*(3-2*v);return(hs(i,j)*(1-s)+hs(i+1,j)*s)*(1-t)+(hs(i,j+1)*(1-s)+hs(i+1,j+1)*s)*t};
 const fbm=(a,b,o)=>{let s=0,g=.5,f=1;for(let k=0;k<o;k++){s+=g*vn(a*f+k*17.3,b*f+k*5.1);f*=2.03;g*=.5}return s};
 const ss=(a,b,v)=>{v=Math.min(1,Math.max(0,(v-a)/(b-a)));return v*v*(3-2*v)};
 for(let py=0;py<H;py++)for(let px=0;px<W;px++){
  const u=px/W,v=py/H,a=u*.55+3,b=v*3.2+1+u*.25;
  const wx=fbm(a+5.2,b+1.3,3),wy=fbm(a+9.1,b+3.7,3);
  const band=.5+.5*Math.sin(v*11+wx*5+wy*2);
  const d=fbm(a+1.4*wx,b+1.4*wy,5)*.78+band*.22,d2=fbm(a-.03+1.4*wx,b-.12+1.4*wy,5)*.78+band*.22;
  const vb=v+(u-.5)*.07,bank=ss(.06,.12,vb)*(1-ss(.38,.62,vb)),th=.62-.2*fbm(u*1.1+20,v+7,3)+.22*ss(.3,.85,v)-.2*bank;
  let al=ss(th,th+.5,d)*(.1+.12*bank);
  al*=ss(0,.15,Math.min(u,1-u))*ss(0,.1,1-v)*ss(0,.03,v)*(1-.85*ss(.55,.9,v));
  const t=Math.min(1,Math.max(0,.62+(d2-d)*3)),i=(py*W+px)*4,lp=ss(.3,.95,v)*.6;
  let r=222+33*t,g=212+40*t,bl=238+17*t;
  r+=(255-r)*lp;g+=(198-g)*lp;bl+=(216-bl)*lp;
  D[i]=r;D[i+1]=g;D[i+2]=bl;D[i+3]=al*255;
 }
 x.putImageData(im,0,0);
 const B=$('#cB');B.width=W;B.height=H;B.getContext('2d').drawImage(c,0,0);
 c.classList.add('in');B.classList.add('in');
}
