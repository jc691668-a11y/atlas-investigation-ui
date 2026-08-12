import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
const index=await readFile("public/index.html","utf8");
for(const role of ["tier1","investigation","sensor-fae","cto"]){
  await mkdir(`dist/demo/${role}`,{recursive:true});
  await writeFile(`dist/demo/${role}/index.html`,index);
}
await writeFile("dist/index.html",index);
console.log("Built static Atlas demo routes; no API or runner included.");
