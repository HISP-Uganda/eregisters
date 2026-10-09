// A plain TCP proxy localhost:<port> -> the DHIS2 instance, so the browser sees a secure context (see config.mjs).
//   node e2e/support/proxy.mjs            (Playwright starts it when E2E_DHIS2_URL isn't localhost or https)
import net from "node:net";
import { config } from "../config.mjs";

const target = new URL(config.dhis2Url);
const port = Number(target.port || 80);
net.createServer((client) => {
    const upstream = net.connect(port, target.hostname);
    client.pipe(upstream).pipe(client);
    const close = () => {
        client.destroy();
        upstream.destroy();
    };
    client.on("error", close);
    upstream.on("error", close);
}).listen(config.proxyPort, "127.0.0.1", () =>
    console.log(`proxy http://localhost:${config.proxyPort} -> ${config.dhis2Url}`),
);
