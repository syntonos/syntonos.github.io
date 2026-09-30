import * as THREE from 'three';
import { $, $$ } from './dom.js';

// 3D paper plane that follows a smooth winding path through "Selected work".
export function createPlane(state) {
  const work = $('#work'), tp = $('#tp'), trail = $('#trail'), plane = $('#plane');
  let L = 1, Y0 = 0, Y1 = 1;

  const R = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.setSize(150, 150);
  R.shadowMap.enabled = true;
  R.shadowMap.type = THREE.PCFSoftShadowMap;
  plane.appendChild(R.domElement);
  const SC = new THREE.Scene();
  const CAM = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 30);
  CAM.position.set(0, 10, 1.5);
  CAM.lookAt(0, 0, 0);
  SC.add(new THREE.AmbientLight(0xffffff, 0.55));
  const light = new THREE.DirectionalLight(0xfff4e6, 0.75);
  light.position.set(-3, 6, -2);
  light.castShadow = true;
  Object.assign(light.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
  light.shadow.mapSize.set(512, 512);
  light.shadow.radius = 4;
  SC.add(light);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.3 }));
  ground.receiveShadow = true;
  SC.add(ground);
  // Plane geometry: change these points/shades to reshape it.
  const N = [1.5, 0, 0], T = [-0.9, 0, 0], K = [-0.9, -0.22, 0], WL = [-1, 0.08, -0.58], WR = [-1, 0.08, 0.58];
  const shade = [1, 0.7, 0.84, 0.55, 0.63];
  const g = new THREE.BufferGeometry()
    .setAttribute('position', new THREE.Float32BufferAttribute([...N, ...T, ...WL, ...N, ...WR, ...T, ...N, ...K, ...T, ...N, ...WL, ...K, ...N, ...K, ...WR], 3))
    .setAttribute('color', new THREE.Float32BufferAttribute(shade.flatMap((v) => [v, v, v, v, v, v, v, v, v]), 3));
  g.computeVertexNormals();
  const M = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true, side: THREE.DoubleSide }));
  M.castShadow = true;
  M.rotation.order = 'YXZ';
  M.position.y = 1.1;
  SC.add(M);

  const heading = (l) => {
    const a = tp.getPointAtLength(Math.max(0, l)), b = tp.getPointAtLength(Math.min(L, l + 3));
    return Math.atan2(b.y - a.y, b.x - a.x);
  };

  function build() {
    if (!state.isHome) return;
    const w = work.clientWidth, h = work.scrollHeight, cx = w / 2;
    const h2 = $('#wh'), ps = $$('.proj'), en = $('#end');
    if (!ps.length) return;
    const lp = ps[ps.length - 1];
    // start: halfway between SELECTED WORK and the first project
    Y0 = (h2.offsetTop + h2.offsetHeight + ps[0].offsetTop) / 2;
    // end: halfway between the last project and ABOUT ME
    Y1 = (lp.offsetTop + lp.offsetHeight + en.offsetTop - work.offsetTop + $('#end h2').offsetTop) / 2;
    trail.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const NS = Math.max(2, Math.round((Y1 - Y0) / 460));
    const wf = (k) => [1, 0.8, 1.2, 0.9, 1.1][k % 5];
    let tot = 0;
    for (let k = 0; k < NS; k++) tot += wf(k);
    let d = `M${cx} ${Y0}`, y = Y0, s = 1, xa = cx;
    for (let k = 0; k < NS; k++) {
      const sg = ((Y1 - Y0) * wf(k)) / tot;
      const y1 = k == NS - 1 ? Y1 : y + sg;
      const c = sg * [0.5, 0.4, 0.55, 0.45][k % 4];
      const xb = k == NS - 1 ? cx : cx + s * Math.min(w * [0.05, 0.12, 0.03, 0.14, 0.075, 0.1][k % 6], sg * 0.3);
      d += ` C${xa} ${y + c} ${xb} ${y1 - c} ${xb} ${y1}`;
      xa = xb; y = y1; s = -s;
    }
    tp.setAttribute('d', d);
    L = tp.getTotalLength();
  }

  function update() {
    const y = scrollY, vh = innerHeight;
    const r = work.getBoundingClientRect();
    const q = Math.min(1, Math.max(0, (vh * 0.5 - r.top - Y0) / (Y1 - Y0)));
    const l = q * L, pt = tp.getPointAtLength(l);
    plane.style.transform = `translate(${pt.x}px,${pt.y}px)`;
    const h = heading(l);
    const bank = Math.max(-0.6, Math.min(0.6, (heading(l + 40) - h) * 5));
    M.rotation.set(bank, -h, -0.12);
    M.position.y = 1.1 + Math.sin(y / 140) * 0.08;
    R.render(SC, CAM);
  }
  return { build, update };
}
