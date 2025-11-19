import { loadRiveFile } from "../utils/loadRiveFile";
import { setupRiveInstance } from "../utils/setupRiveInstance";

function initRiveHome() {
    const heroRiveUrl = "https://abila-it.vercel.app/rive/insync-abila-homepage.riv";
    

    loadRiveFile(
        heroRiveUrl,
        (file) => {
            setupRiveInstance(file, "floatingcardhero_01", "floatingcardhero_01", "State Machine 1");
            setupRiveInstance(file, "floatingcardhero_02", "floatingcardhero_02", "State Machine 1");
            setupRiveInstance(file, "floatingcardhero_03", "floatingcardhero_03", "State Machine 1");
            setupRiveInstance(file, "homebentowhite_01", "homebentowhite_01", "State Machine 1");
            setupRiveInstance(file, "homebentowhite_02", "homebentowhite_02", "State Machine 1");
            setupRiveInstance(file, "homebentowhite_03", "homebentowhite_03", "State Machine 1");
            setupRiveInstance(file, "homebentowhite_04", "homebentowhite_04", "State Machine 1");
        },
        (error) => {
            console.error("Failed to load Rive file:", error);
        }
    );
}

export { initRiveHome };