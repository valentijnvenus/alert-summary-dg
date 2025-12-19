'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aakashdg-alert-summary-fc-backend.hf.space'

interface QueryResponse {
  success: boolean
  query: string
  advice: string
  routing: {
    intent: string
    required_servers: string[]
    reasoning: string
  }
  data: {
    successful_servers: string[]
    failed_servers: any[]
    data: Record<string, any>
  }
  execution_time_seconds: number
  timestamp: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(`${API_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          // location: {
          //   name: 'Bangalore Agricultural Region',
          //   lat: 12.8716,
          //   lon: 77.4946
          // }
          location: {
            name: 'Guntur, Tamil Nadu',
            lat: 15.912,
            lon: 79.740
          }
        }),
      })

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (!query.trim()) return

    try {
      const res = await fetch(`${API_URL}/api/export-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          // location: {
          //   name: 'Bangalore Agricultural Region',
          //   lat: 12.8716,
          //   lon: 77.4946
          // }
          location: {
            name: 'Guntur, Tamil Nadu',
            lat: 15.912,
            lon: 79.740
          }
        }),
      })

      if (!res.ok) {
        throw new Error(`PDF Export Error: ${res.status}`)
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `farmer-chat-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PDF')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-farmer-green text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🌾 Farmer.Chat</h1>
          <p className="text-green-100 mt-1">AI-Powered Agricultural Intelligence</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Query Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
              Ask a question about farming in Guntur Fields:
            </label>
            <div className="flex gap-3">
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Should I plant rice today? What's the soil pH?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-farmer-green focus:border-transparent outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-farmer-green text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '⏳ Processing...' : '🔍 Ask'}
              </button>
            </div>
          </form>

          {/* Example Queries */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'What is the weather like?',
                'Should I plant rice today?',
                'What is my soil composition?',
                'Are groundwater levels low?'
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  disabled={loading}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="space-y-4">
            
            {/* Advice Card with Markdown Rendering */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-farmer-green">📊 Farmer Advice</h2>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  📄 Export PDF
                </button>
              </div>
              
              {/* Markdown Rendered Content */}
              <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
                <ReactMarkdown
                  components={{
                    // Custom styling for markdown elements
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-farmer-green mt-4 mb-2" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-farmer-green mt-3 mb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="text-gray-700 mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-gray-600" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-farmer-green pl-4 italic text-gray-600 my-3" {...props} />,
                    code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />,
                  }}
                >
                  {response.advice}
                </ReactMarkdown>
              </div>
            </div>

            {/* MCP Pipeline Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🔧 MCP Pipeline Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Intent:</p>
                  <p className="font-medium text-gray-900">{response.routing.intent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Execution Time:</p>
                  <p className="font-medium text-gray-900">{response.execution_time_seconds}s</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">MCP Servers Used:</p>
                <div className="flex flex-wrap gap-2">
                  {response.routing.required_servers.map((server) => (
                    <span
                      key={server}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        response.data.successful_servers.includes(server)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {response.data.successful_servers.includes(server) ? '✅' : '❌'} {server}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Status:</p>
                <p className="text-xs text-gray-500">
                  {response.data.successful_servers.length}/{response.routing.required_servers.length} servers successful
                </p>
              </div>
            </div>

            {/* Raw Data (Collapsible) */}
            <details className="bg-gray-50 rounded-lg shadow-sm">
              <summary className="px-6 py-4 cursor-pointer font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                📦 View Raw Data
              </summary>
              <div className="px-6 py-4 border-t border-gray-200">
                <pre className="text-xs overflow-auto bg-gray-900 text-green-400 p-4 rounded">
                  {JSON.stringify(response.data.data, null, 2)}
                </pre>
              </div>
            </details>

          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farmer-green mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your query through MCP pipeline...</p>
            <p className="text-sm text-gray-400 mt-2">This typically takes 3-5 seconds</p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>Powered by Multi-Stage MCP Pipeline</p>
          <p className="mt-1">
            Backend: <a href={API_URL} target="_blank" rel="noopener noreferrer" className="text-farmer-green hover:underline">
              {API_URL}
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
