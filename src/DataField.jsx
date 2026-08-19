import { useEffect, useRef } from "react";

const DESKTOP_NODE_COUNT = 76;
const MOBILE_NODE_COUNT = 42;
const CONNECTION_DISTANCE = 1.28;

function createSeededRandom(seed = 19) {
  let state = seed;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export default function DataField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let disposeScene = () => {};

    import("three").then((THREE) => {
      if (disposed) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const nodeCount = isMobile ? MOBILE_NODE_COUNT : DESKTOP_NODE_COUNT;
      const random = createSeededRandom();

      let renderer;

      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !isMobile,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.setAttribute("aria-hidden", "true");
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 20);
      camera.position.z = 5;

      const field = new THREE.Group();
      scene.add(field);

      const positions = new Float32Array(nodeCount * 3);
      const velocities = new Float32Array(nodeCount * 3);
      const colors = new Float32Array(nodeCount * 3);
      const palette = [
        new THREE.Color(0x35584a),
        new THREE.Color(0x35584a),
        new THREE.Color(0xd84b2a),
        new THREE.Color(0x2853c7),
      ];

      let boundsX = 4.8;
      const boundsY = 3.2;

      for (let index = 0; index < nodeCount; index += 1) {
        const offset = index * 3;
        positions[offset] = (random() - 0.5) * boundsX * 2;
        positions[offset + 1] = (random() - 0.5) * boundsY * 2;
        positions[offset + 2] = (random() - 0.5) * 2.2;

        const speed = 0.018 + random() * 0.032;
        velocities[offset] = (random() - 0.5) * speed;
        velocities[offset + 1] = (random() - 0.5) * speed;
        velocities[offset + 2] = (random() - 0.5) * speed * 0.35;

        const color = palette[Math.floor(random() * palette.length)];
        colors[offset] = color.r;
        colors[offset + 1] = color.g;
        colors[offset + 2] = color.b;
      }

      const nodeGeometry = new THREE.BufferGeometry();
      const positionAttribute = new THREE.BufferAttribute(positions, 3);
      nodeGeometry.setAttribute("position", positionAttribute);
      nodeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const nodeMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.055 : 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.72,
        vertexColors: true,
        depthWrite: false,
      });
      const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
      field.add(nodes);

      const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
      const linePositions = new Float32Array(maxConnections * 6);
      const lineGeometry = new THREE.BufferGeometry();
      const lineAttribute = new THREE.BufferAttribute(linePositions, 3);
      lineAttribute.setUsage(THREE.DynamicDrawUsage);
      lineGeometry.setAttribute("position", lineAttribute);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4c655a,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      field.add(lines);

      const pointer = { x: 0, y: 0 };
      let scrollProgress = 0;
      let frameId = 0;
      let previousTime = performance.now();

      const updateConnections = () => {
        let lineOffset = 0;
        const distanceSquared = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

        for (let first = 0; first < nodeCount; first += 1) {
          const firstOffset = first * 3;

          for (let second = first + 1; second < nodeCount; second += 1) {
            const secondOffset = second * 3;
            const dx = positions[firstOffset] - positions[secondOffset];
            const dy = positions[firstOffset + 1] - positions[secondOffset + 1];
            const dz = positions[firstOffset + 2] - positions[secondOffset + 2];

            if (dx * dx + dy * dy + dz * dz > distanceSquared) continue;

            linePositions[lineOffset] = positions[firstOffset];
            linePositions[lineOffset + 1] = positions[firstOffset + 1];
            linePositions[lineOffset + 2] = positions[firstOffset + 2];
            linePositions[lineOffset + 3] = positions[secondOffset];
            linePositions[lineOffset + 4] = positions[secondOffset + 1];
            linePositions[lineOffset + 5] = positions[secondOffset + 2];
            lineOffset += 6;
          }
        }

        lineGeometry.setDrawRange(0, lineOffset / 3);
        lineAttribute.needsUpdate = true;
      };

      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;

        boundsX = Math.max(4.8, (width / height) * 3.4);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };

      const onPointerMove = (event) => {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      };

      const onScroll = () => {
        scrollProgress = Math.min(
          window.scrollY / Math.max(container.offsetHeight, 1),
          1,
        );
      };

      const render = (time) => {
        const delta = Math.min((time - previousTime) / 1000, 0.05);
        previousTime = time;

        for (let index = 0; index < nodeCount; index += 1) {
          const offset = index * 3;
          positions[offset] += velocities[offset] * delta;
          positions[offset + 1] += velocities[offset + 1] * delta;
          positions[offset + 2] += velocities[offset + 2] * delta;

          if (Math.abs(positions[offset]) > boundsX) velocities[offset] *= -1;
          if (Math.abs(positions[offset + 1]) > boundsY) {
            velocities[offset + 1] *= -1;
          }
          if (Math.abs(positions[offset + 2]) > 1.1) {
            velocities[offset + 2] *= -1;
          }
        }

        positionAttribute.needsUpdate = true;
        updateConnections();

        camera.position.x += (pointer.x * 0.16 - camera.position.x) * 0.035;
        camera.position.y += (-pointer.y * 0.12 - camera.position.y) * 0.035;

        const fieldScale = 1 + scrollProgress * 0.12;
        field.scale.setScalar(fieldScale);
        field.rotation.z = scrollProgress * 0.035;

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      resize();
      updateConnections();
      renderer.render(scene, camera);

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      if (!reducedMotion) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        frameId = window.requestAnimationFrame(render);
      }

      disposeScene = () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      disposeScene();
    };
  }, []);

  return <div ref={containerRef} className="data-field" aria-hidden="true" />;
}
