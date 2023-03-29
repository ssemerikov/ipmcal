import { MindARThree } from 'mindar-image-three';
import * as THREE from 'three';
import {loadGLTF, loadVideo, loadAudio, loadTexture, loadTextures} from "./loader.js";
import {CSS3DObject, CSS3DRenderer} from "three/addons/renderers/CSS3DRenderer.js";


document.addEventListener("DOMContentLoaded", () => {
  const start = async() => {

    // initialize MindAR 
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#container"),
      imageTargetSrc: 'assets/targets.mind',
      uiScanning: "#scanning",
      //uiLoading: "no",
    });
    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const [
      cardTexture,
      emailTexture,
      locationTexture,
      webTexture,
      profileTexture,
      leftTexture,
      rightTexture,
      portfolioItem0Texture,
      portfolioItem1Texture,
      portfolioItem2Texture,
    ] = await loadTextures([
      "assets/back.png",
      "assets/email.jpg",
      "assets/location.jpg",
      "assets/web.jpg",
      "assets/profile.jpg",
      "assets/left.jpg",
      "assets/right.jpg",
      "assets/34414016404_424abde5f9_b.jpg",
      "assets/tryon.png",
      "assets/facemask.png",
    ]);

    const gallery = await loadTextures([
      "assets/photos/20230323_093632.jpg",
      "assets/photos/20230323_095029.jpg",
      "assets/photos/20230323_132813.jpg",
      "assets/photos/20230323_132834.jpg",
      "assets/photos/20230323_132841.jpg",
      "assets/photos/20230323_132910.jpg",
      "assets/photos/20230323_132947.jpg",
    ]);

    const planeGeometry = new THREE.PlaneGeometry(1, 0.552);
    const cardGeometry = new THREE.PlaneGeometry(1, 1205/850);
    const photoGeometry = new THREE.PlaneGeometry(1, 4000/1844);
    const cardMaterial = new THREE.MeshBasicMaterial({map: cardTexture});
    const card = new THREE.Mesh(cardGeometry, cardMaterial);

    let currentPhoto = 0;
    const photoMaterial = new THREE.MeshBasicMaterial({map: gallery[currentPhoto]});
    const photo = new THREE.Mesh(photoGeometry, photoMaterial);
    photo.position.set(1.35, 0.25, 0);

    const iconGeometry = new THREE.CircleGeometry(0.075, 32);
    const emailMaterial = new THREE.MeshBasicMaterial({map: emailTexture});
    const webMaterial = new THREE.MeshBasicMaterial({map: webTexture});
    const profileMaterial = new THREE.MeshBasicMaterial({map: profileTexture});
    const locationMaterial = new THREE.MeshBasicMaterial({map: locationTexture});
    const leftMaterial = new THREE.MeshBasicMaterial({map: leftTexture});
    const rightMaterial = new THREE.MeshBasicMaterial({map: rightTexture});
    const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
    const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
    const profileIcon = new THREE.Mesh(iconGeometry, profileMaterial);
    const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
    const leftIcon = new THREE.Mesh(iconGeometry, leftMaterial);
    const rightIcon = new THREE.Mesh(iconGeometry, rightMaterial);

    const portfolioItem0Video = await loadVideo("assets/sintel.mp4");
    //portfolioItem0Video.muted = true;
    const portfolioItem0VideoTexture = new THREE.VideoTexture(portfolioItem0Video);
    const portfolioItem0VideoMaterial = new THREE.MeshBasicMaterial({map: portfolioItem0VideoTexture});
    const portfolioItem0Material = new THREE.MeshBasicMaterial({map: portfolioItem0Texture});
    const portfolioItem1Material = new THREE.MeshBasicMaterial({map: portfolioItem1Texture});
    const portfolioItem2Material = new THREE.MeshBasicMaterial({map: portfolioItem2Texture});

    const portfolioItem0V = new THREE.Mesh(planeGeometry, portfolioItem0VideoMaterial); 
    const portfolioItem0 = new THREE.Mesh(planeGeometry, portfolioItem0Material); 
    const portfolioItem1 = new THREE.Mesh(planeGeometry, portfolioItem1Material); 
    const portfolioItem2 = new THREE.Mesh(planeGeometry, portfolioItem2Material); 

    profileIcon.position.set(-0.42, -0.80, 0);
    webIcon.position.set(-0.14, -0.80, 0);
    emailIcon.position.set(0.14, -0.80, 0);
    locationIcon.position.set(0.42, -0.80, 0);

    const portfolioGroup = new THREE.Group();
    //portfolioGroup.position.set(0, 0, -0.01);
    portfolioGroup.position.set(0, 0.9, 0.01);

    portfolioGroup.add(portfolioItem0);
    portfolioGroup.add(leftIcon);
    portfolioGroup.add(rightIcon);
    leftIcon.position.set(-0.7, 0, 0);
    rightIcon.position.set(0.7, 0, 0);

    const avatar = await loadGLTF("assets/gaming_desktop_pc_blend_file.glb");
    avatar.scene.scale.set(0.2, 0.2, 0.2);
    avatar.scene.rotation.set(0, -90*Math.PI/180, 0);
    avatar.scene.position.set(0.40, -0.45, -1.25);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(avatar.scene);
    anchor.group.add(card);
    anchor.group.add(photo);
    anchor.group.add(emailIcon);
    anchor.group.add(webIcon);
    anchor.group.add(profileIcon);
    anchor.group.add(locationIcon);
    anchor.group.add(portfolioGroup);

    const textElement = document.createElement("div");
    const textObj = new CSS3DObject(textElement);
    textObj.position.set(0, -1000, 0);
    textObj.visible = false;
    textElement.style.background = "#FFFFFF";
    textElement.style.padding = "30px";
    textElement.style.fontSize = "60px";

    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(textObj);

    // handle buttons
    leftIcon.userData.clickable = true;
    rightIcon.userData.clickable = true;
    emailIcon.userData.clickable = true;
    webIcon.userData.clickable = true;
    profileIcon.userData.clickable = true;
    locationIcon.userData.clickable = true;
    portfolioItem0.userData.clickable = true;
    portfolioItem0V.userData.clickable = true;
    portfolioItem1.userData.clickable = true;
    portfolioItem2.userData.clickable = true;

    const portfolioItems = [portfolioItem0, portfolioItem1, portfolioItem2]; 
    let currentPortfolio = 0;

    document.body.addEventListener("click", (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(mouseX, mouseY);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
	let o = intersects[0].object; 
	while (o.parent && !o.userData.clickable) {
	  o = o.parent;
	}
	if (o.userData.clickable) {
	  if (o === leftIcon || o === rightIcon) {
	    if (o === leftIcon) {
	      currentPortfolio = (currentPortfolio - 1 + portfolioItems.length) % portfolioItems.length;
	    } else {
	      currentPortfolio = (currentPortfolio + 1) % portfolioItems.length;
	    }
	    portfolioItem0Video.pause();
	    for (let i = 0; i < portfolioItems.length; i++) {
	      portfolioGroup.remove(portfolioItems[i]);
	    }
	    portfolioGroup.add(portfolioItems[currentPortfolio]);
	  } else if (o === portfolioItem0) {
	    portfolioGroup.remove(portfolioItem0);
	    portfolioGroup.add(portfolioItem0V);
	    portfolioItems[0] = portfolioItem0V;
	    portfolioItem0Video.play();
	  } else if (o === portfolioItem0V) {
	    if (portfolioItem0Video.paused) {
	      portfolioItem0Video.play();
	    } else {
	      portfolioItem0Video.pause();
	    }
	  } else if (o === webIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "<a href='https://kdpu.edu.ua/informatyky-ta-prykladnoi-matematyky' target='_blank'>https://kdpu.edu.ua/informatyky-ta-prykladnoi-matematyky</a>";
	  } else if (o === emailIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "<a href='mailto:kafedra.ipm@gmail.com'>kafedra.ipm@gmail.com</a>";
	  } else if (o === profileIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "<a href='https://www.facebook.com/ipmkdpu' target='_blank'>https://www.facebook.com/ipmkdpu</a>";
	  } else if (o === locationIcon) {
	    textObj.visible = true;
	    textElement.innerHTML = "<a href='https://goo.gl/maps/FEuUc3FR4byB1UGL7' target='_blank'>Кривий Ріг, пр. Гагаріна, буд. 54, ауд. 201</a>";
	  } else if (o == portfolioItem1) {
		window.open("tryon.html");
	  } else if (o == portfolioItem2) {
		window.open("facemask.html");
	  }
	}
      }
    });

    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const iconScale = 1 + 0.2 * Math.sin(elapsed*3);
      [webIcon, emailIcon, profileIcon, locationIcon].forEach((icon) => {
	icon.scale.set(iconScale, iconScale, iconScale);
      });

      avatar.scene.position.set(0.40, -0.45, -1.25+2*Math.sin(elapsed/3));
      currentPhoto += delta/5;
      photoMaterial.map = gallery[Math.round(currentPhoto) % gallery.length];

      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
  }
  start();
});
