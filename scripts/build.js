import {cp,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
const index=await readFile('public/index.html','utf8');
for(const route of ['en','zh','demo/tier1','demo/investigation','demo/sensor-fae','demo/cto']){
  await mkdir(`dist/${route}`,{recursive:true});
  await writeFile(`dist/${route}/index.html`,index);
}
await writeFile('dist/index.html',index);
console.log('Built bilingual static Atlas frozen-baseline routes; no API or runner included.');
