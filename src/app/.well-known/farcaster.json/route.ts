import { NextResponse } from 'next/server';
import { getFarcasterDomainManifest } from '../../../lib/utils';

export async function GET() {
  try {
    const config = await getFarcasterDomainManifest();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return NextResponse.json({
      "accountAssociation": {
        "header": process.env.FARCASTER_HEADER,
        "payload": process.env.FARCASTER_PAYLOAD,
        "signature": process.env.FARCASTER_SIGNATURE
      },
      "frame": {
        "version": "1",
        "name": "SpeedKeys",
        "iconUrl": "https://speedkeys-theta.vercel.app/icon.png",
        "homeUrl": "https://speedkeys-theta.vercel.app",
        "imageUrl": "https://speedkeys-theta.vercel.app/image.png",
        "buttonTitle": "Launch Mini App",
        "splashImageUrl": "https://speedkeys-theta.vercel.app/splash.png",
        "splashBackgroundColor": "#eeccff",
        "webhookUrl": "https://speedkeys-theta.vercel.app/api/webhook"
      }
    });
  }
}
