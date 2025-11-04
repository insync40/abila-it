import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initHomeAnimation() {
	const section = document.querySelector(".main_hero_wrap");

	if (!section) return;

	gsap.context((self) => {
		const headerWrap = self.selector(".main_hero_head_wrap");

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: "top top",
				end: "center top+=40%",
				scrub: true,
			},
			defaults: { ease: "none" },
		});

		tl.to(headerWrap, {
			yPercent: 200,
			scale: 0.8,
			autoAlpha: 0,
			ease: "none",
			transformOrigin: "top center",
		});
	}, section);
}
