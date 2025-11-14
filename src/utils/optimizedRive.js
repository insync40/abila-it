/**
 * Optimized Rive instance initialization
 * Batches resize operations and defers heavy operations
 */

export function createOptimizedRiveInstance(config) {
	const {
		src,
		canvas,
		stateMachines,
		artboard,
		layout,
		onReady = () => {},
		onError = () => {},
	} = config;

	const instance = new (require("@rive-app/webgl2").Rive)({
		src,
		canvas,
		stateMachines,
		artboard,
		autoplay: false,
		layout,
		isTouchScrollEnabled: true,
		onLoad: () => {
			// Use requestIdleCallback for non-critical resize operations
			const performResize = () => {
				requestAnimationFrame(() => {
					try {
						instance.resizeDrawingSurfaceToCanvas();

						// Fire state machine play trigger if exists
						if (stateMachines) {
							try {
								const inputs =
									instance.stateMachineInputs(stateMachines);
								const playTrigger = inputs?.find(
									(i) => i.name === "play"
								);
								if (
									playTrigger &&
									typeof playTrigger.fire === "function"
								) {
									playTrigger.fire();
								}
							} catch (e) {
								console.warn(
									"Rive state machine input error:",
									e
								);
							}
						}

						onReady(instance);
					} catch (e) {
						console.warn("Rive resize error:", e);
					}
				});
			};

			if ("requestIdleCallback" in window) {
				requestIdleCallback(performResize, { timeout: 500 });
			} else {
				setTimeout(performResize, 0);
			}
		},
		onLoadError: (err) => {
			console.error("Rive loading error:", err);
			onError(err);
		},
	});

	return instance;
}

/**
 * Batch multiple Rive instance resizes
 */
export function batchRiveResizes(instances) {
	if (!instances || instances.length === 0) return;

	requestAnimationFrame(() => {
		instances.forEach((instance) => {
			if (
				instance &&
				typeof instance.resizeDrawingSurfaceToCanvas === "function"
			) {
				try {
					instance.resizeDrawingSurfaceToCanvas();
				} catch (e) {
					// Silently ignore resize errors
				}
			}
		});
	});
}
