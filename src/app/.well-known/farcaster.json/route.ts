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
        "header": "eyJmaWQiOjExMzk4NjksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0YUU5NjYzRDA0MThFNzdFMTUxOEY3RUU4ZDk5ZjMyODlkNWZBNDdkIn0",
        "payload": "eyJkb21haW4iOiJzcGVlZGtleXMtdGhldGEudmVyY2VsLmFwcCJ9",
        "signature": "MHhiNWE3ZTk5OTczZWFmZjU3NzM2YjI2YzMwMmE4ZjY0NzBhNTZhNTZlYWExMjkwNGVlZDI5OTFmYzE2ZmE2MDdkNjNmMjg3NWMyYWY0NGNmZGNlMjg4OWU1ZWY0ZTZiNWU2MDFkODcyN2JhMjExZjk4MGEzZTY5MGEwMjAxNDJiZDFj"
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
