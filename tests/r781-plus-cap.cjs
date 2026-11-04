const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
const src=fs.readFileSync('자동마킹.js','utf8');assert.ok(src.includes('R781 (owner 11/5')&&src.includes('Number(m.gmTs||0)>=260132&&m.marked'),'R781 cap present from round 132');
vm.runInContext(src.replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);
assert.ok(vm.runInContext('INDEX',c).includes('플핸 하루 3경기 제한'));console.log('r781 ok');
