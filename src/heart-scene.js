import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { circulationSteps, structures } from './content.js';

const palette = {
  dark: { background: 0x0b1722, fog: 0x0b1722, floor: 0x12212c },
  light: { background: 0xeaf2f4, fog: 0xeaf2f4, floor: 0xdce9ec }
};

export function createHeartScene(container, onSelect) {
  if (!container || !('WebGLRenderingContext' in window)) {
    throw new Error('Browser ini belum menyediakan WebGL untuk menampilkan model 3D.');
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.3);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.25));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.setAttribute('aria-label', 'Model jantung 3D interaktif. Seret untuk memutar dan pilih struktur untuk melihat keterangannya.');
  container.replaceChildren(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 10;
  controls.minPolarAngle = 0.48;
  controls.maxPolarAngle = Math.PI - 0.48;

  scene.add(new THREE.HemisphereLight(0xcbe9ff, 0x28121c, 2.2));
  const keyLight = new THREE.DirectionalLight(0xffe7df, 3.2);
  keyLight.position.set(3.5, 4.5, 5);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x56bde7, 42, 12);
  rimLight.position.set(-3.2, 0.5, -1.5);
  scene.add(rimLight);

  const root = new THREE.Group();
  root.rotation.y = -0.14;
  scene.add(root);
  const heartGroup = new THREE.Group();
  root.add(heartGroup);

  const material = (color, roughness = 0.36) => new THREE.MeshStandardMaterial({
    color, roughness, metalness: 0.015, emissive: color, emissiveIntensity: 0.025
  });
  const nodeById = new Map();
  const defaultScales = new Map();
  const pickables = [];

  const bodyProfile = [
    new THREE.Vector3(0.015, -1.78, 0.025),
    new THREE.Vector3(0.25, -1.56, 0.28),
    new THREE.Vector3(0.55, -1.24, 0.42),
    new THREE.Vector3(0.86, -0.82, 0.54),
    new THREE.Vector3(1.03, -0.26, 0.59),
    new THREE.Vector3(1.04, 0.28, 0.58),
    new THREE.Vector3(0.92, 0.72, 0.5),
    new THREE.Vector3(0.76, 1.05, 0.4),
    new THREE.Vector3(0.57, 1.22, 0.31),
    new THREE.Vector3(0.025, 1.27, 0.025)
  ];
  const profileCurve = new THREE.CatmullRomCurve3(bodyProfile, false, 'centripetal');
  const ringCount = 64;
  const radialSegments = 56;
  const bodyPositions = [];
  const bodyIndices = [];
  for (let row = 0; row <= ringCount; row += 1) {
    const profile = profileCurve.getPoint(row / ringCount);
    const width = Math.max(0.01, profile.x);
    const depth = Math.max(0.02, profile.z);
    const centerX = 0.28 * Math.max(0, Math.min(1, (-profile.y - 0.2) / 1.55));
    for (let column = 0; column <= radialSegments; column += 1) {
      const angle = (column / radialSegments) * Math.PI * 2;
      bodyPositions.push(
        centerX + width * Math.sin(angle),
        profile.y,
        depth * Math.cos(angle) - 0.08
      );
    }
  }
  for (let row = 0; row < ringCount; row += 1) {
    for (let column = 0; column < radialSegments; column += 1) {
      const current = row * (radialSegments + 1) + column;
      const next = current + radialSegments + 1;
      bodyIndices.push(current, current + 1, next, current + 1, next + 1, next);
    }
  }
  const bodyGeometry = new THREE.BufferGeometry();
  bodyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bodyPositions, 3));
  bodyGeometry.setIndex(bodyIndices);
  bodyGeometry.computeVertexNormals();
  const heartBody = new THREE.Mesh(bodyGeometry, material(0xb01e32, 0.27));
  heartBody.name = 'heart_surface';
  heartGroup.add(heartBody);
  const appendageGeometry = new THREE.SphereGeometry(1, 32, 24);
  [
    { position: [-0.58, 0.55, 0.08], scale: [0.27, 0.42, 0.25], rotation: -0.35, color: 0xa91e30 },
    { position: [0.58, 0.56, 0.08], scale: [0.25, 0.39, 0.24], rotation: 0.34, color: 0xb52637 }
  ].forEach(({ position, scale, rotation, color }) => {
    const appendage = new THREE.Mesh(appendageGeometry, material(color, 0.32));
    appendage.position.set(...position);
    appendage.scale.set(...scale);
    appendage.rotation.z = rotation;
    heartGroup.add(appendage);
  });

  function addChamber(entry) {
    const group = new THREE.Group();
    group.name = entry.id;
    group.position.set(...entry.position);
    group.scale.set(...entry.scale);
    const mesh = new THREE.Mesh(
      appendageGeometry,
      new THREE.MeshStandardMaterial({
        color: entry.color, transparent: true, opacity: 0.001, depthWrite: false, roughness: 0.34,
        emissive: entry.color, emissiveIntensity: 0.025
      })
    );
    mesh.name = entry.id;
    mesh.userData.structureId = entry.id;
    mesh.userData.baseOpacity = 0.001;
    mesh.scale.set(0.7, 0.78, 0.62);
    group.add(mesh);
    heartGroup.add(group);
    nodeById.set(entry.id, group);
    defaultScales.set(entry.id, group.scale.clone());
    pickables.push(mesh);
  }

  function addTube(group, points, radius, color, structureId, openings = {}) {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(24, points.length * 12), radius, 12, false),
      material(color, 0.3)
    );
    if (structureId) {
      mesh.name = structureId;
      mesh.userData.structureId = structureId;
      pickables.push(mesh);
    }
    group.add(mesh);
    const addOpening = (point, tangent) => {
      const direction = tangent.normalize();
      const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.78, radius * 0.17, 8, 24),
        material(color, 0.28)
      );
      ring.position.copy(point);
      ring.quaternion.copy(orientation);
      group.add(ring);
      const lumen = new THREE.Mesh(
        new THREE.CircleGeometry(radius * 0.66, 20),
        new THREE.MeshBasicMaterial({ color: 0x55101d })
      );
      lumen.position.copy(point).addScaledVector(direction, 0.002);
      lumen.quaternion.copy(orientation);
      group.add(lumen);
    };
    if (openings.start) addOpening(curve.getPointAt(0), curve.getTangentAt(0).negate());
    if (openings.end) addOpening(curve.getPointAt(1), curve.getTangentAt(1));
    return { curve, mesh };
  }

  function addVessel(entry) {
    const group = new THREE.Group();
    group.name = entry.id;
    heartGroup.add(group);
    const mainRadius = entry.id === 'aorta' ? 0.17 : entry.id === 'pulmonary_veins' ? 0.056 : 0.13;
    const paths = {
      superior_vena_cava: [[-0.69, 2.03, 0.25], [-0.67, 1.62, 0.25], [-0.62, 1.2, 0.25], [-0.55, 0.67, 0.25]],
      inferior_vena_cava: [[-0.39, -1.91, 0.22], [-0.43, -1.42, 0.22], [-0.48, -0.95, 0.22], [-0.49, -0.6, 0.22]],
      aorta: [[0.24, 0.25, 0.25], [0.13, 0.69, 0.25], [0.17, 1.13, 0.22], [0.38, 1.52, 0.2], [0.78, 1.59, 0.18], [1.05, 1.34, 0.18]],
      pulmonary_artery: [[-0.4, -0.02, 0.3], [-0.22, 0.38, 0.3], [-0.13, 0.83, 0.29], [0.12, 1.04, 0.28], [0.52, 0.98, 0.27], [0.94, 0.79, 0.25]]
    };

    if (entry.id === 'pulmonary_veins') {
      [
          [[0.45, 0.72, 0.34], [0.84, 0.83, 0.32], [1.14, 0.92, 0.28]],
          [[0.43, 0.38, 0.34], [0.82, 0.29, 0.32], [1.14, 0.18, 0.28]]
        ].forEach(path => addTube(group, path, mainRadius, entry.color, entry.id, { end: true }));
    } else {
        const openings = entry.id === 'superior_vena_cava' || entry.id === 'inferior_vena_cava'
          ? { start: true }
          : entry.id === 'aorta' ? { end: true } : {};
        addTube(group, paths[entry.id], mainRadius, entry.color, entry.id, openings);
    }

    const branches = {
      aorta: [
        [[0.39, 1.49, 0.2], [0.36, 1.79, 0.2], [0.34, 2.05, 0.2]],
        [[0.58, 1.57, 0.19], [0.59, 1.83, 0.19], [0.58, 2.07, 0.19]],
        [[0.77, 1.55, 0.18], [0.89, 1.8, 0.18], [1.02, 2.01, 0.18]]
      ],
      pulmonary_artery: [
        [[0.48, 0.97, 0.27], [0.77, 1.12, 0.25], [1.04, 1.17, 0.23]],
        [[0.66, 0.92, 0.27], [0.91, 0.63, 0.25], [1.12, 0.57, 0.23]]
      ]
    };
    (branches[entry.id] || []).forEach(path => addTube(group, path, 0.075, entry.color, entry.id, { end: true }));
    nodeById.set(entry.id, group);
    defaultScales.set(entry.id, group.scale.clone());
  }

  const coronaryMaterial = new THREE.MeshStandardMaterial({ color: 0x8c3540, roughness: 0.48 });
  const coronaryPaths = [
    { radius: 0.017, points: [[-0.06, 0.48, 0.47], [-0.12, 0.2, 0.51], [-0.37, -0.04, 0.49], [-0.55, -0.48, 0.43], [-0.49, -0.98, 0.34], [-0.28, -1.42, 0.23]] },
    { radius: 0.014, points: [[-0.12, 0.2, 0.51], [0.13, 0.04, 0.51], [0.35, -0.31, 0.49], [0.55, -0.78, 0.42], [0.63, -1.12, 0.32]] },
    { radius: 0.008, points: [[-0.34, -0.1, 0.49], [-0.68, -0.12, 0.42], [-0.81, -0.42, 0.35]] },
    { radius: 0.007, points: [[-0.52, -0.5, 0.43], [-0.77, -0.7, 0.36], [-0.78, -0.96, 0.31]] },
    { radius: 0.007, points: [[-0.43, -0.65, 0.42], [-0.22, -0.82, 0.4], [-0.1, -1.13, 0.31]] },
    { radius: 0.006, points: [[0.33, -0.32, 0.49], [0.17, -0.64, 0.45], [0.13, -1.02, 0.36]] },
    { radius: 0.006, points: [[0.5, -0.62, 0.44], [0.78, -0.64, 0.36], [0.84, -0.89, 0.31]] },
    { radius: 0.006, points: [[0.55, -0.9, 0.4], [0.32, -1.12, 0.33], [0.29, -1.36, 0.24]] }
  ];

  function addCoronaryVessels() {
    coronaryPaths.forEach(({ points, radius }) => {
      const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
      const vessel = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 7, false), coronaryMaterial);
      heartGroup.add(vessel);
    });
  }

  structures.forEach(entry => {
    if (entry.group === 'Ruang jantung') addChamber(entry);
    else addVessel(entry);
  });
  addCoronaryVessels();

  const base = new THREE.Mesh(
    new THREE.CircleGeometry(1.7, 56),
    new THREE.MeshBasicMaterial({ color: 0x5c99ac, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  base.rotation.x = -Math.PI / 2;
  base.position.y = -1.62;
  root.add(base);

  const flowPoints = [
    new THREE.Vector3(-0.47, -1.35, 0.04),
    new THREE.Vector3(-0.57, 0.44, 0.25),
    new THREE.Vector3(-0.47, -0.32, 0.24),
    new THREE.Vector3(-0.16, 0.94, 0.03),
    new THREE.Vector3(-0.72, 1.56, -0.22),
    new THREE.Vector3(0.55, 0.84, 0.04),
    new THREE.Vector3(0.48, 0.45, 0.24),
    new THREE.Vector3(0.43, -0.34, 0.24),
    new THREE.Vector3(0.74, 1.5, -0.03)
  ];
  const flowCurve = new THREE.CatmullRomCurve3(flowPoints);
  const flowPath = new THREE.Mesh(
    new THREE.TubeGeometry(flowCurve, 120, 0.018, 6, false),
    new THREE.MeshBasicMaterial({ color: 0xa3d8e6, transparent: true, opacity: 0.28 })
  );
  heartGroup.add(flowPath);

  const particles = Array.from({ length: 12 }, (_, index) => {
    const particle = new THREE.Mesh(
      new THREE.SphereGeometry(0.052, 14, 12),
      new THREE.MeshBasicMaterial({ color: index < 6 ? 0x69bbff : 0xff7785 })
    );
    particle.userData.progress = index / 12;
    particle.userData.offset = index * 0.0015;
    heartGroup.add(particle);
    return particle;
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selectedId = null;
  let flowActive = false;
  let flowProgress = 0;
  let activeStep = -1;
  let theme = 'dark';
  let lastTime = 0;

  function select(id, shouldFocus = false) {
    const entry = structures.find(item => item.id === id);
    if (!entry) return;
    selectedId = id;
    pickables.forEach(mesh => {
      const selected = mesh.userData.structureId === id;
      const baseOpacity = mesh.userData.baseOpacity ?? 1;
      mesh.material.opacity = selected ? Math.max(baseOpacity, 0.17) : baseOpacity;
      mesh.material.emissiveIntensity = selected ? 0.2 : 0.035;
      mesh.material.emissive.setHex(selected ? 0xffc15a : mesh.material.color.getHex());
    });
    if (shouldFocus) focus(id);
    onSelect(entry);
  }

  function focus(id) {
    const object = nodeById.get(id);
    if (!object) return;
    const position = new THREE.Vector3();
    object.getWorldPosition(position);
    controls.target.lerp(position, 0.72);
  }

  function handlePointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    if (hit && hit.object.userData.structureId) select(hit.object.userData.structureId);
  }
  renderer.domElement.addEventListener('pointerup', handlePointer);

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  function animate(time = 0) {
    const delta = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    controls.update();
    if (flowActive) flowProgress = (flowProgress + delta * 0.09) % 1;
    particles.forEach(particle => {
      particle.visible = flowActive;
      if (flowActive) particle.position.copy(flowCurve.getPoint((flowProgress + particle.userData.progress) % 1));
    });
    if (activeStep >= 0) {
      const step = circulationSteps[activeStep];
      const object = nodeById.get(step.id);
      if (object) object.scale.copy(defaultScales.get(step.id)).multiplyScalar(1 + Math.sin(time * 0.004) * 0.035);
    }
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
  }
  renderer.setAnimationLoop(animate);

  function setFlow(active) {
    flowActive = active;
    flowPath.material.opacity = active ? 0.56 : 0.2;
  }

  function setStep(index) {
    if (activeStep >= 0) {
      const oldId = circulationSteps[activeStep].id;
      const old = nodeById.get(oldId);
      if (old) old.scale.copy(defaultScales.get(oldId));
    }
    activeStep = index;
    const step = circulationSteps[index];
    if (step) select(step.id, true);
  }

  function setTheme(nextTheme) {
    theme = nextTheme === 'light' ? 'light' : 'dark';
    const colors = palette[theme];
    scene.background = new THREE.Color(colors.background);
    scene.fog = new THREE.Fog(colors.fog, 9, 18);
    base.material.color.setHex(colors.floor);
  }

  function restore() {
    nodeById.forEach(object => {
      object.visible = true;
      object.scale.copy(defaultScales.get(object.name));
      object.traverse(child => {
        if (child.material && child.material.emissive) {
          if (child.userData.baseOpacity !== undefined) child.material.opacity = child.userData.baseOpacity;
          child.material.emissive.copy(child.material.color);
          child.material.emissiveIntensity = 0.035;
        }
      });
    });
    selectedId = null;
    activeStep = -1;
    setFlow(false);
    controls.target.set(0, 0, 0);
    camera.position.set(0, 0.15, 7.3);
    controls.update();
    onSelect(null);
  }

  return {
    select,
    focus,
    setFlow,
    setStep,
    setTheme,
    restore,
    get selectedId() { return selectedId; },
    getNode(id) { return nodeById.get(id); },
    dispose() {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      renderer.domElement.removeEventListener('pointerup', handlePointer);
      controls.dispose();
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (Array.isArray(object.material)) object.material.forEach(item => item.dispose());
        else if (object.material) object.material.dispose();
      });
      renderer.dispose();
    }
  };
}
