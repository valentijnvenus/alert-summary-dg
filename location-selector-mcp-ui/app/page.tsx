'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface LocationData {
  districts: {
    [district: string]: string[]
  }
}

interface AlertResponse {
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  district?: string
  alert_summary: string
  timestamp: string
}

export default function Home() {
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedVillage, setSelectedVillage] = useState<string>('')
  const [villages, setVillages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [alertData, setAlertData] = useState<AlertResponse | null>(null)
  const [error, setError] = useState<string>('')

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://aakashdg-mcp-alert-generator.hf.space'

  // Fetch locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/locations`)
        setLocationData(response.data)
      } catch (err) {
        setError('Failed to load locations. Please refresh the page.')
        console.error('Error fetching locations:', err)
      }
    }
    fetchLocations()
  }, [BACKEND_URL])

  // Update villages when district changes
  useEffect(() => {
    if (selectedDistrict && locationData) {
      setVillages(locationData.districts[selectedDistrict] || [])
      setSelectedVillage('')
      setAlertData(null)
    }
  }, [selectedDistrict, locationData])

  // Generate alert when village is selected
  useEffect(() => {
    if (selectedVillage && selectedDistrict) {
      generateAlert()
    }
  }, [selectedVillage])

  const generateAlert = async () => {
    setLoading(true)
    setError('')
    setAlertData(null)

    try {
      const response = await axios.post<AlertResponse>(`${BACKEND_URL}/generate-alert`, {
        location_name: selectedVillage,
        district: selectedDistrict
      })
      setAlertData(response.data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to generate alert. Please try again.'
      setError(errorMessage)
      console.error('Error generating alert:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const copyToClipboard = async () => {
    if (alertData) {
      try {
        await navigator.clipboard.writeText(alertData.alert_summary)
        alert('Alert summary copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Farmer.chat Alert Summary Generator
          </h1>
          <p className="text-lg text-gray-600">
            Select a location in Bihar to generate comprehensive agricultural alerts
          </p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* District Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                disabled={!locationData}
              >
                <option value="">-- Choose District --</option>
                {locationData && Object.keys(locationData.districts).sort().map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* Village Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Village/Town
              </label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                disabled={!selectedDistrict || villages.length === 0}
              >
                <option value="">-- Choose Village/Town --</option>
                {villages.map((village) => (
                  <option key={village} value={village}>
                    {village}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Info */}
          {alertData && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    📍 Location: <span className="text-gray-900">{alertData.location}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Coordinates: {alertData.coordinates.latitude.toFixed(4)}°N, {alertData.coordinates.longitude.toFixed(4)}°E
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Generated at</p>
                  <p className="text-sm font-medium text-gray-700">{formatTimestamp(alertData.timestamp)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
              <p className="text-lg font-medium text-gray-700">Generating Alert Summary...</p>
              <p className="text-sm text-gray-500 mt-2">
                Querying Weather, Soil, Water, Elevation & Pest data...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Alert Summary Display */}
        {alertData && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Alert Summary</h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200">
                {alertData.alert_summary}
              </div>
            </div>

            {/* MCP Servers Info */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['Weather', 'Soil', 'Water', 'Elevation', 'Pests'].map((server) => (
                <div key={server} className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600">✓ {server}</p>
                  <p className="text-xs text-green-600 font-medium">Queried</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!alertData && !loading && !error && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Alert Summary Generator
              </h3>
              <p className="text-gray-600">
                Select a district and village above to generate a comprehensive agricultural alert 
                covering weather, soil, water availability, elevation, and pest information.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Farmer.chat MCP Pipeline</p>
          <p className="mt-1">
            Integrating Weather • Soil • Water • Elevation • Pest Analysis
          </p>
        </div>
      </div>
    </main>
  )
}
