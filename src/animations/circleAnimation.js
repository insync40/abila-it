import gsap from "gsap";

export function initCircleAnimation() {
	const wrap = document.querySelector(".circle_logos_inner");

	if (!wrap) return;

	gsap.context((self) => {
		const circles = self.selector(".circle_logo");

		const positionCircles = () => {
			const wrapRect = wrap.getBoundingClientRect();
			const wrapCenterX = wrapRect.left + wrapRect.width / 2;
			const wrapCenterY = wrapRect.top + wrapRect.height / 2;
			const radius = Math.min(wrapRect.width, wrapRect.height) / 2;

			circles.forEach((circle, index) => {
				const angle = (index / circles.length) * Math.PI * 2;
				const x =
					wrapCenterX +
					radius * Math.cos(angle) -
					circle.offsetWidth / 2;
				const y =
					wrapCenterY +
					radius * Math.sin(angle) -
					circle.offsetHeight / 2;

				gsap.set(circle, {
					x: x - circle.getBoundingClientRect().left,
					y: y - circle.getBoundingClientRect().top,
				});
			});
		};

		positionCircles();

		const tl = gsap.timeline({
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
				rotation: 360,
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
				rotation: -360,
				transformOrigin: "50% 50%",
				ease: "none",
				duration: 60,
				repeat: -1,
			},
			0
		);

		window.addEventListener("resize", () => {
			positionCircles();
		});
	}, wrap);
}
