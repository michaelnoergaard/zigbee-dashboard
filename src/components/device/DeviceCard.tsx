import React from 'react';
import { Device } from '@/lib/parseLogFile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PowerIcon, SignalIcon } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'lys':
        return <PowerIcon className="h-4 w-4" />;
      case 'motion':
        return <SignalIcon className="h-4 w-4" />;
      default:
        return <PowerIcon className="h-4 w-4" />;
    }
  };

  const getDeviceTypeColor = (deviceType: string) => {
    switch (deviceType) {
      case 'Router':
        return 'bg-blue-100 text-blue-800';
      case 'EndDevice':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {device.name}
        </CardTitle>
        <Badge 
          variant="secondary"
          className={getDeviceTypeColor(device.deviceType)}
        >
          {device.deviceType}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {getDeviceIcon(device.type)}
          <span className="text-xs text-gray-500">{device.model}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          ID: {device.id}
        </div>
      </CardContent>
    </Card>
  );
}
