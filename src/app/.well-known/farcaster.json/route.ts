import { NextResponse } from 'next/server';
import { getFarcasterDomainManifest } from '../../../lib/utils';

function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;
    return NextResponse.json({
      accountAssociation: {
        header: process.env.FARCASTER_HEADER,
        payload: process.env.FARCASTER_PAYLOAD,
        signature: process.env.FARCASTER_SIGNATURE,
      },
      frame: withValidProperties({
        version: "1",
        name: "SpeedKeys",
        iconUrl: `https://github.com/tusharpamnani/BasedKeys/blob/main/public/icon.png`,
        homeUrl: `${URL}`,
        imageUrl: `https://github.com/tusharpamnani/BasedKeys/blob/main/public/icon.png`,
        buttonTitle: "Launch SpeedKeys",
        splashImageUrl: `https://github.com/tusharpamnani/BasedKeys/blob/main/public/splash.png`,
        splashBackgroundColor: "#eeccff",
      }),
    });
  }
