import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({
  type = 'text',
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div>
      <input
        ref={ref}
        type={type}
        className={clsx(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input