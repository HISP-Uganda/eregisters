// fallow-ignore-file unused-file
/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: "app",
    pwa: { enabled: true },
    name: "eregisters",
    entryPoints: {
        app: "./src/App.tsx",
    },
};

module.exports = config;
