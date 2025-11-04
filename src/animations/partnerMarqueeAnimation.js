import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initPartnerMarqueeAnimation() {
	const section = document.querySelector(".partner_wrap");

	if (!section) return;

	gsap.context((self) => {
		const marqueeGroup = self.selector(".partner_marquee_group");

		// create x setter for each marquee group
		const setX = gsap.quickSetter(".marquee_group", "x", "px");

		ScrollTrigger.create({
			trigger: section,
			start: "top bottom",
			end: "bottom top",
			onUpdate: (self) => {
				const progress = self.progress;
				const velocityFactor = Math.min(
					Math.abs(self.getVelocity()) / 1000,
					3
				);

				marqueeGroup.forEach((group, index) => {
					const direction = index % 2 === 0 ? 1 : -1; // alternate direction
					const speed = 50 + Math.random() * 30; // random speed between 50-80
					setX(-totalWidth * progress * velocityFactor * direction);
				});
			},
			scrub: true,
		});
	}, section);
}
