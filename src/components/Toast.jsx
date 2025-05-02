import { useEffect } from "react"
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa"

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (toast.type) {
      case "error":
        return <FaExclamationCircle className="text-destructive" />
      default:
        return <FaCheckCircle className="text-primary" />
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-card p-4 shadow-lg border border-border max-w-md`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        {toast.title && <h4 className="font-semibold">{toast.title}</h4>}
        {toast.message && <p className="text-sm text-muted">{toast.message}</p>}
      </div>
      <button onClick={onClose} className="flex-shrink-0 text-muted hover:text-foreground">
        <FaTimes />
      </button>
    </div>
  )
}

export default Toast
