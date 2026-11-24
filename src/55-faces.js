
// Photo faces of the defenders, drawn as camera-facing sprites over the low-poly heads.
const FACES = { mat: {}, img: {}, icon: {}, pool: [], used: 0, dir: new THREE.Vector3(0, -1, 0) };
function initFaces() {
  for (const k in FACE_SRC) {
    const img = new Image(), tex = new THREE.Texture(img);
    tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
    img.onload = () => {
      tex.needsUpdate = true;
      // A small pixelated copy for the build menu, to match the pixel UI.
      const c = document.createElement('canvas'); c.width = c.height = 16; const x = c.getContext('2d');
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, 16, 16); FACES.icon[k] = c;
    };
    img.src = FACE_SRC[k]; FACES.img[k] = img;
    FACES.mat[k] = new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(2.3, 2.3, 2.3), alphaTest: .5, transparent: false, depthWrite: true, toneMapped: false, fog: false });
  }
}
function faceBegin() { FACES.used = 0; if (R.cam) R.cam.getWorldDirection(FACES.dir); }
// key: face name, (x, y, z): centre of the face, size: world units, flash: 0..1 hit flash.
function putFace(key, x, y, z, size, flash = 0) {
  if (RIG_CAPTURE || !FACES.mat[key]) return;
  let sp = FACES.pool[FACES.used];
  if (!sp) { sp = new THREE.Sprite(FACES.mat[key]); sp.frustumCulled = false; sp.castShadow = false; R.scene.add(sp); FACES.pool.push(sp); }
  FACES.used++;
  if (sp.material !== FACES.mat[key]) sp.material = FACES.mat[key];
  sp.visible = true; const d = FACES.dir; sp.position.set(x - d.x * .6, y - d.y * .6, z - d.z * .6); sp.scale.set(size, size, 1);
  sp.userData.flash = flash;
}
function faceEnd() {
  for (let i = FACES.used; i < FACES.pool.length; i++) FACES.pool[i].visible = false;
}
// Puts a face on the head of a figure that rigHuman just posed. M3 is the head matrix it returns.
function faceOnHead(key, M3, scale, size = .8, flash = 0) {
  const e = M3.elements; putFace(key, e[12], e[13] + .2 * scale, e[14], size * scale, flash);
}
// Draws a round face icon on the 2D UI canvas.
function drawFaceIcon(ctx, key, x, y, size, alpha = 1) {
  const ic = FACES.icon[key]; if (!ic) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.imageSmoothingEnabled = false; ctx.drawImage(ic, x, y, size, size); ctx.restore();
}
