"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void
  removeToast: (id: string) => void
  toasts: Toast[]
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString()
    const newToast = { id, message, type }
    
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) {
  const borderColors = {
    success: 'border-green-400',
    error: 'border-red-400', 
    info: 'border-blue-400'
  }

  const textColors = {
    success: 'text-green-300',
    error: 'text-red-300',
    info: 'text-blue-300'
  }

  return (
    <div 
      className={`bg-black/80 backdrop-blur-sm ${textColors[toast.type]} px-4 py-3 rounded-lg shadow-lg border ${borderColors[toast.type]} animate-in slide-in-from-right duration-300 min-w-[250px] max-w-[350px]`}
      onClick={() => onRemove(toast.id)}
    >
      <div className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium">{toast.message}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onRemove(toast.id)
          }}
          className="text-gray-400 hover:text-gray-300 text-xs ml-3"
        >
          ✕
        </button>
      </div>
    </div>
  )
}