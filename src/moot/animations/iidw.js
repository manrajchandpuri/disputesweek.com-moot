// Loads the Claude Design visual kit in order. Each script attaches itself to window.IIDW,
// so the engine must run before the hero and the legacy section.
import "./vendor/iidw-engine.js";
import "./vendor/iidw-hero.js";
import "./vendor/iidw-legacy.js";

export default window.IIDW;
