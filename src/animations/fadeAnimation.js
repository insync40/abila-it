import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initFadeAnimation(element, options = {}) {
	const duration = options.duration || 1;
	const easing = options.easing || "ease-in-out";

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: element,
			start: "top 90%",
			toggleActions: "play none none none",
		},
		defaults: {
			delay: 0.2,
		},
	});

	tl.fromTo(
		element,
		{ opacity: 0, y: 50 },
		{
			opacity: 1,
			y: 0,
			duration: duration,
			ease: easing,
			delay: 0.4,
		}
	);

	gsap.set(element, { visibility: "visible" });
}
