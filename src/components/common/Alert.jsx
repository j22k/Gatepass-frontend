import { useEffect } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import Button from './Button'

const Alert = ({ message, onClose, isOpen, type = 'info', autoClose = true }) => {
  if (!isOpen) return null

  const types = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      buttonVariant: 'outline',
      autoCloseDelay: 3000, // Auto-close after 3 seconds for success
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
      buttonVariant: 'outline',
      autoCloseDelay: null, // No auto-close for errors (user must dismiss)
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      buttonVariant: 'outline',
      autoCloseDelay: 4000, // Auto-close after 4 seconds for warnings
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
      buttonVariant: 'outline',
      autoCloseDelay: 3000, // Auto-close after 3 seconds for info
    },
  }

  const config = types[type] || types.info
  const IconComponent = config.icon

  useEffect(() => {
    if (autoClose && config.autoCloseDelay) {
      const timer = setTimeout(() => {
        onClose()
      }, config.autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, config.autoCloseDelay, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border ${config.bgColor} ${config.borderColor}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <IconComponent className={`w-6 h-6 mr-3 ${config.iconColor}`} />
            <h3 className={`text-lg font-semibold ${config.textColor}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)} Alert
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className={`text-gray-700 mb-6 ${config.textColor}`}>{message}</p>
        <div className="flex justify-end">
          <Button variant={config.buttonVariant} onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Alert
