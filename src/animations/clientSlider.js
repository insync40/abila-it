import { gsap } from "gsap";

export function initClientSliderAnimation() {
	const sliderWrap = document.querySelector(".client_slider_component");

	if (!sliderWrap) return;

	const ctx = gsap.context((self) => {
		const swiperEl = sliderWrap.querySelector(".swiper.is-client");
		const paginationEl = sliderWrap.querySelector(".swiper-pagination");

		const swiperDescEl = sliderWrap.querySelector(".swiper.is-client-desc");

		const swiper = new Swiper(swiperEl, {
			slidesPerView: 1,
			spaceBetween: 24,
			pagination: {
				el: paginationEl,
				clickable: true,
			},
			speed: 800,
		});

		const swiperDesc = new Swiper(swiperDescEl, {
			slidesPerView: 1,
			spaceBetween: 24,
			speed: 800,
			allowTouchMove: false,
		});

		swiper.on("slideChange", () => {
			swiperDesc.slideTo(swiper.activeIndex);
		});
	}, sliderWrap);
}
