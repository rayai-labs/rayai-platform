"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/toast"

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { addToast } = useToast()

  // Sample API keys data
  const apiKeys = [
    {
      id: '1',
      name: 'Production Key',
      secretKey: 'ray_live_sk_1a2b...4n5o',
      created: 'Oct 15, 2025'
    },
    {
      id: '2', 
      name: 'Development Key',
      secretKey: 'ray_live_sk_6p7q...8r9s',
      created: 'Oct 10, 2025'
    },
    {
      id: '3',
      name: 'Testing Key',
      secretKey: 'ray_live_sk_3c4d...7g8h',
      created: 'Oct 5, 2025'
    }
  ]

  const handleCreateKey = async () => {
    if (!keyName.trim()) {
      addToast('Please enter a key name', 'error')
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/generate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyName: keyName.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate API key')
      }

      setApiKey(data.apiKey)
      setIsGenerating(false)
      setShowCreateModal(false)
      setShowKeyModal(true)
    } catch (error) {
      console.error('Error generating API key:', error)
      addToast(error instanceof Error ? error.message : 'Failed to generate API key', 'error')
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      addToast('Failed to copy API key', 'error')
    }
  }

  const resetAndClose = () => {
    setShowKeyModal(false)
    setKeyName('')
    setApiKey('')
    setIsCopied(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1 sm:mb-2 text-foreground">
              API Keys
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your RayAI API keys for authentication
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all whitespace-nowrap w-full sm:w-auto"
          >
            Create new key
          </button>
        </div>

        {/* Table - Desktop */}
        <div className="hidden sm:block bg-muted border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_3fr_1fr] gap-4 lg:gap-6 px-4 lg:px-6 py-4 bg-background border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div>Name</div>
            <div>Secret Key</div>
            <div>Created</div>
          </div>

          {/* Table Rows */}
          {apiKeys.map((key, index) => (
            <div
              key={key.id}
              className={`grid grid-cols-[2fr_3fr_1fr] gap-4 lg:gap-6 px-4 lg:px-6 py-4 text-sm text-foreground ${
                index < apiKeys.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="font-medium">{key.name}</div>
              <div className="font-mono text-muted-foreground text-xs lg:text-sm">
                {key.secretKey}
              </div>
              <div className="text-muted-foreground">{key.created}</div>
            </div>
          ))}
        </div>

        {/* Cards - Mobile */}
        <div className="sm:hidden space-y-4">
          {apiKeys.map((key) => (
            <div key={key.id} className="bg-muted border border-border rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-foreground">{key.name}</h3>
                <span className="text-xs text-muted-foreground">{key.created}</span>
              </div>
              <div className="">
                <p className="text-xs text-muted-foreground mb-1">Secret Key</p>
                <p className="font-mono text-sm text-foreground break-all">{key.secretKey}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-muted border border-border rounded-lg text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Security Notice:</strong> Do not share your API keys with others or expose them in client-side code. 
          Keep them secure to protect your account.
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-muted border border-border text-foreground p-6 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-xl sm:text-2xl mb-2 font-bold text-foreground">
              Create API Key
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Generate a new API key for authentication
            </p>
            
            {/* Name field */}
            <div className="mb-6 sm:mb-8">
              <label className="block mb-2 text-sm font-semibold text-foreground">
                Name
              </label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Enter a descriptive name"
                className="w-full p-3 bg-input border border-border rounded-lg text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-3 bg-transparent text-muted-foreground border border-border rounded-lg text-sm font-medium hover:bg-background hover:text-foreground transition-all order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                disabled={isGenerating || !keyName.trim()}
                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all order-1 sm:order-2 ${
                  isGenerating || !keyName.trim()
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                }`}
              >
                {isGenerating ? 'Creating...' : 'Create key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Display Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-muted border border-border text-foreground p-6 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-xl sm:text-2xl mb-2 font-bold text-foreground">
              API Key Created
            </h2>
            
            <p className="text-muted-foreground text-sm mb-1 leading-relaxed">
              Please save your API key in a secure location. <strong className="text-foreground">You won't be able to view it again</strong>.
            </p>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Anyone with this key can make requests on your behalf.
            </p>

            {/* API Key Display */}
            <div className="bg-input border border-border rounded-xl p-3 sm:p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 font-mono text-xs sm:text-sm text-foreground break-all sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis leading-relaxed">
                  {apiKey}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 sm:px-2.5 sm:py-1.5 border-none rounded text-xs font-medium cursor-pointer flex items-center justify-center gap-1 transition-all whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isCopied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Done button */}
            <div className="flex justify-end">
              <button
                onClick={resetAndClose}
                className="w-full sm:w-auto px-4 py-2 sm:px-3 sm:py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}