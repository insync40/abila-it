import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rive, Layout, Fit, Alignment } from "@rive-app/webgl2";

gsap.registerPlugin(ScrollTrigger);

export function initRocketAnimation() {
	const section = document.querySelector(".main_hero_wrap");
	const rSource = section?.querySelector("#rocketRiveSrc");

	if (!section) return;

	gsap.context((self) => {
		let mm = gsap.matchMedia();

		mm.add("(min-width: 320px)", () => {
			const riveUrl = rSource?.dataset?.riveUrl;
			const stateMachine =
				rSource?.dataset?.riveStateMachine || "State Machine 1";

			if (!riveUrl) {
				console.error(
					"Missing Rive URL in #rocketRiveSrc dataset (riveUrl)."
				);
				return;
			}

			const canvases = [
				{
					el: document.querySelector("#rocket_glow"),
					artboard: "rocket_glow",
				},
			];

			const sm = stateMachine || undefined;

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
							fit: Fit.Cover,
							alignment: Alignment.Center,
						}),
						isTouchScrollEnabled: true,
						onLoad: () => {
							try {
								instance.resizeDrawingSurfaceToCanvas();
							} catch (e) {
								// ignore resize errors if API not available
								console.error("Rive resize error:", e);
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
									console.error(
										"Rive state machine input error:",
										e
									);
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
						start: "top bottom-=20%",
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
	});
}
