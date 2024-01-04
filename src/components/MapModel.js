import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import modelPath from "../media/map.gltf";
import CenterCamera from "@mui/icons-material/CenterFocusStrong";


import Movement from "./Movement";

function MapModel() {
	const containerRef = useRef();
	const cameraRef = useRef();

	// Constants for zoom and speed
	const minZoom = 7;
	const maxZoom = 15;
	const zoomSpeed = 0.002;

	// Create scene, camera, and renderer
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Create a simple plane geometry and material
	const geometry = new THREE.PlaneGeometry(15, 10);
	const material = new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		side: THREE.DoubleSide,
	});
	const plane = new THREE.Mesh(geometry, material);
	scene.add(plane);

	// Set up initial camera position and save its reference
	camera.position.set(0, 0, 15);
	cameraRef.current = camera;

	// Function to reset camera position
	const resetCamera = () => {
		if (!cameraRef.current) return;

		cameraRef.current.position.set(0, 0, 15); // Set default position
		cameraRef.current.lookAt(0, 0, 0); // Look at the center of the scene
		renderer.render(scene, cameraRef.current); // Re-render the scene
	};

	// useEffect to load model and set up the scene
	useEffect(() => {
		containerRef.current.appendChild(renderer.domElement);

		const loader = new GLTFLoader();
		loader.load(
			modelPath,
			(gltf) => {
				const model = gltf.scene;

				// Log to check if model is loaded
				console.log("Model loaded:", model);

				// Check if the model has children (geometry/meshes)
				if (model.children.length === 0) {
					console.error("No children found in the model");
					return;
				}

				// Add model to the scene and set properties
				scene.add(model);
				model.rotation.y = 3.14;
				model.rotation.x = 1.55;
				model.position.set(0, 0, 0);
				model.scale.set(0.25, 0.25, 0.25);

				// Set camera position based on model bounds
				const box = new THREE.Box3().setFromObject(model);
				const sphere = new THREE.Sphere();
				box.getBoundingSphere(sphere);
				const center = sphere.center;
				const radius = sphere.radius;
				camera.position.set(center.x, center.y, center.z + radius * 2);
				camera.lookAt(center);
				renderer.render(scene, camera);

				document.addEventListener("keydown", handleKeyDown);
			},

			undefined,
			(error) => {
				console.error("Error loading model:", error);
				document.removeEventListener("keydown", handleKeyDown);
			},
		);

		// Add lights to the scene
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(0, 1, 0); // Adjust light direction
		scene.add(directionalLight);
	}, [modelPath]);

	// Function to handle zooming
	const handleZoom = (event) => {
		if (!cameraRef.current) return;

		const delta = event.deltaY;
		const zoomAmount = delta * zoomSpeed;

		// Calculate the new zoomed position within limits
		const newZoom = cameraRef.current.position.z - zoomAmount;
		const clampedZoom = THREE.MathUtils.clamp(newZoom, minZoom, maxZoom);

		cameraRef.current.position.z = clampedZoom;
		renderer.render(scene, cameraRef.current);
	};

	// Function to handle horizontal movement using arrow keys
	let movementInterval = null;
	let singleKeyPressMovement = false;

	const handleKeyDown = (event) => {
		const moveSpeed = 0.2;
		const maxMovement = 1;
		let maxLeft = 0.5;
		let maxRight = 0.5;
		const zoomedMaxLeft = 3;
		const zoomedMaxRight = 3;

		// Get the current zoom level of the camera
		const currentZoom = cameraRef.current.position.z;
		console.log("Current Zoom:", currentZoom);

		if (currentZoom < 10.5) {
			maxLeft = zoomedMaxLeft;
			maxRight = zoomedMaxRight;
		}

		clearInterval(movementInterval);

		if (event.repeat) {
			singleKeyPressMovement = false;
			return;
		}

		singleKeyPressMovement = true;

		const moveCamera = () => {
			if (
				event.key === "ArrowLeft" &&
				cameraRef.current.position.x > -maxLeft
			) {
				cameraRef.current.position.x -= moveSpeed;
			} else if (
				event.key === "ArrowRight" &&
				cameraRef.current.position.x < maxRight
			) {
				cameraRef.current.position.x += moveSpeed;
			} else if (
				event.key === "ArrowUp" &&
				currentZoom < 10.5 &&
				cameraRef.current.position.y < maxMovement
			) {
				cameraRef.current.position.y += moveSpeed;
			} else if (
				event.key === "ArrowDown" &&
				currentZoom < 10.5 &&
				cameraRef.current.position.y > -maxMovement
			) {
				cameraRef.current.position.y -= moveSpeed;
			} else {
				clearInterval(movementInterval);
			}
			renderer.render(scene, cameraRef.current);
		};

		moveCamera();

		movementInterval = setInterval(() => {
			if (singleKeyPressMovement) {
				moveCamera();
			}
		}, 16); // Adjust the interval delay for smoother continuous movement
	};

	const handleKeyUp = () => {
		clearInterval(movementInterval);
		singleKeyPressMovement = false;
	};

	// Function to handle click events and trigger handleKeyDown with specific keys
	const handleClick = (key) => {
		handleKeyDown({ key }); // Trigger handleKeyDown with an object containing the specific key
	};

	// Add event listeners
	useEffect(() => {
		// Add event listeners when the component is mounted
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
		document.addEventListener("click", handleClick);
		containerRef.current.addEventListener("wheel", handleZoom);

		// Remove event listeners when the component is unmounted
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("keyup", handleKeyUp);
			document.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<div
			style={{
				backgroundColor: "red",
				minWidth: "1000px",
				position: "relative",
			}}
			ref={containerRef}
			onWheel={handleZoom}
			onKeyDown={handleKeyDown}
		>
			<div
				style={{
					position: "absolute",
					backgroundColor: "white",
					zIndex: "50",
					top: 50,
					left: 80,
					cursor: "pointer",
					borderRadius: "5px",
					boxShadow: "0px 0px 5px 3px rgba(0,0,0,0.75)",
				}}
				onClick={resetCamera}
			>
				<div
					style={{
						width: "90%",
						display: "flex",
						justifyContent: "flex-start",
						alignItems: "center",
					}}
				>
					<Tooltip title="Reset Camera" placement="bottom">
						<IconButton sx={{ transform: "scale(1.4)" }}>
							<CenterCamera />
						</IconButton>
					</Tooltip>
				</div>
			</div>
			<div
				style={{
					position: "absolute",
					backgroundColor: "white",
					zIndex: "50",
					top: 50,
					right: 80,
					borderRadius: "5px",
					width: "11vh",
				}}
			><Movement/></div>
		</div>
	);
}

export default MapModel;
