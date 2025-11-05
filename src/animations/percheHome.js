import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rive } from "@rive-app/webgl2";

gsap.registerPlugin(ScrollTrigger);

export function initPercheHomeAnimation() {
	const section = document.querySelector(".work_wrap");
	const rSource = document.querySelector("#homeRiveSrc");

	if (!section) return;

	gsap.context(() => {
		let mm = gsap.matchMedia();

		mm.add("(min-width: 320px)", () => {
			const riveUrl = rSource?.dataset?.riveUrl;
			const stateMachine =
				rSource?.dataset?.riveStateMachine ||
				rSource?.dataset?.stateMachine;

			if (!riveUrl) {
				console.error(
					"Missing Rive URL in #homeRiveSrc dataset (riveUrl)."
				);
				return;
			}

			const canvases = [
				{
					el: document.querySelector("#featureswhite_01"),
					artboard: "featureswhite_01",
				},
				{
					el: document.querySelector("#featureswhite_02"),
					artboard: "featureswhite_02",
				},
				{
					el: document.querySelector("#featureswhite_03"),
					artboard: "featureswhite_03",
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
