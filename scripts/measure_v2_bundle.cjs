// Match the documented budget: unique layout + route JS, gzip per file.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const manifest = JSON.parse(fs.readFileSync(".next/app-build-manifest.json"));
const chunks = [...new Set([...manifest.pages["/layout"], ...manifest.pages["/v2/page"]])].filter((file) => file.endsWith(".js"));
const files = chunks.map((file) => ({ path: file, raw: fs.statSync(path.join(".next", file)).size, gzip: zlib.gzipSync(fs.readFileSync(path.join(".next", file))).length }));
console.log(JSON.stringify({ definition: "Unique layout plus v2 route JavaScript chunks; gzip per file; excludes images, CSS, fonts and prefetches.", files, gzip_bytes: files.reduce((sum, file) => sum + file.gzip, 0), budget_bytes: 160000 }, null, 2));
