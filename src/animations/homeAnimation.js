import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { debounce } from "../utils/debounce.js";

gsap.registerPlugin(ScrollTrigger);

export function initHomeAnimation(lenis) {
	const section = document.querySelector(".main_hero_wrap");

	if (!section) return;

	// ensure the page is on top on load
	lenis.scrollTo(0, { immediate: true });

	gsap.context((self) => {
		const headerWrap = section.querySelector(".main_hero_head_wrap");
		const visualWrap = section.querySelector(".main_hero_visual_wrap");
		const rocketEl = section.querySelector(".main_hero_visual_rocket_wrap");
		const galaxyVisual = section.querySelector(".hero_bg_galaxy");

		const cards = gsap.utils.toArray("[data-animation]", section);
		const trigger = section.querySelector("[data-trigger]");

		// Cache layout values
		let visualWrapCenter = 0;
		let cardCenters = [];

		// Batch read all layout properties
		const updateLayoutCache = () => {
			// Use RAF to ensure we're reading after any pending layout changes
			requestAnimationFrame(() => {
				const visualRect = visualWrap.getBoundingClientRect();
				visualWrapCenter = visualRect.left + visualRect.width / 2;

				// Cache all card positions at once
				cardCenters = cards.map((card) => {
					const rect = card.getBoundingClientRect();
					return rect.left + rect.width / 2;
				});
			});
		};

		// Initial cache
		updateLayoutCache();

		// Debounced resize handler to prevent layout thrashing
		const debouncedUpdate = debounce(() => {
			updateLayoutCache();
			ScrollTrigger.refresh();
		}, 250);

		window.addEventListener("resize", debouncedUpdate);

		let mm = gsap.matchMedia();

		mm.add(
			{
				desktop: "(min-width: 992px)",
				mobile: "(max-width: 991px)",
			},
			(context) => {
				let { desktop, mobile } = context.conditions;
				const rocketAnim = gsap.to(rocketEl, {
					keyframes: {
						yPercent: [0, -10, 10, -10, 0],
						ease: "none",
					},
					duration: 10,
					repeat: -1,
					paused: true,
				});

				if (desktop) {
					gsap.set(trigger, { height: "100svh" });

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: section,
							start: "clamp(top top)",
							endTrigger: visualWrap,
							end: "clamp(top top)",
							scrub: true,
						},
						defaults: { ease: "none" },
					});

					tl.to(headerWrap, {
						y: "80vh",
						scale: 0.8,
						autoAlpha: 0,
						ease: "none",
						transformOrigin: "top center",
					});

					const secondTl = gsap.timeline({
						scrollTrigger: {
							trigger: visualWrap,
							start: "clamp(center center)",
							endTrigger: trigger,
							end: "clamp(bottom bottom)",
							scrub: true,
							pin: true,
							pinSpacing: false,
							invalidateOnRefresh: true,
							onEnter: () => {
								rocketAnim.play();
							},
							onLeave: () => {
								if (rocketAnim) rocketAnim.pause();
							},
							onEnterBack: () => {
								rocketAnim.play();
							},
							onLeaveBack: () => {
								if (rocketAnim) rocketAnim.pause();
							},
						},
						defaults: {
							overwrite: "auto",
						},
					});

					cards.forEach((card, i) => {
						secondTl.fromTo(
							card,
							{
								x: 0,
								scale: 1,
								// autoAlpha: 1,
								transformOrigin: "center bottom",
							},
							{
								x: () => {
									// Use cached values instead of reading layout
									return visualWrapCenter - cardCenters[i];
								},
								scale: 0,
								// autoAlpha: 0,
								ease: "none",
							},
							0
						);
					});

					const thirdTl = gsap.timeline({
						scrollTrigger: {
							trigger: section,
							start: "clamp(top top)",
							end: "clamp(bottom top)",
							scrub: true,
						},
					});

					thirdTl.to(
						galaxyVisual,
						{
							backgroundPosition: "50% -50%",
							ease: "none",
						},
						0
					);
				}
				// end dekstop
			}
		);

		// Cleanup
		return () => {
			window.removeEventListener("resize", debouncedUpdate);
		};
	}, section);
}
