/* R36 tracking plumbing. Mandatory on every portfolio site, and NO OP SAFE.
 *
 * - GTM container GTM-WZJZTSKG, head snippet as high in <head> as Next allows, plus the body
 *   <noscript> iframe immediately after the opening <body>. The id is a single constant in
 *   src/data/links.ts so it can change per project.
 * - GA4 is delivered THROUGH that container using the shared measurement property, so
 *   himaystudio.com and every portfolio subdomain roll up into one dashboard. No gtag snippet is
 *   hardcoded here on purpose, the container owns it.
 * - Meta Pixel is client side and reads NEXT_PUBLIC_META_PIXEL_ID from the Cloudflare Pages
 *   environment. The server side CAPI counterpart lives in functions/api/meta-events.ts and
 *   shares an eventID with the client for dedup.
 * - When the env vars are ABSENT everything no ops: the build never fails, the Pixel is simply
 *   not injected, and the Pages Function returns 204. Nothing here throws, nothing blocks render.
 */

import Script from 'next/script';
import { TRACKING } from '@/data/links';

export function GtmHead() {
  if (!TRACKING.gtmId) return null;
  /* R36 asks for the container "as high as possible in <head>". `beforeInteractive` is what puts it
     in the INITIAL HTML rather than injecting it after hydration, which is the difference between a
     container that sees the first pageview and one that misses it on a slow connection. It is only
     valid in the root layout, which is where this is rendered. */
  return (
    <Script id="gtm-head" strategy="beforeInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TRACKING.gtmId}');`}
    </Script>
  );
}

export function GtmNoScript() {
  if (!TRACKING.gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${TRACKING.gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

export function MetaPixel() {
  /* an absent env var means the whole block is skipped. This is the no op path. */
  if (!TRACKING.metaPixelId) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${TRACKING.metaPixelId}');
(function(){
  /* the shared eventID is what dedups the client Pixel hit against the server CAPI hit */
  var id = 'pv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  fbq('track','PageView',{},{eventID:id});
  try {
    fetch('${TRACKING.capiEndpoint}', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event_name:'PageView', event_id:id, event_source_url: location.href }),
      keepalive: true
    }).catch(function(){});
  } catch (e) { /* never throw, never block render */ }
})();`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${TRACKING.metaPixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
