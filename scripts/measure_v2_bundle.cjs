// Match the documented budget: unique layout + route JS, gzip per file.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const manifest = JSON.parse(fs.readFileSync(".next/app-build-manifest.json"));
const chunks = [...new Set([...manifest.pages["/layout"], ...manifest.pages["/v2/page"]])].filter((file) => file.endsWith(".js"));
const files = chunks.map((file) => ({ path: file, raw: fs.statSync(path.join(".next", file)).size, gzip: zlib.gzipSync(fs.readFileSync(path.join(".next", file))).length }));
const lazy = JSON.parse(fs.readFileSync(".next/react-loadable-manifest.json"));
const optionalChunks = Object.entries(lazy).find(([name]) => name.endsWith("-> @/components/v2/photo-surface"))?.[1].files || [];
const optionalFiles = optionalChunks.filter((file) => file.endsWith(".js") && !chunks.includes(file)).map((file) => ({ path: file, raw: fs.statSync(path.join(".next", file)).size, gzip: zlib.gzipSync(fs.readFileSync(path.join(".next", file))).length }));
const initialBytes = files.reduce((sum, file) => sum + file.gzip, 0);
const optionalBytes = optionalFiles.reduce((sum, file) => sum + file.gzip, 0);
console.log(JSON.stringify({ definition: "Unique layout plus v2 route JavaScript chunks; gzip per file; excludes images, CSS, fonts and prefetches. Optional Three.js chunks are reported separately and included in the combined total.", files, gzip_bytes: initialBytes, budget_bytes: 160000, optional_files: optionalFiles, optional_gzip_bytes: optionalBytes, with_optional_gzip_bytes: initialBytes + optionalBytes }, null, 2));
