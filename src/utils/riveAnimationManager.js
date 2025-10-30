// import Rive from "@rive-app/webgl2-advanced";
/**
 * Rive Animation Manager
 * A reusable system for managing multiple Rive animations across a website
 * with direct autoplay (no visibility-based triggering)
 */

export class RiveAnimationManager {
	constructor(options = {}) {
		this.instances = new Map();
		this.animationSets = new Map();
		this.debouncedResizeHandlers = new Set();

		// Configuration constants
		this.DEBOUNCE_DELAY = options.debounceDelay || 250; // ms

		// Removed visibility threshold and triggered animations tracking
	}

	/**
	 * Register a set of related Rive animations
	 * @param {String} setId - Unique identifier for this animation set
	 * @param {Object} config - Configuration for this animation set
	 */
	registerAnimationSet(setId, config) {
		if (this.animationSets.has(setId)) {
			console.warn(
				`Animation set "${setId}" already exists. Overwriting.`
			);
		}

		this.animationSets.set(setId, config);
		return this;
	}

	/**
	 * Initialize a specific animation set
	 * @param {String} setId - ID of the animation set to initialize
	 */
	initAnimationSet(setId) {
		if (!this.animationSets.has(setId)) {
			console.error(`Animation set "${setId}" not found.`);
			return this;
		}

		const config = this.animationSets.get(setId);
		const { riveUrl, canvasConfigs, defaultStateMachine, defaultTrigger } =
			config;

		canvasConfigs.forEach((canvasConfig) => {
			// Allow overriding defaults at the canvas level
			const stateMachine =
				canvasConfig.stateMachine || defaultStateMachine;
			const triggerName = canvasConfig.triggerName || defaultTrigger;

			this.initSingleAnimation({
				canvasId: canvasConfig.canvasId,
				riveUrl: riveUrl,
				artboard: canvasConfig.artboard,
				stateMachine: stateMachine,
				triggerName: triggerName,
				instanceId: `${setId}-${canvasConfig.canvasId}`, // Create unique instance ID
			});
		});

		return this;
	}

	/**
	 * Initialize all registered animation sets
	 */
	initAllAnimationSets() {
		this.animationSets.forEach((_, setId) => {
			this.initAnimationSet(setId);
		});
		return this;
	}

	/**
	 * Initialize a single Rive animation
	 * @param {Object} config - Configuration for this animation
	 */
	initSingleAnimation(config) {
		const {
			canvasId,
			riveUrl,
			artboard,
			stateMachine,
			triggerName,
			instanceId,
		} = config;
		const canvas = document.getElementById(canvasId);

		if (!canvas) {
			console.error(`Canvas element with ID "${canvasId}" not found.`);
			return;
		}

		try {
			// Configure Rive with autoplay true - animations will start immediately
			const riveInstance = new rive.Rive({
				src: riveUrl,
				canvas: canvas,
				autoplay: true, // Changed to true for direct autoplay
				artboard: artboard,
				stateMachines: [stateMachine],
				isTouchScrollEnabled: true,
				onLoad: () =>
					this._handleRiveLoaded(
						riveInstance,
						canvas,
						stateMachine,
						triggerName,
						instanceId
					),
				onLoadError: (err) =>
					console.error(`Failed to load Rive animation: ${err}`),
			});

			// Store the instance with its configuration for later reference
			this.instances.set(instanceId || canvasId, {
				instance: riveInstance,
				config: config,
			});

			return riveInstance;
		} catch (error) {
			console.error(`Error initializing Rive for "${canvasId}":`, error);
			return null;
		}
	}

	/**
	 * Handle successful Rive animation loading
	 * @private
	 */
	_handleRiveLoaded(
		riveInstance,
		canvas,
		stateMachine,
		triggerName,
		instanceId
	) {
		// Initial resize
		riveInstance.resizeDrawingSurfaceToCanvas();

		// Set up resize handling
		const handleResize = this._debounce(() => {
			if (riveInstance && !riveInstance.isDestroyed()) {
				riveInstance.resizeDrawingSurfaceToCanvas();
			}
		}, this.DEBOUNCE_DELAY);

		// Add event listeners
		window.addEventListener("resize", handleResize);
		const pixelRatioMatcher = window.matchMedia(
			`(resolution: ${window.devicePixelRatio}dppx)`
		);
		pixelRatioMatcher.addEventListener("change", handleResize);

		// Store cleanup function on the instance
		riveInstance._cleanup = () => {
			window.removeEventListener("resize", handleResize);
			pixelRatioMatcher.removeEventListener("change", handleResize);
			this.debouncedResizeHandlers.delete(handleResize);
		};

		this.debouncedResizeHandlers.add(handleResize);

		// Trigger the animation immediately after load (optional - since autoplay is true)
		// Uncomment if you want to fire a specific trigger after load
		this._triggerAnimation(riveInstance, stateMachine, triggerName);
	}

	/**
	 * Trigger the start of an animation manually (if needed)
	 * @private
	 */
	_triggerAnimation(riveInstance, stateMachine, triggerName) {
		try {
			const inputs = riveInstance.stateMachineInputs(stateMachine);
			const trigger = inputs.find((input) => input.name === triggerName);

			if (trigger) {
				trigger.fire();
			} else {
				console.warn(
					`Trigger "${triggerName}" not found in state machine "${stateMachine}".`
				);
			}
		} catch (error) {
			console.error("Error triggering animation:", error);
		}
	}

	/**
	 * Debounce function to limit the rate of function calls
	 * @private
	 */
	_debounce(func, wait) {
		let timeout;
		const debounced = (...args) => {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
		return debounced;
	}

	/**
	 * Clean up all Rive instances
	 */
	cleanup() {
		this.instances.forEach(({ instance }) => {
			if (instance._cleanup) {
				instance._cleanup();
			}
			if (!instance.isDestroyed()) {
				instance.stop();
			}
		});

		this.instances.clear();

		return this;
	}

	/**
	 * Get a specific Rive instance by its ID
	 * @param {String} instanceId - ID of the instance to retrieve
	 */
	getInstance(instanceId) {
		const item = this.instances.get(instanceId);
		return item ? item.instance : null;
	}
}
