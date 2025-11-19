import gsap from "gsap";

export function initCircleAnimation() {
	const wrap = document.querySelector(".circle_logos_inner");

	if (!wrap) return;

	gsap.context((self) => {
		const circles = self.selector(".circle_logo");

		let mm = gsap.matchMedia();

		mm.add("(min-width: 992px)", () => {
			// Cache calculations
			const circlesArray = Array.from(circles);
			const circleCount = circlesArray.length;
			const angleStep = (Math.PI * 2) / circleCount;

			const positionCircles = () => {
				const wrapRect = wrap.getBoundingClientRect();
				const wrapCenterX = wrapRect.left + wrapRect.width / 2;
				const wrapCenterY = wrapRect.top + wrapRect.height / 2;
				const radius = Math.min(wrapRect.width, wrapRect.height) / 2;

				circlesArray.forEach((circle, index) => {
					const angle = index * angleStep;
					const circleRect = circle.getBoundingClientRect();
					const halfWidth = circle.offsetWidth / 2;
					const halfHeight = circle.offsetHeight / 2;

					const x =
						wrapCenterX + radius * Math.cos(angle) - halfWidth;
					const y =
						wrapCenterY + radius * Math.sin(angle) - halfHeight;

					gsap.set(circle, {
						x: x - circleRect.left,
						y: y - circleRect.top,
						force3D: true, // Hardware acceleration
					});
				});
			};

			positionCircles();

			// Add will-change hint
			gsap.set(wrap, { willChange: "transform" });
			gsap.set(circles, { willChange: "transform" });

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: wrap,
					start: "top bottom",
					end: "bottom top",
					invalidateOnRefresh: true,
					fastScrollEnd: true, // Performance optimization
					preventOverlaps: true, // Performance optimization
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
					force3D: true, // Hardware acceleration
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
					force3D: true, // Hardware acceleration
				},
				0
			);

			// Debounced resize handler
			let resizeTimer;
			const handleResize = () => {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					positionCircles();
				}, 150);
			};

			window.addEventListener("resize", handleResize, { passive: true });

			return () => {
				tl.kill();
				// Remove will-change after animation
				gsap.set([wrap, ...circles], { willChange: "auto" });
				window.removeEventListener("resize", handleResize);
				clearTimeout(resizeTimer);
			};
		});
	}, wrap);
}
