import {
  BufferGeometry, DoubleSide, Float32BufferAttribute, Mesh, PerspectiveCamera, Scene, ShaderMaterial,
  SRGBColorSpace, TextureLoader, WebGLRenderer,
} from "three";

export type PhotoForm = { bend: number; ripple: number; recall: number };

/** One scroll-driven sheet, inside the existing CSS camera. No animation loop. */
export function createPhotoSurface(canvas: HTMLCanvasElement, photo: HTMLElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  // This small sheet is enlarged by the outer CSS camera. A 2× buffer avoids
  // resampling softness on 1× displays as well as retaining detail on Retina.
  renderer.setPixelRatio(2);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new PerspectiveCamera(2 * Math.atan((2 / 3 * 1.3) / 3) * 180 / Math.PI, 1.5, 0.1, 10);
  camera.position.z = 3;
  // Eight connected photographic folds share one texture and one draw call.
  // Duplicate boundary vertices permit a crease without cutting the image.
  const positions: number[] = [], uvs: number[] = [], bands: number[] = [], indices: number[] = [];
  for (let band = 0; band < 8; band++) {
    const start = positions.length / 3;
    for (let row = 0; row <= 32; row++) for (let col = 0; col <= 8; col++) {
      const u = (band * 8 + col) / 64, v = row / 32;
      positions.push(u * 2 - 1, (v - 0.5) * 4 / 3, 0);
      uvs.push(u, v); bands.push((band + 0.5) / 4 - 1);
    }
    for (let row = 0; row < 32; row++) for (let col = 0; col < 8; col++) {
      const a = start + row * 9 + col, b = a + 9;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aBand", new Float32BufferAttribute(bands, 1));
  geometry.setIndex(indices);
  const material = new ShaderMaterial({
    side: DoubleSide,
    transparent: true,
    uniforms: { uImage: { value: null }, uBend: { value: 0 }, uRipple: { value: 0 }, uRecall: { value: 0 } },
    vertexShader: `
      uniform float uBend;
      uniform float uRipple;
      uniform float uRecall;
      attribute float aBand;
      varying vec2 vUv;
      varying float vLight;
      void main() {
        vUv = uv;
        vec3 p = position;
        float angle = p.x * uBend;
        if (abs(uBend) > 0.0001) {
          p.x = sin(angle) / uBend;
          p.z = (cos(angle) - 1.0) / uBend;
        }
        // A travelling diagonal crease unwinds into a flat, legible photograph.
        p.z += uBend * p.x * p.y * 0.38;
        p.z += sin(uv.x * 8.0 - uv.y * 5.0) * sin(uv.y * 3.14159265) * uRipple;
        vLight = 1.0 - abs(sin(angle)) * 0.15;
        float fold = uRecall * 0.9;
        float leaf = floor((aBand + 1.0) * 4.0);
        float localX = position.x - (aBand - 0.125);
        float ridge = mod(leaf, 2.0) < 0.5 ? localX : 0.25 - localX;
        p.x *= cos(fold);
        p.z += ridge * sin(fold);
        vLight *= 1.0 - (mod(leaf, 2.0) < 0.5 ? 0.06 : 0.14) * sin(fold);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uImage;
      varying vec2 vUv;
      varying float vLight;
      void main() {
        gl_FragColor = texture2D(uImage, vUv);
        gl_FragColor.rgb *= vLight;
        #include <colorspace_fragment>
      }
    `,
  });
  scene.add(new Mesh(geometry, material));
  let disposed = false;
  let ready = false;
  let lost = false;
  let current: PhotoForm = { bend: 0, ripple: 0, recall: 0 };
  const render = (form: PhotoForm) => {
    current = { ...form };
    const active = ready && !lost && (Math.abs(form.bend) > 0.001 || Math.abs(form.ripple) > 0.001 || form.recall > 0.001);
    photo.toggleAttribute("data-surface-active", active);
    if (!active || disposed) return;
    material.uniforms.uBend.value = form.bend;
    material.uniforms.uRipple.value = form.ripple;
    material.uniforms.uRecall.value = form.recall;
    renderer.render(scene, camera);
  };
  // CSS transforms never alter this box; only viewport/media layout resizes it.
  const resize = () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    render(current);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const texture = new TextureLoader().load("/v2/shore.webp", () => {
    if (disposed) return;
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    material.uniforms.uImage.value = texture;
    // Upload and compile while the DOM photograph is still carrying the scene,
    // rather than paying the first-use cost in the middle of a gesture.
    renderer.initTexture(texture);
    renderer.compileAsync(scene, camera).then(() => {
      if (disposed) return;
      ready = true;
      canvas.dataset.surfaceReady = "true";
      resize();
      renderer.render(scene, camera);
    }).catch(() => { /* Preserve the DOM image if the optional shader fails. */ });
  });
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    photo.removeAttribute("data-surface-active");
  };
  const onRestored = () => { lost = false; resize(); };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  return {
    render,
    dispose() {
      disposed = true;
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      photo.removeAttribute("data-surface-active");
      delete canvas.dataset.surfaceReady;
      texture.dispose(); geometry.dispose(); material.dispose(); renderer.dispose();
    },
  };
}
