import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import './ModelViewer.css';

function useModelLoader(url) {
    const loader = url.endsWith('.obj') ? OBJLoader : GLTFLoader;
    console.log(`Loading using: ${loader.name}`);
    const model = useLoader(loader, url);
    return model;
}

const Model = ({ modelUrl }) => {
    const model = useModelLoader(modelUrl);
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const [clicked, setClick] = useState(false);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += clicked ? 0.05 : 0.01;
        }
    });

    try {
        return (
            <primitive
                ref={meshRef}
                object={model.scene || model}
                scale={clicked ? 2 : 1.5}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
                onClick={() => setClick(!clicked)}
                dispose={null}
            >
                <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            </primitive>
        );
    } catch (error) {
        console.error("Failed to load the model:", error);
        return <div>Error loading model.</div>;
    }
};

const ModelViewForm = () => {
    const [modelUrl, setModelUrl] = useState(null);

    const handleModelUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setModelUrl(url);
        }
    };

    return (
        <div className="container">
            <input type="file" onChange={handleModelUpload} accept=".glb, .gltf, .obj" />
            <Suspense fallback={<div>Loading model...</div>}>
                <Canvas className="canvas" shadows camera={{ position: [3, 3, 3], fov: 75 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                    <pointLight position={[-10, -10, -10]} />
                    <OrbitControls />
                    {modelUrl ? <Model modelUrl={modelUrl} /> : null}
                </Canvas>
            </Suspense>
        </div>
    );
};

export default ModelViewForm;
