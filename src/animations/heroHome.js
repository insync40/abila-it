import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Alignment, Fit, Layout, Rive } from "@rive-app/webgl2";

gsap.registerPlugin(ScrollTrigger);

export function initHeroHomeAnimation() {
	const section = document.querySelector(".main_hero_wrap");
	const rSource = document.querySelector("#homeRiveSrc");

	if (!section) return;

	gsap.context(() => {
		let mm = gsap.matchMedia();

		mm.add("(min-width: 992px)", () => {
			const riveUrl = rSource?.dataset?.riveUrl;
			const stateMachine =
				rSource?.dataset?.riveStateMachine || "State Machine 1";

			if (!riveUrl) {
				console.error(
					"Missing Rive URL in #homeRiveSrc dataset (riveUrl)."
				);
				return;
			}

			const canvases = [
				{
					el: document.querySelector("#floatingcardhero_01"),
					artboard: "floatingcardhero_01",
				},
				{
					el: document.querySelector("#floatingcardhero_02"),
					artboard: "floatingcardhero_02",
				},
				{
					el: document.querySelector("#floatingcardhero_03"),
					artboard: "floatingcardhero_03",
				},
			];

			const sm = stateMachine || undefined;

			// Initialize Rive for all canvases
			const riveInstances = [];

			canvases.forEach(({ el, artboard }) => {
				if (!el) return;

				try {
					const instance = new Rive({
						src: riveUrl,
						canvas: el,
						stateMachines: sm,
						artboard,
						autoplay: false,
						layout: new Layout({
							fit: Fit.Contain,
							alignment: Alignment.Center,
						}),
						isTouchScrollEnabled: true,
						onLoad: () => {
							// resize and trigger "Play" if state machine has it
							try {
								instance.resizeDrawingSurfaceToCanvas();
							} catch (e) {
								// ignore resize errors if API not available
							}

							if (sm) {
								try {
									const inputs =
										instance.stateMachineInputs(sm);
									const playTrigger =
										inputs &&
										inputs.find((i) => i.name === "play");
									if (
										playTrigger &&
										typeof playTrigger.fire === "function"
									) {
										playTrigger.fire();
									}
								} catch (e) {
									// ignore state machine input errors
								}
							}
						},
						onLoadError: (err) => {
							console.error("Rive loading error:", err);
						},
					});

					riveInstances.push(instance);

					const handlePlay = () => {
						instance.play();
					};

					const handlePause = () => {
						instance.pause();
					};

					ScrollTrigger.create({
						trigger: el,
						start: "top bottom",
						end: "bottom top",
						onEnter: handlePlay,
						onLeave: handlePause,
						onEnterBack: handlePlay,
						onLeaveBack: handlePause,
					});
				} catch (err) {
					console.error("Failed to create Rive instance:", err);
				}
			});

			// cleanup when this media query is torn down
			return () => {
				riveInstances.forEach((inst) => {
					try {
						// try common cleanup methods if present
						if (typeof inst.destroy === "function") inst.destroy();
						else if (typeof inst.cleanup === "function")
							inst.cleanup();
						else if (typeof inst.stop === "function") inst.stop();
						// null reference for GC
						inst = null;
					} catch (e) {
						// swallow cleanup errors
					}
				});
			};
		});
	}, section);
}

// export function initHeroHomeAnimation() {
// 	const section = document.querySelector(".main_hero_wrap");
// 	const rSource = document.querySelector("#homeRiveSrc");

// 	if (!section) return;

// 	gsap.context(() => {
// 		let mm = gsap.matchMedia();

// 		mm.add("(min-width: 992px)", () => {
// 			const riveUrl = rSource?.dataset?.riveUrl;

// 			if (!riveUrl) {
// 				console.error(
// 					"Missing Rive URL in #homeRiveSrc dataset (riveUrl)."
// 				);
// 				return;
// 			}

// 			loadRiveFile(
// 				riveUrl,
// 				(file) => {
// 					setupRiveInstance(
// 						file,
// 						"floatingcardhero_01",
// 						"floatingcardhero_01",
// 						"State Machine 1"
// 					);
// 					setupRiveInstance(
// 						file,
// 						"floatingcardhero_02",
// 						"floatingcardhero_02",
// 						"State Machine 1"
// 					);
// 					setupRiveInstance(
// 						file,
// 						"floatingcardhero_03",
// 						"floatingcardhero_03",
// 						"State Machine 1"
// 					);
// 				},
// 				(error) => {
// 					console.error("Failed to load Rive file:", error);
// 				}
// 			);
// 		});
// 	}, section);
// }
