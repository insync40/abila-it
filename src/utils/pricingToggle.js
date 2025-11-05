const DISCOUNT = 0.2;

// Selectors used in markup
const ROOT_SELECTOR = ".pricing_component";
const TOGGLE_WRAP_SELECTOR = ".pricing_toggle_wrap";
const TOGGLE_BTN_SELECTOR = ".pricing_toggle_btn";
const BULLET_SELECTOR = ".pricing_toggle_bullet";
const CARD_SELECTOR = ".pricing_item";
const PRICE_TAG_SELECTOR = '[data-card="price-tag"]';
const PRICE_DETAIL_SELECTOR = ".pricing_info_detail";
const NOTES_SELECTOR = ".pricing_notes";

function parsePrice(str) {
	if (!str) return 0;
	const cleaned = String(str)
		.replace(/\s/g, "")
		.replace(/[^\d.,-]/g, "");
	if (cleaned.indexOf(",") > -1 && cleaned.indexOf(".") > -1) {
		if (cleaned.lastIndexOf(".") > cleaned.lastIndexOf(",")) {
			return parseFloat(cleaned.replace(/,/g, ""));
		} else {
			return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
		}
	}
	if (cleaned.indexOf(",") > -1 && cleaned.indexOf(".") === -1) {
		const parts = cleaned.split(",");
		if (parts[1] && parts[1].length <= 2) {
			return parseFloat(parts.join("."));
		} else {
			return parseFloat(cleaned.replace(/,/g, ""));
		}
	}
	return parseFloat(cleaned.replace(/[^\d.-]/g, "")) || 0;
}

function formatPrice(num, symbol = "$") {
	const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
	return `${symbol}${nf.format(Math.round(num))}`;
}

function currencyFromPrice(raw) {
	const trimmed = String(raw || "").trim();
	const m = trimmed.match(/[^0-9\s.,-]/);
	return m ? m[0] : "$";
}

/* Simple tween function (uses GSAP when available) */
function tweenNumber(
	from,
	to,
	duration = 0.6,
	onUpdate = () => {},
	onComplete = () => {}
) {
	if (window.gsap && window.gsap.to) {
		const proxy = { val: from };
		window.gsap.to(proxy, {
			val: to,
			duration,
			ease: "power2.out",
			roundProps: "val",
			onUpdate: () => onUpdate(proxy.val),
			onComplete,
		});
		return;
	}

	const steps = Math.max(12, Math.round(30 * duration));
	let currentStep = 0;
	const delta = (to - from) / steps;
	const interval = (duration * 1000) / steps;
	let val = from;
	const tid = setInterval(() => {
		currentStep++;
		val += delta;
		if (currentStep >= steps) {
			clearInterval(tid);
			onUpdate(Math.round(to));
			onComplete();
		} else {
			onUpdate(Math.round(val));
		}
	}, interval);
}

/* -------------------------
   Core: initPricingToggle
   ------------------------- */

