import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Rive } from "@rive-app/webgl2";

gsap.registerPlugin(ScrollTrigger);

export function initMethodHomeAnimation() {
	const section = document.querySelector(".method_home_wrap");
	const rSource = document.querySelector("#homeRiveSrc");
	let swiperInstance = null;

	if (!section) return;

	function initSwiper() {
		if (swiperInstance) {
			swiperInstance.destroy(true, true);
			swiperInstance = null;
		}

		swiperInstance = new Swiper(".swiper.is-method", {
			effect: "coverflow",
			direction: "horizontal",
			centeredSlides: true,
			initialSlide: 1,
			slidesPerView: "auto",
			spaceBetween: 48,
			allowTouchMove: true,
			speed: 1000,
			// loop: true,
			mousewheel: {
				forceToAxis: true,
				enabled: true,
				sensitivity: 0.25,
			},
			// navigation: {
			// 	nextEl: ".next",
			// 	prevEl: ".prev",
			// },
			coverflowEffect: {
				rotate: 0,
				stretch: 0,
				depth: 150,
				modifier: 1,
				slideShadows: false,
			},
		});
	}

	gsap.context((self) => {
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
					el: document.querySelector("#card_01"),
					artboard: "card_01",
				},
				{
					el: document.querySelector("#card_02"),
					artboard: "card_02",
				},
				{
					el: document.querySelector("#card_03"),
					artboard: "card_03",
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

		mm.add("(min-width: 992px)", () => {
			initSwiper();

			return () => {
				if (swiperInstance) {
					swiperInstance.destroy(true, true);
					swiperInstance = null;
				}
			};
		});
	}, section);
}
