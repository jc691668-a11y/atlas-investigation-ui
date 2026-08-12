import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
const index=await readFile("public/index.html","utf8");
for(const locale of ["en","zh"]){
  await mkdir(`dist/${locale}`,{recursive:true});
  await writeFile(`dist/${locale}/index.html`,index.replace('<html lang="en">',`<html lang="${locale}">`));
}
await writeFile("dist/index.html",'<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/en/"><title>Atlas 天枢</title><a href="/en/">English</a> | <a href="/zh/">中文</a>');
console.log("Built bilingual static Vercel preview in dist/en/ and dist/zh/");
