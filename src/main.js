import gsap from "gsap";
import Lenis from "lenis";
import { initHeroRiveAnimation } from "./animations/heroRiveAnimation.js";
import { initServiceHomeAnimation } from "./animations/serviceHome.js";
import { initCircleAnimation } from "./animations/circleAnimation.js";
import { initFadeAnimation } from "./animations/fadeAnimation.js";
import { initHomeHeroAnimation } from "./animations/homeHeroAnimation.js";
import { initMethodSecondAnimation } from "./animations/methodSecondAnimation.js";
import { autoInitPricingToggle } from "./utils/pricingToggle.js";
import { initRocketRiveAnimation } from "./animations/rocketRiveAnimation.js";
import { initBentoBlackAnimation } from "./animations/bentoBlackAnimation.js";
import { initBentoWhiteAnimation } from "./animations/bentoWhiteAnimation.js";
import { initNavbarThemeSwitcher } from "./animations/navbarThemeSwitcher.js";
import { initClientSliderAnimation } from "./animations/clientSlider.js";
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
	// Home
	initHomeHeroAnimation();
	initHeroRiveAnimation();
	initRocketRiveAnimation();
	initServiceHomeAnimation();
	initMethodHomeAnimation();
	initCircleAnimation();
	initClientSliderAnimation();
	initBentoWhiteAnimation();
	initBentoBlackAnimation();
	initMethodSecondAnimation();
	autoInitPricingToggle();
	initNavbarThemeSwitcher();

	// fade animation
	const fadeElements = gsap.utils.toArray("[data-animation='fade-in']");
	fadeElements.forEach((element) => {
		initFadeAnimation(element, { duration: 1, easing: "power2.out" });
	});
});
