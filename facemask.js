import { MindARThree } from 'mindar-face-three';
import * as THREE from 'three';
import {loadGLTF, loadVideo, loadAudio, loadTexture, loadTextures} from "./loader.js";


document.addEventListener("DOMContentLoaded", () => {

	const start = async () => {

		//1. Ініціалізація MindAR
		const mindarThree = new MindARThree({
			container: document.body,
		});

		const {renderer, scene, camera} = mindarThree;

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1 );
		scene.add( light );

		// instantiate a loader
		const loader = new THREE.TextureLoader();

		const faceMesh = mindarThree.addFaceMesh();

		faceMesh.material.needsUpdate = true;

		faceMesh.material.transparent = true;

    const masks = await loadTextures([
      "assets/masks/moustache1.png",
      "assets/masks/pennywiseMask.png",
      "assets/masks/face-mask.png",
      "assets/masks/faceMeshMask.png",
      "assets/masks/faceMeshTrackers.png",
      "assets/masks/canonical_face_model_uv_visualization.png",
      "assets/masks/bright-mesh-wire-frame-lion-head-light-spots-glare-effect-white-carcass-polygonal-vector-format-black-background-162152793.png",
    ]);

   
    let currentMask = 0;

		
		faceMesh.material.map = masks[currentMask];

		scene.add(faceMesh);

		//4. Запуск MindAR 
		await mindarThree.start();

		document.querySelector("button#switch").addEventListener("click", () => {
			mindarThree.switchCamera();
		});

		document.querySelector("button#mask").addEventListener("click", () => {
			currentMask = (currentMask + 1) % masks.length;
			faceMesh.material.map = masks[currentMask];
		});

		//5. Цикл оновлення
		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}

	start();
});
