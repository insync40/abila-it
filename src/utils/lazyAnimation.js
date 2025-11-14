/**
 * Lazy load animations only when elements are near viewport
 * @param {Function} initFunction - The animation initialization function
 * @param {HTMLElement} element - The element to observe
 * @param {Object} options - IntersectionObserver options
 */
export function lazyInitAnimation(initFunction, element, options = {}) {
	if (!element) return;

	const defaultOptions = {
		rootMargin: "200px 0px", // Start loading 200px before entering viewport
		threshold: 0,
		...options,
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Use requestIdleCallback if available, otherwise requestAnimationFrame
				if ("requestIdleCallback" in window) {
					requestIdleCallback(() => {
						initFunction();
					});
				} else {
					requestAnimationFrame(() => {
						initFunction();
					});
				}
				observer.unobserve(entry.target);
			}
		});
	}, defaultOptions);

	observer.observe(element);
}
