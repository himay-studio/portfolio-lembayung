/**
 * R36, server side half: Meta Conversions API forwarder, running as a Cloudflare Pages Function.
 *
 * The client Pixel and this endpoint send the SAME `event_id`, which is what lets Meta dedup one
 * conversion reported twice. The client fires it from Analytics.tsx.
 *
 * NO OP SAFE, and this is the part that matters more than the feature. When `META_PIXEL_ID` or
 * `META_CAPI_ACCESS_TOKEN` is absent from the Pages environment this returns 204 and does
 * nothing. It never throws, it never fails the build, and it never blocks a render. A portfolio
 * site with no tracking secrets set must behave exactly like one with them set, minus the events.
 *
 * The env vars are set on the Pages project (R26 step 3), never committed.
 */

interface Env {
  META_PIXEL_ID?: string;
  META_CAPI_ACCESS_TOKEN?: string;
  /** optional, for Events Manager's test traffic view */
  META_TEST_EVENT_CODE?: string;
}

interface Incoming {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  /** already hashed on the client, or absent. This endpoint never receives raw PII. */
  user_data?: Record<string, string>;
  custom_data?: Record<string, unknown>;
}

const GRAPH = 'https://graph.facebook.com/v21.0';

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  /* the no op path: secrets absent, so there is nothing to forward and nothing to complain about */
  if (!env.META_PIXEL_ID || !env.META_CAPI_ACCESS_TOKEN) {
    return new Response(null, { status: 204 });
  }

  let body: Incoming = {};
  try {
    body = (await request.json()) as Incoming;
  } catch {
    /* a malformed payload is not worth a 500 on a tracking endpoint */
    return new Response(null, { status: 204 });
  }

  const eventName = body.event_name || 'PageView';
  if (!body.event_id) return new Response(null, { status: 204 });

  const ip = request.headers.get('cf-connecting-ip') || undefined;
  const ua = request.headers.get('user-agent') || undefined;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url,
        action_source: 'website',
        user_data: {
          ...(body.user_data || {}),
          ...(ip ? { client_ip_address: ip } : {}),
          ...(ua ? { client_user_agent: ua } : {}),
        },
        ...(body.custom_data ? { custom_data: body.custom_data } : {}),
      },
    ],
    ...(env.META_TEST_EVENT_CODE ? { test_event_code: env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    await fetch(`${GRAPH}/${env.META_PIXEL_ID}/events?access_token=${env.META_CAPI_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    /* a tracking failure is never a user facing failure */
  }

  return new Response(null, { status: 204 });
};

/** Anything other than POST is not an error worth surfacing either. */
export const onRequest = async (): Promise<Response> => new Response(null, { status: 204 });
