import {
  BufferGeometry, DoubleSide, Float32BufferAttribute, Mesh, PerspectiveCamera, Scene, ShaderMaterial,
  SRGBColorSpace, TextureLoader, WebGLRenderer,
} from "three";

export type PhotoForm = { bend: number; ripple: number; recall: number; release: number; zoom: number; bank: number };

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
    uniforms: { uImage: { value: null }, uBend: { value: 0 }, uRipple: { value: 0 }, uBank: { value: 0 }, uFolds: { value: new Float32Array([.25, 0, .25, 0, .25, 0, .25, 0, .25, 0, .25, 0, .25, 0, .25, 0]) }, uZoom: { value: 1 } },
    vertexShader: `
      uniform float uBend;
      uniform float uRipple;
      uniform float uBank;
      uniform vec2 uFolds[8];
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
        float leaf = floor((aBand + 1.0) * 4.0);
        float localX = position.x - (aBand - 0.125);
        vec2 extent = vec2(0.0);
        vec2 preceding = vec2(0.0);
        vec2 direction = vec2(1.0, 0.0);
        // Integrating each hinge keeps both copies of every shared edge together.
        for (int i = 0; i < 8; i++) {
          extent += uFolds[i];
          if (float(i) < leaf) preceding += uFolds[i];
          if (float(i) == leaf) direction = uFolds[i] * 4.0;
        }
        vec2 sheet = -extent * 0.5 + preceding + localX * direction;
        p.x += sheet.x - position.x;
        p.z += sheet.y;
        p.xy = mat2(cos(uBank), sin(uBank), -sin(uBank), cos(uBank)) * p.xy;
        vLight *= 1.0 - abs(direction.y) * (mod(leaf, 2.0) < 0.5 ? 0.06 : 0.14);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uImage;
      uniform float uZoom;
      varying vec2 vUv;
      varying float vLight;
      void main() {
        vec2 focus = vec2(0.10, 0.22);
        gl_FragColor = texture2D(uImage, (vUv - focus) / uZoom + focus);
        gl_FragColor.rgb *= vLight;
        #include <colorspace_fragment>
      }
    `,
  });
  scene.add(new Mesh(geometry, material));
  let disposed = false;
  let ready = false;
  let lost = false;
  let current: PhotoForm = { bend: 0, ripple: 0, recall: 0, release: 0, zoom: 1, bank: 0 };
  const render = (form: PhotoForm) => {
    current = { ...form };
    const active = ready && !lost && (Math.abs(form.bend) > 0.001 || Math.abs(form.bank) > 0.001 || Math.abs(form.ripple) > 0.001 || (form.recall > 0.001 && form.release < 0.999));
    photo.toggleAttribute("data-surface-active", active);
    if (!active || disposed) return;
    material.uniforms.uBend.value = form.bend;
    material.uniforms.uRipple.value = form.ripple;
    material.uniforms.uBank.value = form.bank;
    const folds = material.uniforms.uFolds.value;
    for (let i = 0; i < 8; i++) {
      // Release travels from the distant shore toward the boat on the left.
      const t = Math.max(0, Math.min(1, (form.release - (7 - i) * 0.045) / 0.65));
      const angle = form.recall * 0.9 * (1 - t * t * (3 - 2 * t)) * (i % 2 ? -1 : 1);
      folds[i * 2] = Math.cos(angle) * 0.25;
      folds[i * 2 + 1] = Math.sin(angle) * 0.25;
    }
    material.uniforms.uZoom.value = form.zoom;
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
      const initial = current;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      // Exercise the curved path as well as compilation before its first visible
      // use. Restore the real pose in this same task, before the browser paints.
      render({ ...initial, bend: 0.38, ripple: 0.025, recall: 0.9, release: 0.35, zoom: 1.2, bank: 0.044 });
      const gl = renderer.getContext();
      // Exercise readback as well: software compositors pay for this path when
      // the hidden canvas first joins the visible CSS 3D scene.
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      render(initial);
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
      texture.dispose(); geometry.dispose(); material.dispose();
      // The canvas/context is reused on responsive rebuild. In particular,
      // WebKit rejects Three's next 3D placeholder upload if flip-Y stays set.
      renderer.resetState();
      renderer.dispose();
    },
  };
}
