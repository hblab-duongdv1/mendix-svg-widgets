const { join } = require("path");

const base = require("@mendix/pluggable-widgets-tools/test-config/jest.config.js");
const projectDir = process.cwd();
const polyfill = join(__dirname, "../../tooling/svg-jsdom-polyfill.cjs");

module.exports = {
    ...base,
    rootDir: join(projectDir, "src"),
    setupFilesAfterEnv: [polyfill, ...(base.setupFilesAfterEnv || [])]
};
