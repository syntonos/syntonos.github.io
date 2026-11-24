/**
 * A 3D model you can spin: used for a { model: 'board.glb' } slide in a project's gallery.
 * Drag to rotate, scroll or pinch to zoom a little. It turns slowly by itself until you touch it.
 * Supports .glb / .gltf (keeps the model's own colors) and .stl (shown in a soft lavender-white).
 *
 * This file is loaded only when a model slide is first shown (a separate chunk), so it adds nothing to the
 * pages that have no models.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const STL_COLOR = 0xb9b0ea; // a soft lavender, deep enough to show against the off-white page

/** Puts a 3D viewer inside `el` (a .slide element with data-src = the model file). Returns { start, stop }. */
export function mountModel(el) {
  const status = el.querySelector('.model-status');
  const say = (text) => status && ((status.textContent = text), (status.style.display = text ? '' : 'none'));

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    say('This 3D view needs WebGL, which is not available in this browser.');
    return { start() {}, stop() {} };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8b0ff, 0.9));
  const key = new THREE.DirectionalLight(0xfff4e6, 0.8);
  key.position.set(3, 5, 4);
  scene.add(key);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotateSpeed = 1.6;
  controls.addEventListener('start', () => (controls.autoRotate = false)); // once you touch it, it stays where you put it

  const resize = () => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(el);
  resize();

  /** Centers the model, scales it to a standard size and points the camera at it. */
  function frame(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2 / Math.max(size.x, size.y, size.z || 1);
    object.scale.setScalar(scale);
    object.position.sub(center.multiplyScalar(scale));
    scene.add(object);
    camera.position.set(2.4, 1.6, 3.2);
    controls.minDistance = 2;
    controls.maxDistance = 9;
    controls.target.set(0, 0, 0);
    controls.update();
    say('');
  }

  const url = el.dataset.src;
  const fail = () => say('Could not load this model.');
  if (/\.stl$/i.test(url)) {
    new STLLoader().load(
      url,
      (geometry) => {
        geometry.computeVertexNormals();
        frame(
          new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: STL_COLOR, roughness: 0.55, metalness: 0.05 }),
          ),
        );
      },
      undefined,
      fail,
    );
  } else {
    new GLTFLoader().load(url, (gltf) => frame(gltf.scene), undefined, fail);
  }

  let running = false;
  let raf = 0;
  function loop() {
    if (!running) return;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  return {
    start() {
      if (running) return;
      running = true;
      resize();
      loop();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}
