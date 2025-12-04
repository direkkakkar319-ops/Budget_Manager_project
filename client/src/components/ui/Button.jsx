import { forwardRef } from 'react'
import clsx from 'clsx'
import './Button.css'

const variants = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  ghost: 'ui-button--ghost',
  accent: 'ui-button--accent',
}

const sizes = {
  sm: 'ui-button--sm',
  md: 'ui-button--md',
  lg: 'ui-button--lg',
}

const Button = forwardRef(function Button({ variant = 'primary', size = 'md', className, disabled, children, ...props }, ref) {
  const cn = clsx('ui-button', sizes[size], variants[variant], className)
  return (
    <button ref={ref} className={cn} disabled={disabled} {...props}>
      {children}
    </button>
  )
})

export default Button