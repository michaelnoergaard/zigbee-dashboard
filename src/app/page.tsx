import { Device, LogData } from '@/lib/parseLogFile';

export default async function Home() {
  // This is just the UI template, we'll add the actual data fetching later
  const mockData: LogData = {
    devices: [],
    timestamp: new Date().toISOString(),
    version: '1.42.0',
    errors: []
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Zigbee Dashboard
          </h1>
          <div className="mt-1 text-sm text-gray-500">
            Version {mockData.version} • Last updated: {mockData.timestamp}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Error Messages */}
        {mockData.errors.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {mockData.errors.length} Error{mockData.errors.length > 1 ? 's' : ''} Detected
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {mockData.errors.map((error, index) => (
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
                {mockData.devices.length}
              </dd>
            </div>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {mockData.devices.map((device) => (
                <li key={device.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {device.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {device.model}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {device.deviceType}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
