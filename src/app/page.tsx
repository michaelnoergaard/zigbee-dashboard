'use client';

import { useEffect, useState } from 'react';
import { Device, LogData } from '@/lib/parseLogFile';
import { DeviceCard } from '@/components/device/DeviceCard';

export default function Home() {
  const [data, setData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/logs');
        if (!response.ok) throw new Error('Failed to fetch data');
        const newData = await response.json();
        setData(newData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const devicesByLocation = data?.devices.reduce((acc, device) => {
    const location = device.location || 'unknown';
    if (!acc[location]) acc[location] = [];
    acc[location].push(device);
    return acc;
  }, {} as Record<string, Device[]>) || {};

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-red-800 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Zigbee Dashboard
          </h1>
          {data && (
            <div className="mt-1 text-sm text-gray-500">
              Version {data.version} • Last updated: {data.timestamp}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Error Messages */}
        {data?.errors.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {data.errors.length} Error{data.errors.length > 1 ? 's' : ''} Detected
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {data.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Devices
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {data?.devices.length || 0}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Locations
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {Object.keys(devicesByLocation).length}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                End Devices
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {data?.devices.filter(d => d.deviceType === 'EndDevice').length || 0}
              </dd>
            </div>
          </div>
        </div>

        {/* Devices by Location */}
        <div className="mt-8">
          {Object.entries(devicesByLocation).map(([location, devices]) => (
            <div key={location} className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                {location} ({devices.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
