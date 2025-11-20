import { forwardRef } from 'react'
import clsx from 'clsx'
import './Input.css'

const base = 'ui-input'
const variants = {
  light: 'ui-input--light',
  dark: 'ui-input--dark',
}

const Input = forwardRef(function Input({ label, error, helper, variant = 'light', className, ...props }, ref) {
  const cn = clsx(base, variants[variant], className)
  return (
    <div className="ui-input-group">
      {label && <label className={variant === 'dark' ? 'ui-input__label--dark' : 'ui-input__label'}>{label}</label>}
      <input ref={ref} className={cn} {...props} />
      {helper && <div className={variant === 'dark' ? 'ui-input__helper--dark' : 'ui-input__helper'}>{helper}</div>}
      {error && <div className="ui-input__error">{error}</div>}
    </div>
  )
})

export default Input