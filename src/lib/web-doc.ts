/**
 * Builds the page shown in a live editor's preview, and the script that runs inside it.
 *
 * The preview is a sandboxed iframe (scripts allowed, but no access to this site), so learners' code
 * can't touch the platform. Inside it, a small script (SHIM) reports console output and errors to
 * the editor, switches off links and form submissions, gives localStorage a stand-in (a sandboxed
 * page isn't allowed the real one), and answers the checks that look at the rendered page.
 * Dependency-free so scripts/test-webtasks.mjs can load the same document in a real browser.
 */
import type { WebFiles } from "@/content/types";

export const BOOTSTRAP_CSS = "/vendor/bootstrap/bootstrap.min.css";
export const BOOTSTRAP_JS = "/vendor/bootstrap/bootstrap.bundle.min.js";

export const SHIM = [
  "(function(){",
  "var send=function(m){try{parent.postMessage(Object.assign({__ct:1},m),'*')}catch(e){}};",
  "function fmt(a){if(a===undefined)return 'undefined';if(typeof a==='string')return a;if(a instanceof Error)return a.name+': '+a.message;try{var s=JSON.stringify(a,function(k,v){return typeof v==='function'?'[Function]':v});return s===undefined?String(a):s}catch(e){return String(a)}}",
  "['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){send({type:'console',level:k,text:[].map.call(arguments,fmt).join(' ')});try{o.apply(console,arguments)}catch(e){}}});",
  "window.addEventListener('error',function(e){send({type:'console',level:'error',text:(e.message||'Error')+(e.lineno?' (line '+e.lineno+')':'')})});",
  "window.addEventListener('unhandledrejection',function(e){send({type:'console',level:'error',text:'Unhandled promise error: '+fmt(e.reason)})});",
  "['localStorage','sessionStorage'].forEach(function(n){try{window[n].getItem('x')}catch(e){var mem={};var st={getItem:function(k){return Object.prototype.hasOwnProperty.call(mem,k)?mem[k]:null},setItem:function(k,v){mem[k]=String(v)},removeItem:function(k){delete mem[k]},clear:function(){mem={}},key:function(i){return Object.keys(mem)[i]||null}};Object.defineProperty(st,'length',{get:function(){return Object.keys(mem).length}});try{Object.defineProperty(window,n,{value:st,configurable:true})}catch(e2){}}});",
  "document.addEventListener('submit',function(e){e.preventDefault();send({type:'note',text:'The preview does not send forms. Your JavaScript can still react to the submit.'})},true);",
  "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(h.charAt(0)==='#')return;e.preventDefault();send({type:'note',text:'Links are switched off in the preview: '+h})},true);",
  "function act(a){var el;if(a.click){el=document.querySelector(a.click);if(el)el.click()}else if(a.type){el=document.querySelector(a.type[0]);if(el){el.value=a.type[1];el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}}else if(a.submit){el=document.querySelector(a.submit);if(el){if(el.requestSubmit)el.requestSubmit();else el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))}}else if(a.key){el=document.querySelector(a.key[0]);if(el)el.dispatchEvent(new KeyboardEvent('keydown',{key:a.key[1],bubbles:true}))}else if(a.check){el=document.querySelector(a.check);if(el){el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}))}}}",
  "window.__ctProbe=function(rules){return rules.map(function(r){try{(r.act||[]).forEach(act);var els=[].slice.call(document.querySelectorAll(r.selector));var ok=els.length>=(r.min==null?1:r.min)&&(r.max==null||els.length<=r.max);if(ok&&r.style)ok=els.some(function(el){var cs=getComputedStyle(el);return Object.keys(r.style).every(function(p){return new RegExp(r.style[p],'i').test(cs.getPropertyValue(p))})});if(ok&&r.attr)ok=els.some(function(el){return Object.keys(r.attr).every(function(a){return new RegExp(r.attr[a],'i').test(el.getAttribute(a)||'')})});if(ok&&r.contains)ok=els.some(function(el){return new RegExp(r.contains,'i').test(el.textContent||'')});return ok}catch(e){return false}})};",
  "window.addEventListener('message',function(e){var d=e.data;if(d&&d.__ct==='probe')send({type:'probe',id:d.id,results:window.__ctProbe(d.rules||[]),page:document.body?document.body.innerText:''})});",
  "window.addEventListener('load',function(){setTimeout(function(){send({type:'ready'})},250)});",
  "})();",
].join("\n");

const inlineScript = (js: string) => `<script>${js.replace(/<\/script/gi, "<\\/script")}</script>`;
const isLocal = (url: string) => !/^(https?:)?\/\//i.test(url) && !/^data:/i.test(url);

/**
 * The full HTML document for the preview. The learner's HTML may be a fragment (just the body) or a
 * whole page. A <link> to a local stylesheet and a <script src> to a local script are replaced by the
 * CSS and JavaScript tabs, so a page written the way the lesson teaches works as it will on a real
 * site. Bootstrap's CDN links are replaced by the copy served by this site, so it works offline.
 */
export function buildDoc(files: WebFiles, opts: { bootstrap?: boolean; assetBase?: string } = {}): string {
  const base = opts.assetBase ?? "";
  let html = files.html ?? "";
  const css = files.css ?? "";
  const js = files.js ?? "";
  let usedCss = false;
  let usedJs = false;

  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
    const href = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
    if (/bootstrap/i.test(href) && !isLocal(href)) return tag.replace(href, () => base + BOOTSTRAP_CSS);
    if (!isLocal(href)) return tag;
    if (usedCss) return "";
    usedCss = true;
    return `<style>${css}</style>`;
  });
  html = html.replace(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/script>/gi, (tag, src: string) => {
    if (/bootstrap/i.test(src) && !isLocal(src)) return `<script src="${base + BOOTSTRAP_JS}"></script>`;
    if (!isLocal(src)) return tag;
    if (usedJs) return "";
    usedJs = true;
    return inlineScript(js);
  });

  const hasBootstrapCss = html.includes(BOOTSTRAP_CSS);
  const hasBootstrapJs = html.includes(BOOTSTRAP_JS);
  const bsCss = opts.bootstrap && !hasBootstrapCss ? `<link rel="stylesheet" href="${base + BOOTSTRAP_CSS}">` : "";
  const bsJs = opts.bootstrap && !hasBootstrapJs ? `<script src="${base + BOOTSTRAP_JS}"></script>` : "";
  const style = !usedCss && css ? `<style>${css}</style>` : "";
  const script = !usedJs && js ? inlineScript(js) : "";
  const shim = `<script>${SHIM}</script>`;

  if (/<html[\s>]|<!doctype/i.test(html)) {
    if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, (m) => `${m}${shim}${bsCss}`);
    else html = html.replace(/<html[^>]*>/i, (m) => `${m}<head>${shim}${bsCss}</head>`);
    html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, () => `${style}</head>`) : html + style;
    const tail = `${bsJs}${script}`;
    return /<\/body>/i.test(html) ? html.replace(/<\/body>/i, () => `${tail}</body>`) : html + tail;
  }
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${shim}${bsCss}${style}</head><body>${html}${bsJs}${script}</body></html>`;
}
