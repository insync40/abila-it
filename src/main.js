import gsap from "gsap";
import { preloadImages } from "./utils/preloadImages";
import { initHeroHomeAnimation } from "./animations/heroHome.js";
import { initServiceHomeAnimation } from "./animations/serviceHome.js";
import { initPercheHomeAnimation } from "./animations/percheHome.js";
import { initCtaAnimation } from "./animations/ctaAnimation.js";
import Lenis from "lenis";
import { initMethodHomeAnimation } from "./animations/methodHome.js";
import { initCircleAnimation } from "./animations/circleAnimation.js";
import { initFadeAnimation } from "./animations/fadeAnimation.js";
import { initHomeAnimation } from "./animations/heroHomeAnimation.js";
import { initMethodSecondAnimation } from "./animations/methodSecondAnimation.js";

let lenis = new Lenis({
	lerp: 0.125,
	wheelMultiplier: 0.8,
	gestureOrientation: "vertical",
	normalizeWheel: false,
	smoothTouch: false,
	autoResize: true,
});

function raf(time) {
	lenis.raf(time);
	requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener("DOMContentLoaded", () => {
	initHeroHomeAnimation();
	initServiceHomeAnimation();
	initMethodHomeAnimation();
	initPercheHomeAnimation();
	initCircleAnimation();
	initHomeAnimation();
	initMethodSecondAnimation();

	// fade animation
	const fadeElements = gsap.utils.toArray("[data-animation='fade-in']");
	fadeElements.forEach((element) => {
		initFadeAnimation(element, { duration: 1, easing: "power2.out" });
	});
});
