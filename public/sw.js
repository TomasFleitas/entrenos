if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let i={};const u=e=>n(e,c),r={module:{uri:c},exports:i,require:u};s[c]=Promise.all(a.map((e=>r[e]||u(e)))).then((e=>(t(...e),i)))}}define(["./workbox-07a7b4f2"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"0e877969ed110b9873ed4d90cc4a6831"},{url:"/_next/static/GRGEQJngH6lgPNU_HuQM6/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/GRGEQJngH6lgPNU_HuQM6/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/1071-9262a789cfb708a7.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/1907-b044dc577913258a.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/2126-5bf1a1adc1d26327.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/231-33392b8f7399de93.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/2383-a86f621accf11397.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/2531-603896aaaf5e9174.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/2586-c4ea56e26fdd261a.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/2843-ad8f1737faa05a89.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/3098-88a02547e9c52bee.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/3121-81fcf54dfe1dc776.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/3336-1ce4e9b95bd4e6b8.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/3956-41e4d4c637f0a896.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/3997-c606bcb77e536a4e.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/4122-6728f084c510231e.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/4236-990e0349902885bf.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/4909-e735aa8ba7a15d1c.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/5713-428db6af1c4e60e9.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/5f250d0e-24538a8d7f0cde8c.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/6260-4520ab88d7b0cbe6.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/6300-869dc042b17a69e1.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/6511-6b2676e09e02f152.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/7023-4eabf28c9258cea1.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/8390-4fc8b92eff226c28.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/8786-9fb39f8d1a7b3b47.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/898a4dad-ef9b4590290b4d64.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/9435-3c12bb49065e46f1.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/9868-d5957fe5cfe4d254.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(non-protected)/invite/page-c96ed1c01b675f26.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(non-protected)/layout-fae3e6bf8dcc5706.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(non-protected)/login/page-01123c5433feda1d.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(protected)/donations/page-08794e5eacdeab46.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(protected)/home/page-dff612fccde48381.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(protected)/layout-4dc7a7d6a1ee152b.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/(pages)/(protected)/profile/page-8fd5a8531788d31d.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(app)/layout-5bbc311a3c726892.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(public)/(landing)/page-83fb25cafcf012ff.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/(public)/layout-1a677a5c3a7bd041.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/_not-found/page-ac4e5df5ac0e96ee.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/app/layout-190821cb57e2e63d.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/dc112a36-dd72e56818520f67.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/fb215ee9-c3a2da55b52f999a.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/fd9d1056-dfc67d324827fa68.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/framework-08aa667e5202eed8.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/main-86321f44b66a9222.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/main-app-505362aca53d98bf.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-c1a4625f48295d60.js",revision:"GRGEQJngH6lgPNU_HuQM6"},{url:"/_next/static/css/343cec924a6e0444.css",revision:"343cec924a6e0444"},{url:"/_next/static/css/7e57e57514b58f30.css",revision:"7e57e57514b58f30"},{url:"/_next/static/css/afebd0b4f6a5a3bd.css",revision:"afebd0b4f6a5a3bd"},{url:"/_next/static/css/b6861da1fc7a5954.css",revision:"b6861da1fc7a5954"},{url:"/_next/static/css/c6c7fcc931f3f067.css",revision:"c6c7fcc931f3f067"},{url:"/_next/static/css/ca583f752667aabd.css",revision:"ca583f752667aabd"},{url:"/_next/static/css/df5fd85519e63ca8.css",revision:"df5fd85519e63ca8"},{url:"/_next/static/css/f1b5333e253490cb.css",revision:"f1b5333e253490cb"},{url:"/_next/static/media/05a31a2ca4975f99-s.woff2",revision:"f1b44860c66554b91f3b1c81556f73ca"},{url:"/_next/static/media/513657b02c5c193f-s.woff2",revision:"c4eb7f37bc4206c901ab08601f21f0f2"},{url:"/_next/static/media/51ed15f9841b9f9d-s.woff2",revision:"bb9d99fb9bbc695be80777ca2c1c2bee"},{url:"/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",revision:"74c3556b9dad12fb76f84af53ba69410"},{url:"/_next/static/media/d6b16ce4a6175f26-s.woff2",revision:"dd930bafc6297347be3213f22cc53d3e"},{url:"/_next/static/media/ec159349637c90ad-s.woff2",revision:"0e89df9522084290e01e4127495fae99"},{url:"/_next/static/media/fd4db3eb5472fc27-s.woff2",revision:"71f3fcaf22131c3368d9ec28ef839831"},{url:"/firebase-messaging-sw.js",revision:"320ec3a9edd7cad9f11c67db047bdf5f"},{url:"/manifest.json",revision:"d21b4e4412dfca5b475d02c0ac4e7d6c"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
