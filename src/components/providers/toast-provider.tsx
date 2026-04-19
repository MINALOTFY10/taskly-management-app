"use client"

import type { ReactNode } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"

type ToastVariant = "success" | "error" | "info"

type ToastItem = {
  id: string
  title?: string
  message: string
  variant: ToastVariant
}

type ShowToastOptions = {
  title?: string
  message: string
  variant?: ToastVariant
  durationMs?: number
}

type ToastContextValue = {
  showToast: (options: ShowToastOptions) => void
  dismissToast: (id: string) => void
}

const TOAST_DURATION_MS = 3000
const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutMapRef = useRef<Map<string, number>>(new Map())

  const dismissToast = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))

    const timeoutId = timeoutMapRef.current.get(id)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutMapRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    ({
      title,
      message,
      variant = "info",
      durationMs = TOAST_DURATION_MS,
    }: ShowToastOptions) => {
      const id =
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`

      setToasts((previous) => [...previous, { id, title, message, variant }])

      const timeoutId = window.setTimeout(() => {
        dismissToast(id)
      }, durationMs)

      timeoutMapRef.current.set(id, timeoutId)
    },
    [dismissToast]
  )

  useEffect(() => {
    const timeoutMap = timeoutMapRef.current

    return () => {
      timeoutMap.forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
      timeoutMap.clear()
    }
  }, [])

  const contextValue = useMemo(
    () => ({ showToast, dismissToast }),
    [dismissToast, showToast]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 right-4 z-100 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
      >
        {toasts.map((toast) => {
          const Icon =
            toast.variant === "success"
              ? CheckCircle2
              : toast.variant === "error"
                ? AlertCircle
                : Info

          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border border-l-5 bg-card px-3 py-3 shadow-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-800 ease-out",
                toast.variant === "success" &&
                  "border-success bg-[#E6F7EC] text-success font-bold",
                toast.variant === "error" &&
                  "border-error bg-[#FDE6E7] text-error font-bold",
                toast.variant === "info" && "border-border/70 text-foreground"
              )}
            >
              <Icon className="mt-0.5 size-4.5 shrink-0" />

              <div className="min-w-0 flex-1">
                {toast.title ? (
                  <p className="text-sm font-semibold">{toast.title}</p>
                ) : null}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>

              <button
                type="button"
                aria-label="Dismiss notification"
                className="cursor-pointer rounded p-0.5 opacity-70 transition hover:opacity-100"
                onClick={() => dismissToast(toast.id)}
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useAppToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useAppToast must be used within ToastProvider")
  }

  return context
}
