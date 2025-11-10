import gsap from "gsap";
import Lenis from "lenis";
import { initHeroHomeAnimation } from "./animations/heroHome.js";
import { initServiceHomeAnimation } from "./animations/serviceHome.js";
import { initPercheHomeAnimation } from "./animations/percheHome.js";
import { initCtaAnimation } from "./animations/ctaAnimation.js";
import { initMethodHomeAnimation } from "./animations/methodHome.js";
import { initCircleAnimation } from "./animations/circleAnimation.js";
import { initFadeAnimation } from "./animations/fadeAnimation.js";
import { initHomeAnimation } from "./animations/homeAnimation.js";
import { initMethodSecondAnimation } from "./animations/methodSecondAnimation.js";
import { autoInitPricingToggle } from "./utils/pricingToggle.js";
import { initRocketAnimation } from "./animations/rocketAnimation.js";
import { initBentoBlackAnimation } from "./animations/bentoBlackAnimation.js";
import { initBentoWhiteAnimation } from "./animations/bentoWhiteAnimation.js";
import { initNavbarThemeSwitcher } from "./animations/navbarThemeSwitcher.js";

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
	initHomeAnimation(lenis);
	initRocketAnimation();
	initHeroHomeAnimation();
	initServiceHomeAnimation();
	initMethodHomeAnimation();
	initPercheHomeAnimation();
	initCircleAnimation();
	initMethodSecondAnimation();
	autoInitPricingToggle();
	initBentoWhiteAnimation();
	initBentoBlackAnimation();
	// initServicePageAnimation();
	initCtaAnimation();
	initNavbarThemeSwitcher();

	// fade animation
	const fadeElements = gsap.utils.toArray("[data-animation='fade-in']");
	fadeElements.forEach((element) => {
		initFadeAnimation(element, { duration: 1, easing: "power2.out" });
	});
});
