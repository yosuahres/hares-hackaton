import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import './App.css';

function App() {
  const threeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    // Create the scene
    const scene = new THREE.Scene();

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeRef.current.appendChild(renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Load the font
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font: Font) => {
      // Create text geometry for 'A'
      const textGeometryA = new TextGeometry('A', {
        font: font,
        size: 1,
        height: 0.2,
      });
      const textMaterialA = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const textMeshA = new THREE.Mesh(textGeometryA, textMaterialA);
      textMeshA.position.x = -2; // Position on the left side
      scene.add(textMeshA);

      // Create text geometry for '0'
      const textGeometry0 = new TextGeometry('0', {
        font: font,
        size: 1,
        height: 0.2,
      });
      const textMaterial0 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
      const textMesh0 = new THREE.Mesh(textGeometry0, textMaterial0);
      textMesh0.position.x = 2; // Position on the right side
      scene.add(textMesh0);

      // Render the scene
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    });

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeRef.current) {
        threeRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={threeRef} style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}></div>
  );
}

export default App;