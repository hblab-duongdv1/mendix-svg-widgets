/**
 * svg.js measures text via getBBox; jsdom omits it on SVG nodes.
 * Loaded before widget unit tests (see widgets/charts/jest.config.cjs).
 */
if (typeof SVGElement !== "undefined" && !SVGElement.prototype.getBBox) {
    SVGElement.prototype.getBBox = function getBBoxPolyfill() {
        return { x: 0, y: 0, width: 0, height: 0, bottom: 0, left: 0, right: 0, top: 0, toJSON: () => ({}) };
    };
}

if (typeof ResizeObserver === "undefined") {
    global.ResizeObserver = class ResizeObserverPolyfill {
        constructor(callback) {
            this.callback = callback;
        }
        observe() {
            this.callback([], this);
        }
        unobserve() {}
        disconnect() {}
    };
}
