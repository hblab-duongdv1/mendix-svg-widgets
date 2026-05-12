/** @type {import("jest").Config} */
module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.spec.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: {
                    target: "ES2019",
                    module: "commonjs",
                    moduleResolution: "node",
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true
                }
            }
        ]
    }
};
