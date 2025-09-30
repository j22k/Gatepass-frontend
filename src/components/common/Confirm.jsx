import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

const Confirm = ({ message, onConfirm, onCancel, isOpen }) => {
  const yesButtonRef = useRef(null)

  useEffect(() => {
    if (isOpen && yesButtonRef.current) {
      yesButtonRef.current.focus() // Auto-focus the "Yes" button for accessibility
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            No
          </Button>
          <Button
            ref={yesButtonRef}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white" // Red for destructive actions
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Confirm
