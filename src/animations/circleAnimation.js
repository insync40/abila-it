import gsap from "gsap";
import { debounce } from "../utils/debounce.js";

export function initCircleAnimation() {
	const wrap = document.querySelector(".circle_logos_inner");

	if (!wrap) return;

	gsap.context((self) => {
		const circles = self.selector(".circle_logo");

		let mm = gsap.matchMedia();

		mm.add("(min-width: 992px)", () => {
			let tl = null;

			const positionCircles = () => {
				// Batch all reads first, then all writes
				requestAnimationFrame(() => {
					// READ phase - batch all layout reads
					const wrapRect = wrap.getBoundingClientRect();
					const wrapCenterX = wrapRect.left + wrapRect.width / 2;
					const wrapCenterY = wrapRect.top + wrapRect.height / 2;
					const radius =
						Math.min(wrapRect.width, wrapRect.height) / 2;

					const positions = [];
					circles.forEach((circle, index) => {
						const angle = (index / circles.length) * Math.PI * 2;
						const circleRect = circle.getBoundingClientRect();
						positions.push({
							x:
								wrapCenterX +
								radius * Math.cos(angle) -
								circleRect.width / 2,
							y:
								wrapCenterY +
								radius * Math.sin(angle) -
								circleRect.height / 2,
							left: circleRect.left,
							top: circleRect.top,
						});
					});

					// WRITE phase - batch all DOM writes
					requestAnimationFrame(() => {
						circles.forEach((circle, index) => {
							const pos = positions[index];
							gsap.set(circle, {
								x: pos.x - pos.left,
								y: pos.y - pos.top,
							});
						});
					});
				});
			};

			positionCircles();

			tl = gsap.timeline({
				scrollTrigger: {
					trigger: wrap,
					start: "top bottom",
					end: "bottom top",
					invalidateOnRefresh: true,
					onEnter: () => tl.play(),
					onLeave: () => tl.pause(),
					onEnterBack: () => tl.play(),
					onLeaveBack: () => tl.pause(),
				},
				paused: true,
			});

			tl.to(
				wrap,
				{
					rotation: -360,
					transformOrigin: "50% 50%",
					ease: "none",
					duration: 60,
					repeat: -1,
				},
				0
			);

			tl.to(
				circles,
				{
					rotation: 360,
					transformOrigin: "50% 50%",
					ease: "none",
					duration: 60,
					repeat: -1,
				},
				0
			);

			// Debounced resize handler
			const debouncedResize = debounce(() => {
				positionCircles();
			}, 250);

			window.addEventListener("resize", debouncedResize);

			return () => {
				if (tl) tl.kill();
				window.removeEventListener("resize", debouncedResize);
			};
		});
	}, wrap);
}
