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
    <div className={dark ? 'ui-modal ui-modal--dark' : 'ui-modal'}>
      <div role="dialog" aria-modal="true" className={dark ? 'ui-modal__content ui-modal__content--dark' : 'ui-modal__content'}>
        {title && <h3 className={dark ? 'ui-modal__title ui-modal__title--dark' : 'ui-modal__title'}>{title}</h3>}
        {children}
      </div>
    </div>
  )
}