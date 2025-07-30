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
        "payload": "eyJkb21haW4iOiJzcGVlZGtleXMueHl6In0",
        "signature": "MHhkZmViZmRlYjEzMzZjOWY0MTc4YTljYjcwMWUxOTVjYzVkYjQyNzkxZmFjY2Y4YzMwOWFmYmZkOThjNmFhMTQxNzkyYmZmMjE4OTIxNDhkNWY4MTAzZjQ2ZTFhYjcwNGU2MmZkOGY3ZGJmZDlmY2I3ZTY3MDc2ZDJjY2M4MWRmOTFi"
      },
      "frame": {
        "version": "1",
        "name": "SpeedKeys",
        "iconUrl": "https://speedkeys.xyz/icon.png",
        "homeUrl": "https://speedkeys.xyz",
        "imageUrl": "https://speedkeys.xyz/image.png",
        "buttonTitle": "Launch Mini App",
        "splashImageUrl": "https://speedkeys.xyz/splash.png",
        "splashBackgroundColor": "#eeccff",
        "webhookUrl": "https://speedkeys.xyz/api/webhook"
      }
    });
  }
}
