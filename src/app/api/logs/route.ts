import { NextResponse } from 'next/server';
import { getLatestLogFile, parseLogFile } from '@/lib/parseLogFile';

const LOG_DIR = '/mnt/TS/docker-files/appdata/zigbee2mqtt/log';

export async function GET() {
  try {
    const latestLogFile = await getLatestLogFile(LOG_DIR);
    const logData = await parseLogFile(latestLogFile);
    
    return NextResponse.json(logData);
  } catch (error) {
    console.error('Error fetching log data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch log data' },
      { status: 500 }
    );
  }
}
