import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rive, Layout, Fit } from "@rive-app/webgl2";

gsap.registerPlugin(ScrollTrigger);

const riveInstances = [];

export function setupRiveInstance(
	loadedRiveFile,
	canvasId,
	artboard,
	stateMachine
) {
	const canvas = document.getElementById(canvasId);
	if (!canvas) return;

	const riveInstance = new Rive({
		riveFile: loadedRiveFile,
		// If you have multiple canvases,  either use @rive-app/canvas
		// or set useOffscreenRenderer to true.
		useOffscreenRenderer: true,
		stateMachines: stateMachine,
		canvas: canvas,
		artboard: artboard,
		layout: new Layout({
			fit: Fit.Cover,
		}),
		autoplay: false,
		onLoad: () => {
			riveInstance.resizeDrawingSurfaceToCanvas();
			if (stateMachine) {
				try {
					const inputs =
						riveInstance.stateMachineInputs(stateMachine);
					const playTrigger =
						inputs && inputs.find((i) => i.name === "play");
					if (playTrigger && typeof playTrigger.fire === "function") {
						playTrigger.fire();
					}
				} catch (e) {
					console.error("Rive state machine input error:", e);
				}
			}
		},
	});

	riveInstances.push(riveInstance);

	const handlePlay = () => {
		riveInstance.play();
	};

	const handlePause = () => {
		riveInstance.pause();
	};

	ScrollTrigger.create({
		trigger: canvas,
		start: "top bottom",
		end: "bottom top",
		onEnter: handlePlay,
		onLeave: handlePause,
		onEnterBack: handlePlay,
		onLeaveBack: handlePause,
	});
}

// // Example Usage:
// loadRiveFile(
// 	"rive's_animated_emojis.riv",
// 	(file) => {
// 		setupRiveInstance(file, "rive-canvas-1", "Mindblown", "controller");
// 		setupRiveInstance(file, "rive-canvas-2", "Bullseye", "controller");
// 		setupRiveInstance(file, "rive-canvas-3", "love", "controller");
// 		setupRiveInstance(file, "rive-canvas-4", "joy", "controller");
// 		setupRiveInstance(file, "rive-canvas-5", "Tada", "controller");
// 		setupRiveInstance(file, "rive-canvas-6", "Onfire", "controller");
// 	},
// 	(error) => {
// 		console.error("Failed to load Rive file:", error);
// 	}
// );

window.addEventListener(
	"resize",
	() => {
		riveInstances.forEach((instance) => {
			if (instance) {
				instance.resizeDrawingSurfaceToCanvas();
			}
		});
	},
	false
);