function initPricingToggle(root = document) {
	const pricingRoot =
		root instanceof Element ? root : document.querySelector(ROOT_SELECTOR);
	if (!pricingRoot) {
		console.warn("initPricingToggle: pricing root not found.");
		return null;
	}

	const toggleWrap = pricingRoot.querySelector(TOGGLE_WRAP_SELECTOR);
	const toggleBtn = pricingRoot.querySelector(TOGGLE_BTN_SELECTOR);
	const bullet = pricingRoot.querySelector(BULLET_SELECTOR);
	const notes = pricingRoot.querySelector(NOTES_SELECTOR);
	const cards = Array.from(pricingRoot.querySelectorAll(CARD_SELECTOR));

	if (!toggleWrap || !toggleBtn || !bullet || cards.length === 0) {
		console.warn(
			"initPricingToggle: required elements missing (toggleWrap/toggleBtn/bullet/cards)."
		);
		return null;
	}

	// Prepare card pricing data and references
	cards.forEach((card) => {
		const priceTag = card.querySelector(PRICE_TAG_SELECTOR);
		const detailEl = card.querySelector(PRICE_DETAIL_SELECTOR);
		const rawPrice = priceTag ? priceTag.textContent : "";
		const currency = currencyFromPrice(rawPrice);
		const monthly = parsePrice(rawPrice);
		const yearlyRaw = monthly * 12;
		const yearlyDiscounted = yearlyRaw * (1 - DISCOUNT);
		const annualPerMonth = yearlyDiscounted / 12;

		card._pricing = {
			monthly,
			currency,
			yearlyRaw,
			yearlyDiscounted,
			annualPerMonth,
			priceTag,
			detailEl,
		};
	});

	// internal state
	let state = toggleWrap.getAttribute("data-state");
	if (state !== "annual" && state !== "monthly") {
		state = "monthly";
		toggleWrap.setAttribute("data-state", state);
	}

	// Apply a state to the current pricingRoot
	function applyState(newState) {
		if (newState === state) return;
		const isAnnual = newState === "annual";

		cards.forEach((card) => {
			const {
				monthly,
				currency,
				yearlyDiscounted,
				annualPerMonth,
				priceTag,
				detailEl,
			} = card._pricing;

			const targetMonthly = isAnnual ? annualPerMonth : monthly;
			const targetTotalText = isAnnual
				? `Totale ${formatPrice(
						yearlyDiscounted,
						currency
				  )} al pagamento`
				: `Totale ${formatPrice(monthly * 12, currency)} al pagamento`;

			// animate priceTag numeric value
			if (priceTag) {
				const starting =
					parsePrice(priceTag.textContent) ||
					Math.round(isAnnual ? monthly : annualPerMonth);
				tweenNumber(starting, Math.round(targetMonthly), 0.6, (val) => {
					priceTag.textContent = formatPrice(val, currency);
				});
			}

			// update detail text
			if (detailEl) detailEl.textContent = targetTotalText;
		});

		// toggle notes visibility using a class to let CSS handle display
		if (notes) {
			if (isAnnual) notes.classList.add("is-active");
			else notes.classList.remove("is-active");
		}

		// set data-state so existing CSS that targets [data-state="..."] works
		toggleWrap.setAttribute("data-state", newState);

		state = newState;
	}

	// Toggle state
	function toggle() {
		const next =
			toggleWrap.getAttribute("data-state") === "annual"
				? "monthly"
				: "annual";
		applyState(next);
	}

	// click handler
	const onToggleClick = () => toggle();
	toggleBtn.addEventListener("click", onToggleClick);

	// label clicks (optional): first <p> Annual, last <p> Monthly
	const toggleContainer = pricingRoot.querySelector(".pricing_toggle");
	const labelListeners = [];
	if (toggleContainer) {
		const labels = Array.from(toggleContainer.querySelectorAll("p"));
		if (labels.length >= 2) {
			const onAnnual = () => applyState("annual");
			const onMonthly = () => applyState("monthly");
			labels[0].addEventListener("click", onAnnual);
			labels[labels.length - 1].addEventListener("click", onMonthly);
			labelListeners.push(
				{ el: labels[0], fn: onAnnual },
				{ el: labels[labels.length - 1], fn: onMonthly }
			);
		}
	}

	// Immediately apply to normalize UI
	applyState(toggleWrap.getAttribute("data-state"));

	// Return controller object
	const controller = {
		applyState,
		toggle,
		getState: () => state,
		destroy: () => {
			toggleBtn.removeEventListener("click", onToggleClick);
			labelListeners.forEach(({ el, fn }) =>
				el.removeEventListener("click", fn)
			);
			// remove stored pricing data to avoid leaks
			cards.forEach((card) => {
				delete card._pricing;
			});
		},
		_cards: cards,
		_root: pricingRoot,
	};

	// Expose controller on the wrapper for debugging if desired
	toggleWrap._pricingController = controller;

	return controller;
}

function autoInitPricingToggle() {
	function run() {
		const roots = document.querySelectorAll(ROOT_SELECTOR);
		roots.forEach((rootEl) => {
			// avoid double-init
			if (!rootEl._pricingController) {
				initPricingToggle(rootEl);
			}
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", run);
	} else {
		run();
	}
}

export { initPricingToggle, autoInitPricingToggle };
