import { preloadImages } from "./utils/preloadImages";
import { initHeroHomeAnimation } from "./animations/heroHome.js";
import { initServiceHomeAnimation } from "./animations/serviceHome.js";
import { initPercheHomeAnimation } from "./animations/percheHome.js";

document.addEventListener("DOMContentLoaded", () => {
	initHeroHomeAnimation();
	initServiceHomeAnimation();
	initPercheHomeAnimation();
});
