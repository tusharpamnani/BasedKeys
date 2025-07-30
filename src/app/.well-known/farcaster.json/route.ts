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
        "payload": "eyJkb21haW4iOiJzcGVlZGtleXMuZmFyY2FzdGVyLnh5eiJ9",
        "signature": "MHhhNDI3ZDEwMjYyMmZhMGM5NTdjNjI3NTZjMTU0ZmFmM2M3M2I0YzEzZTY4MjhiNjZlOGUyNDQyNDU3OWQ2YWI3NmQzYjZlYmU0ZjU5YzM3MjA5MDE3MjlhOTU4NjJlY2FjY2NkYzIzOTZjMGViZDFlOTMxOWRlZTg2NjAwYjMwOTFj"
      },
      "frame": {
        "version": "1",
        "name": "SpeedKeys",
        "iconUrl": "https://speedkeys.farcaster.xyz/icon.png",
        "homeUrl": "https://speedkeys.farcaster.xyz",
        "imageUrl": "https://speedkeys.farcaster.xyz/image.png",
        "buttonTitle": "Launch Mini App",
        "splashImageUrl": "https://speedkeys.farcaster.xyz/splash.png",
        "splashBackgroundColor": "#eeccff",
        "webhookUrl": "https://speedkeys.farcaster.xyz/api/webhook"
      }
    });
  }
}
