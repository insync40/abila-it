import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadRiveFile } from "../utils/loadRiveFile";
import { setupRiveInstance } from "../utils/setupRiveInstance";

gsap.registerPlugin(ScrollTrigger);

export function initServicePageAnimation() {
	const rSource = document.querySelector("#servicesRiveSrc");

	gsap.context(() => {
		let mm = gsap.matchMedia();

		mm.add("(min-width: 320px)", () => {
			const riveUrl = rSource?.dataset?.riveUrl;

			if (!riveUrl) {
				console.error(
					"Missing Rive URL in #servicesRiveSrc dataset (riveUrl)."
				);
				return;
			}

			loadRiveFile(riveUrl, (file) => {
				setupRiveInstance(
					file,
					"bentoblack_01",
					"bentoblack_01",
					"State Machine 1"
				);
				setupRiveInstance(
					file,
					"bentoblack_02",
					"bentoblack_02",
					"State Machine 1"
				);
				setupRiveInstance(
					file,
					"bentoblack_03",
					"bentoblack_03",
					"State Machine 1"
				);
				setupRiveInstance(
					file,
					"bentowhite_01",
					"bentowhite_01",
					"State Machine 1"
				);
				setupRiveInstance(
					file,
					"bentowhite_02",
					"bentowhite_02",
					"State Machine 1"
				);
				setupRiveInstance(
					file,
					"bentowhite_03",
					"bentowhite_03",
					"State Machine 1"
				);
			});
		});
	});
}
