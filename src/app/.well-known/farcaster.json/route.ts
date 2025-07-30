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
        iconUrl: `${URL}/icon.png`,
        homeUrl: `${URL}`,
        imageUrl: `${URL}/image.png`,
        buttonTitle: "Launch Mini App",
        splashImageUrl: `${URL}/splash.png`,
        splashBackgroundColor: "#eeccff",
        webhookUrl: `${URL}/api/webhook`,
      }),
    });
  }
