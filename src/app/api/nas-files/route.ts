import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export const revalidate = 0; // Prevent caching so newly added NAS files appear instantly

export async function GET() {
  try {
    const nasUrl = process.env.NEXT_PUBLIC_APACHE_MEDIA_URL;
    if (!nasUrl) {
      return NextResponse.json({ error: 'NAS Media URL environment variable missing' }, { status: 500 });
    }

    // Fetch the raw index HTML page generated automatically by Apache
    const response = await fetch(nasUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch directory layout index from NAS server`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const links = dom.window.document.querySelectorAll('a');
    
    const videoFiles: string[] = [];

    links.forEach((link) => {
      const href = link.getAttribute('href');
      // Filter out folder navigation links and grab standard video extensions
      if (href && (href.endsWith('.mp4') || href.endsWith('.mkv') || href.endsWith('.webm'))) {
        videoFiles.push(decodeURIComponent(href));
      }
    });

    return NextResponse.json({ files: videoFiles }, { status: 200 });
  } catch (error: any) {
    console.error('NAS Scraper Pipeline Failure:', error);
    return NextResponse.json({ error: 'Could not parse media files from your NAS web folder' }, { status: 500 });
  }
}
