import { useEffect } from 'react'
import './Modal.css'

export default function Modal({ open, onClose, title, children, dark }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ui-modal ui-modal--dark">
      <div role="dialog" aria-modal="true" className="ui-modal__content ui-modal__content--dark">
        {title && <h3 className="ui-modal__title ui-modal__title--dark">{title}</h3>}
        {children}
      </div>
    </div>
  )
}