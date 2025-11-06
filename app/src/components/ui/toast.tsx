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
  const bgColor = {
    success: 'bg-wisteria',
    error: 'bg-red-600', 
    info: 'bg-primary'
  }

  return (
    <div 
      className={`${bgColor[toast.type]} text-black px-4 py-3 rounded-lg shadow-lg border border-border/20 animate-in slide-in-from-right duration-300 min-w-[250px] max-w-[350px]`}
      onClick={() => onRemove(toast.id)}
    >
      <div className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium">{toast.message}</span>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onRemove(toast.id)
          }}
          className="text-black/70 hover:text-black text-xs ml-3"
        >
          ✕
        </button>
      </div>
    </div>
  )
}