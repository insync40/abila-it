import { preloadImages } from "./utils/preloadImages";
import { initHeroHomeAnimation } from "./animations/heroHome.js";
import { initServiceHomeAnimation } from "./animations/serviceHome.js";
import { initPercheHomeAnimation } from "./animations/percheHome.js";
import { initCtaAnimation } from "./animations/ctaAnimation.js";
import Lenis from "lenis";
import { initMethodHomeAnimation } from "./animations/methodHome.js";

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
	initCtaAnimation();
});
