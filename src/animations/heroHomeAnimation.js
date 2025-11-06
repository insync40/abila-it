import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHomeAnimation() {
	const section = document.querySelector(".main_hero_wrap");

	if (!section) return;

	gsap.context((self) => {
		const headerWrap = section.querySelector(".main_hero_head_wrap");
		const visualWrap = section.querySelector(".main_hero_visual_wrap");

		const cards = gsap.utils.toArray("[data-animation]", section);
		const trigger = section.querySelector("[data-trigger]");

		// get center of visualWrap
		const visualWrapCenter =
			visualWrap.getBoundingClientRect().left +
			visualWrap.offsetWidth / 2;

		let mm = gsap.matchMedia();

		mm.add(
			{
				desktop: "(min-width: 992px)",
				mobile: "(max-width: 991px)",
			},
			(context) => {
				let { desktop, mobile } = context.conditions;
				if (desktop) {
					gsap.set(trigger, { height: "100svh" });

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: section,
							start: "top top",
							endTrigger: visualWrap,
							end: "top top",
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
							start: "center center",
							endTrigger: trigger,
							end: "bottom bottom",
							scrub: true,
							pin: true,
							pinSpacing: false,
						},
					});

					cards.forEach((card, i) => {
						secondTl.fromTo(
							card,
							{
								x: 0,
								scale: 1,
								autoAlpha: 1,
								transformOrigin: "center bottom",
							},
							{
								x: () => {
									const cardCenter =
										card.getBoundingClientRect().left +
										card.offsetWidth / 2;
									return visualWrapCenter - cardCenter;
								},
								scale: 0,
								autoAlpha: 0,
								ease: "none",
							},
							"<"
						);
					});
				}
				// end dekstop
			}
		);
	}, section);
}
