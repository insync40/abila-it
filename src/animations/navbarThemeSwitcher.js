import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initNavbarThemeSwitcher() {
	const navbar = document.querySelector(".nav_component");
	const sections = gsap.utils.toArray("section[class*='u-theme-light']");

	sections.forEach((section) => {
		ScrollTrigger.create({
			trigger: section,
			start: "top top",
			end: "bottom top",
			toggleClass: { targets: navbar, className: "u-theme-light" },
		});
	});
}
