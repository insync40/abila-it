import gsap from "gsap";
import Lenis from "lenis";
import "./performance.css"; // Import performance optimizations
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
import { lazyInitAnimation } from "./utils/lazyAnimation.js";
import { perfMonitor } from "./utils/performanceMonitor.js";

// Mark performance start
perfMonitor.mark("app-start");

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
	perfMonitor.mark("dom-ready");

	// Critical animations - init immediately
	initHomeAnimation(lenis);
	initNavbarThemeSwitcher();

	perfMonitor.mark("critical-animations-done");

	// High priority - init on next frame to avoid blocking initial render
	requestAnimationFrame(() => {
		initRocketAnimation();
		initHeroHomeAnimation();
		autoInitPricingToggle();

		perfMonitor.mark("high-priority-animations-done");
	});

	// Lazy load animations based on viewport proximity
	const serviceSection = document.querySelector(".main_service_wrap");
	if (serviceSection) {
		lazyInitAnimation(initServiceHomeAnimation, serviceSection);
	}

	const methodSection = document.querySelector(".method_home_wrap");
	if (methodSection) {
		lazyInitAnimation(() => initMethodHomeAnimation(), methodSection);
	}

	const percheSection = document.querySelector("[data-animation='perche']");
	if (percheSection) {
		lazyInitAnimation(initPercheHomeAnimation, percheSection);
	}

	const circleSection = document.querySelector(".circle_logos_inner");
	if (circleSection) {
		lazyInitAnimation(initCircleAnimation, circleSection);
	}

	const methodSecondSection = document.querySelector(
		"[data-animation='method-second']"
	);
	if (methodSecondSection) {
		lazyInitAnimation(initMethodSecondAnimation, methodSecondSection);
	}

	const bentoWhiteSection = document.querySelector(
		"[data-rive='bento-white']"
	);
	if (bentoWhiteSection) {
		lazyInitAnimation(initBentoWhiteAnimation, bentoWhiteSection);
	}

	const bentoBlackSection = document.querySelector(
		"[data-rive='bento-black']"
	);
	if (bentoBlackSection) {
		lazyInitAnimation(initBentoBlackAnimation, bentoBlackSection);
	}

	const ctaSection = document.querySelector("[data-animation='cta']");
	if (ctaSection) {
		lazyInitAnimation(initCtaAnimation, ctaSection);
	}

	// Fade animations - batch process with requestIdleCallback
	const fadeElements = gsap.utils.toArray("[data-animation='fade-in']");
	if (fadeElements.length > 0) {
		const initFadeAnimations = () => {
			fadeElements.forEach((element) => {
				initFadeAnimation(element, {
					duration: 1,
					easing: "power2.out",
				});
			});
			perfMonitor.mark("fade-animations-done");
		};

		if ("requestIdleCallback" in window) {
			requestIdleCallback(initFadeAnimations, { timeout: 2000 });
		} else {
			setTimeout(initFadeAnimations, 100);
		}
	}

	// Measure and report performance
	perfMonitor.measure(
		"time-to-critical",
		"app-start",
		"critical-animations-done"
	);
	perfMonitor.measure(
		"time-to-high-priority",
		"critical-animations-done",
		"high-priority-animations-done"
	);

	// Report after page is fully loaded
	window.addEventListener("load", () => {
		perfMonitor.mark("page-loaded");
		perfMonitor.measure("total-init-time", "app-start", "page-loaded");
		perfMonitor.report();
	});
});
