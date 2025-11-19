import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHomeHeroAnimation() {
	const section = document.querySelector(".main_hero_wrap");

	if (!section) return;

	gsap.context(() => {
		const headerWrap = section.querySelector(".main_hero_head_wrap");
		const visualWrap = section.querySelector(".main_hero_visual_wrap");
		const rocketEl = section.querySelector(".main_hero_visual_rocket_wrap");
		const galaxyVisual = section.querySelector(".hero_bg_galaxy");

		const cards = gsap.utils.toArray(
			".main_hero_visual_status_wrap, .main_hero_visual_problems_wrap, .main_hero_visual_payment_wrap",
			section
		);
		const trigger = section.querySelector("[data-trigger]");

		// Performance optimization: Hint browser about changes
		gsap.set([headerWrap, rocketEl, ...cards], { willChange: "transform" });
		if (galaxyVisual) {
			gsap.set(galaxyVisual, { willChange: "background-position" });
		}

		let mm = gsap.matchMedia();

		mm.add(
			{
				desktop: "(min-width: 992px)",
				mobile: "(max-width: 991px)",
			},
			(context) => {
				let { desktop } = context.conditions;

				const rocketAnim = gsap.to(rocketEl, {
					keyframes: {
						yPercent: [0, -10, 10, -10, 0],
						ease: "none",
					},
					duration: 10,
					repeat: -1,
					paused: true,
					force3D: true,
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
						force3D: true,
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

					cards.forEach((card) => {
						secondTl.fromTo(
							card,
							{
								x: 0,
								scale: 1,
								transformOrigin: "center bottom",
							},
							{
								x: () => {
									const visualWrapCenter =
										visualWrap.getBoundingClientRect().left +
										visualWrap.offsetWidth / 2;
									const cardCenter =
										card.getBoundingClientRect().left +
										card.offsetWidth / 2;
									return visualWrapCenter - cardCenter;
								},
								scale: 0,
								ease: "none",
								force3D: true,
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

					if (galaxyVisual) {
						thirdTl.to(
							galaxyVisual,
							{
								backgroundPosition: "50% -50%",
								ease: "none",
							},
							0
						);
					}
				}
			}
		);
	}, section);
}
