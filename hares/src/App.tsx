import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './App.css';

function App() {
  const threeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threeRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeRef.current.appendChild(renderer.domElement);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Load the font
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font: Font) => {
      const textGeometryA = new TextGeometry('A', {
        font: font,
        size: 1,
        height: 0.2,
      });

      const alphabetMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFDEAD, 
        specular: 0x555555,
        shininess: 30,
      });
      const textMeshA = new THREE.Mesh(textGeometryA, alphabetMaterial);
      textMeshA.position.x = -2; //left 
      scene.add(textMeshA);

      const textGeometry0 = new TextGeometry('0', {
        font: font,
        size: 1,
        height: 0.1,
      });

      //metal
      const digitMaterial = new THREE.MeshStandardMaterial({
        color: 0x002152, 
        metalness: 0.5, 
        roughness: 0.2, 
      });
      const textMesh0 = new THREE.Mesh(textGeometry0, digitMaterial);
      textMesh0.position.x = 1;
      scene.add(textMesh0);

      // glowing cube
      const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); 
      const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff, 
        emissiveIntensity: 5, 
      });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      scene.add(cube);

      const wireframeGeometry = new THREE.WireframeGeometry(cubeGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      cube.add(wireframe);

      const pointLight = new THREE.PointLight(0xffffff, 20, 500); 
      pointLight.position.copy(cube.position);
      scene.add(pointLight);

      const digitLight = new THREE.PointLight(0xffffff, 10, 100);
      digitLight.position.set(1, 0, 5); 
      scene.add(digitLight);

      // add ambient to scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.470);
      scene.add(ambientLight);

      const composer = new EffectComposer(renderer);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2.0, 
        0.4, 
        0.85 
      );
      composer.addPass(bloomPass);

      //movement
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'w':
            cube.position.y += 0.1;
            break;
          case 's':
            cube.position.y -= 0.1;
            break;
          case 'a':
            camera.position.x += 0.1;
            break;
          case 'd':
            camera.position.x -= 0.1;
            break;
        }
        //update light
        pointLight.position.copy(cube.position);
      };
      window.addEventListener('keydown', handleKeyDown);

      // render
      const animate = () => {
        requestAnimationFrame(animate);
        composer.render();
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        if (threeRef.current) {
          threeRef.current.removeChild(renderer.domElement);
        }
      };
    });
  }, []);

  return (
    <div ref={threeRef} style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}></div>
  );
}

export default App;