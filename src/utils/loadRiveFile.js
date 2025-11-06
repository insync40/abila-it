import { RiveFile } from "@rive-app/webgl2";

export function loadRiveFile(src, onSuccess, onError) {
	const file = new RiveFile({
		src: src,
		onLoad: () => onSuccess(file),
		onLoadError: onError,
	});
	// Remember to call init() to trigger the load;
	file.init().catch(onError);
}
