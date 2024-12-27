import { readFile, readdir } from 'fs/promises';
import path from 'path';

export interface Device {
  id: string;
  name: string;
  type: string;
  model: string;
  deviceType: 'Router' | 'EndDevice';
  location: string;
}

export interface LogData {
  devices: Device[];
  timestamp: string;
  version: string;
  errors: string[];
}

export async function parseLogFile(filePath: string): Promise<LogData> {
  const content = await readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const devices: Device[] = [];
  const errors: string[] = [];
  let version = '';
  let timestamp = '';

  lines.forEach(line => {
    if (!line) return;

    const match = line.match(/\[(.*?)\]/);
    if (match) timestamp = match[1];

    if (line.includes('Starting Zigbee2MQTT version')) {
      version = line.match(/version (.*?) \(/)?.[1] || '';
    }

    if (line.includes('error:')) {
      errors.push(line);
    }

    if (line.includes('z2m:') && line.includes('-')) {
      const deviceMatch = line.match(/z2m: (.*?) \((.*?)\): (.*?) - (.*?) \((.*?)\)/);
      if (deviceMatch) {
        const [_, name, id, model, description, deviceType] = deviceMatch;
        const location = name.split('.')[1];
        
        devices.push({
          id,
          name,
          type: name.split('.')[0],
          model,
          deviceType: deviceType as 'Router' | 'EndDevice',
          location
        });
      }
    }
  });

  return {
    devices,
    timestamp,
    version,
    errors
  };
}

export async function getLatestLogFile(logDir: string): Promise<string> {
  const files = await readdir(logDir);
  const logFiles = files.filter(file => file.endsWith('.log'));
  return path.join(logDir, logFiles.sort().reverse()[0]);
}
