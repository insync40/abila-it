import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rive, Layout, Fit, Alignment } from "@rive-app/webgl2";

gsap.registerPlugin(ScrollTrigger);

export function initMethodSecondAnimation() {
	const section = document.querySelector(".method_2_wrap");
	const rSource = document.querySelector("#methodRiveSrc");
	if (!section) return;

	gsap.context((self) => {
		let mm = gsap.matchMedia();
		mm.add("(min-width: 280px)", () => {
			const riveUrl = rSource?.dataset?.riveUrl;
			const stateMachine =
				rSource?.dataset?.riveStateMachine || "State Machine 1";

			if (!riveUrl) {
				console.error(
					"Missing Rive URL in #methodRiveSrc dataset (riveUrl)."
				);
				return;
			}

			const canvases = [
				{
					el: document.querySelector("#graphic_01"),
					artboard: "graphic_01",
				},
				{
					el: document.querySelector("#graphic_02"),
					artboard: "graphic_02",
				},
				{
					el: document.querySelector("#graphic_03"),
					artboard: "graphic_03",
				},
				{
					el: document.querySelector("#graphic_04"),
					artboard: "graphic_04",
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
							fit: Fit.Contain,
							alignment: Alignment.Center,
						}),
						isTouchScrollEnabled: true,
						onLoad: () => {
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
						start: "top center+=20%",
						end: "bottom center-=20%",
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
