import { RiveAnimationManager } from "../utils/riveAnimationManager";

const riveManager = new RiveAnimationManager({
	debounceDelay: 250,
});

export function initRiveAnimation() {
	const rSource = document.querySelector("#homeRiveSrc");

	riveManager.registerAnimationSet("floatingcardhero_1", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "floatingcardhero_1",
				artboard: "floatingcardhero_1",
			},
		],
	});
	riveManager.registerAnimationSet("floatingcardhero_2", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "floatingcardhero_2",
				artboard: "floatingcardhero_2",
			},
		],
	});
	riveManager.registerAnimationSet("floatingcardhero_3", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "floatingcardhero_3",
				artboard: "floatingcardhero_3",
			},
		],
	});
	riveManager.registerAnimationSet("homebentowhite_01", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "homebentowhite_01",
				artboard: "homebentowhite_01",
			},
		],
	});
	riveManager.registerAnimationSet("homebentowhite_02", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "homebentowhite_02",
				artboard: "homebentowhite_02",
			},
		],
	});
	riveManager.registerAnimationSet("homebentowhite_03", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "homebentowhite_03",
				artboard: "homebentowhite_03",
			},
		],
	});
	riveManager.registerAnimationSet("homebentowhite_04", {
		riveUrl: rSource
			? rSource.dataset.riveUrl
			: "../assets/animations/insync-abila-homepage.riv",
		defaultStateMachine: "State Machine 1",
		defaultTrigger: "Play",
		canvasConfigs: [
			{
				canvasId: "homebentowhite_04",
				artboard: "homebentowhite_04",
			},
		],
	});

	riveManager.initAllAnimationSets();
}
