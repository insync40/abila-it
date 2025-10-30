import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initCtaAnimation() {
	const section = document.querySelector(".cta_wrap");
	const rCtaSource = document.querySelector("#rCtaSource");

	if (!section) return;

	gsap.context(() => {
		let mm = gsap.matchMedia();

		mm.add("(min-width: 992px)", () => {
			const riveUrl = rCtaSource?.dataset?.riveUrl;
			const stateMachine =
				rCtaSource?.dataset?.riveStateMachine ||
				rCtaSource?.dataset?.stateMachine;

			if (!riveUrl) {
				console.error(
					"Missing Rive URL in #homeRiveSrc dataset (riveUrl)."
				);
				return;
			}

			const canvases = [
				{
					el: document.querySelector("#cta_glow"),
					artboard: "cta_glow",
				},
			];

			const sm = stateMachine || undefined;

			const riveInstances = [];

			canvases.forEach(({ el, artboard }) => {
				if (!el) return;

				try {
					const instance = new rive.Rive({
						src: riveUrl,
						canvas: el,
						stateMachines: sm,
						artboard,
						autoplay: true,
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
										ScrollTrigger.create({
											trigger: section,
											start: "top center",
											onEnter: () => {
												playTrigger.fire();
											},
										});
										// playTrigger.fire();
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
