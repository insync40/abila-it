/**
 * Performance monitoring utilities
 * Helps track and optimize page performance
 */

export class PerformanceMonitor {
	constructor() {
		this.marks = {};
		this.measures = {};
	}

	// Mark a performance point
	mark(name) {
		if (window.performance && window.performance.mark) {
			performance.mark(name);
			this.marks[name] = performance.now();
		}
	}

	// Measure between two marks
	measure(name, startMark, endMark) {
		if (window.performance && window.performance.measure) {
			try {
				performance.measure(name, startMark, endMark);
				const measure = performance.getEntriesByName(name)[0];
				this.measures[name] = measure.duration;
				return measure.duration;
			} catch (e) {
				console.warn("Performance measure failed:", e);
			}
		}
		return null;
	}

	// Report all measures
	report() {
		if (process.env.NODE_ENV === "development") {
			console.group("Performance Report");
			Object.entries(this.measures).forEach(([name, duration]) => {
				console.log(`${name}: ${duration.toFixed(2)}ms`);
			});
			console.groupEnd();
		}
	}

	// Track Long Tasks (requires PerformanceObserver)
	trackLongTasks() {
		if ("PerformanceObserver" in window) {
			try {
				const observer = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (entry.duration > 50) {
							console.warn(
								`Long task detected: ${entry.duration.toFixed(
									2
								)}ms`,
								entry
							);
						}
					}
				});
				observer.observe({ entryTypes: ["longtask"] });
			} catch (e) {
				// Long task API not supported
			}
		}
	}

	// Track Layout Shifts (CLS)
	trackLayoutShifts() {
		if ("PerformanceObserver" in window) {
			try {
				let cls = 0;
				const observer = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (!entry.hadRecentInput) {
							cls += entry.value;
							if (entry.value > 0.1) {
								console.warn(
									`Layout shift detected: ${entry.value.toFixed(
										4
									)}`,
									entry
								);
							}
						}
					}
				});
				observer.observe({ entryTypes: ["layout-shift"] });

				// Report CLS on page unload
				window.addEventListener("beforeunload", () => {
					console.log(`Total CLS: ${cls.toFixed(4)}`);
				});
			} catch (e) {
				// Layout shift API not supported
			}
		}
	}

	// Track First Input Delay (FID)
	trackFirstInputDelay() {
		if ("PerformanceObserver" in window) {
			try {
				const observer = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						const fid = entry.processingStart - entry.startTime;
						console.log(`First Input Delay: ${fid.toFixed(2)}ms`);
					}
				});
				observer.observe({ entryTypes: ["first-input"] });
			} catch (e) {
				// FID API not supported
			}
		}
	}
}

// Export singleton instance
export const perfMonitor = new PerformanceMonitor();

// Auto-track in development
if (process.env.NODE_ENV === "development") {
	perfMonitor.trackLongTasks();
	perfMonitor.trackLayoutShifts();
	perfMonitor.trackFirstInputDelay();
}
