import './Skeleton.css'

export function Skeleton({ className = '' }) {
  return <div className={`ui-skeleton ${className}`} />
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="ui-skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="ui-skeleton-line" />
      ))}
    </div>
  )
}