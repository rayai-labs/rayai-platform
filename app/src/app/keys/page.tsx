"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Copy, Check, Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"
import { validateSession } from "@/lib/auth-helpers"

interface ApiKey {
  id: string
  name: string
  created_at: string
  last_used_at: string | null
}

export default function DashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null)
  const { addToast } = useToast()
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { isValid, shouldSignOut, error } = await validateSession()
      
      if (!isValid) {
        if (shouldSignOut) {
          await supabase.auth.signOut()
          addToast(error || 'Session expired. Please sign in again.', 'error')
        }
        router.push('/auth/signin')
        return
      }
      
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [router, supabase.auth, addToast])

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_key')
        .select('id, name, created_at, last_used_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching API keys:', error)
        addToast('Failed to load API keys', 'error')
        return
      }

      setApiKeys(data || [])
    } catch (error) {
      console.error('Error fetching API keys:', error)
      addToast('Failed to load API keys', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isCheckingAuth) {
      fetchApiKeys()
    }
  }, [isCheckingAuth])


  const confirmDeleteKey = (key: ApiKey) => {
    setKeyToDelete(key)
    setShowDeleteModal(true)
  }

  const deleteApiKey = async () => {
    if (!keyToDelete) return

    try {
      const { error } = await supabase
        .from('api_key')
        .delete()
        .eq('id', keyToDelete.id)

      if (error) {
        console.error('Error deleting API key:', error)
        addToast('Failed to delete API key', 'error')
        return
      }

      fetchApiKeys()
      addToast('API key deleted successfully', 'success')
      setShowDeleteModal(false)
      setKeyToDelete(null)
    } catch (error) {
      console.error('Error deleting API key:', error)
      addToast('Failed to delete API key', 'error')
    }
  }

  const generateDisplayKey = (keyId: string) => {
    const hash = keyId.replace(/-/g, '').substring(0, 8)
    return `ray_ai_sk_${hash}...****`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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
        if (data.shouldSignOut) {
          await supabase.auth.signOut()
          addToast('Session expired. Please sign in again.', 'error')
          router.push('/auth/signin')
          return
        }
        
        throw new Error(data.error || 'Failed to generate API key')
      }

      setApiKey(data.apiKey)
      setShowCreateModal(false)
      setShowKeyModal(true)
      fetchApiKeys()
    } catch (error) {
      console.error('Error generating API key:', error)
      addToast(error instanceof Error ? error.message : 'Failed to generate API key', 'error')
    } finally {
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
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
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-medium hover:bg-primary/90 transition-all whitespace-nowrap"
          >
            Create API Key
          </button>
        </div>

        {/* Table - Desktop */}
        <div className="hidden sm:block bg-muted border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_2.5fr_1fr_1fr_1fr] gap-4 lg:gap-6 px-4 lg:px-6 py-4 bg-background border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div>Name</div>
            <div>Secret Key</div>
            <div>Created</div>
            <div>Last Used</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="px-4 lg:px-6 py-8 text-center text-muted-foreground">
              Loading API keys...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="px-4 lg:px-6 py-8 text-center text-muted-foreground">
              Create a key to start using the API
            </div>
          ) : (
            apiKeys.map((key, index) => (
              <div
                key={key.id}
                className={`grid grid-cols-[2fr_2.5fr_1fr_1fr_1fr] gap-4 lg:gap-6 px-4 lg:px-6 py-4 text-sm text-foreground ${
                  index < apiKeys.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="font-medium">{key.name}</div>
                <div className="font-mono text-muted-foreground text-xs lg:text-sm">
                  {generateDisplayKey(key.id)}
                </div>
                <div className="text-muted-foreground">{formatDate(key.created_at)}</div>
                <div className="text-muted-foreground">
                  {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                </div>
                <div>
                  <button
                    onClick={() => confirmDeleteKey(key)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-all rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cards - Mobile */}
        <div className="sm:hidden space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading API keys...
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Create a key to start using the API
            </div>
          ) : (
            apiKeys.map((key) => (
              <div key={key.id} className="bg-muted border border-border rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-foreground">{key.name}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => confirmDeleteKey(key)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-all rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Secret Key</p>
                    <p className="font-mono text-sm text-foreground break-all">{generateDisplayKey(key.id)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Created</p>
                      <p className="text-sm text-foreground">{formatDate(key.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Used</p>
                      <p className="text-sm text-foreground">
                        {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
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
              <div className="flex flex-row items-center gap-3">
                <div className="flex-1 font-mono text-xs sm:text-sm text-foreground whitespace-nowrap overflow-hidden text-ellipsis leading-relaxed">
                  {apiKey}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-2 py-1.5 sm:px-2.5 sm:py-1.5 border-none rounded text-xs font-medium cursor-pointer flex items-center justify-center gap-1 transition-all whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
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
                className="px-4 py-1.5 sm:px-3 sm:py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && keyToDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-muted border border-border text-foreground p-6 sm:p-8 rounded-xl sm:rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-xl sm:text-2xl mb-2 font-bold text-foreground">
              Revoke API Key
            </h2>
            
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              This API key will be revoked immediately and can no longer be used to make requests to the platform.
            </p>

            {/* Key Display */}
            <div className="bg-input border border-border rounded-xl p-3 sm:p-4 mb-6">
              <div className="font-mono text-sm text-foreground">
                {generateDisplayKey(keyToDelete.id)}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setKeyToDelete(null)
                }}
                className="px-5 py-3 bg-transparent text-muted-foreground border border-border rounded-lg text-sm font-medium hover:bg-background hover:text-foreground transition-all order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={deleteApiKey}
                className="px-5 py-3 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-all order-1 sm:order-2"
              >
                Revoke key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}