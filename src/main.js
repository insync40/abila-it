import gsap from "gsap";

console.log("🚀 Webflow Custom Code Loaded");

// Your GSAP animations and custom code here
gsap.from([".hero-title", ".hero-title + p"], {
	opacity: 0,
	y: 50,
	duration: 1,
	ease: "power3.out",
});
