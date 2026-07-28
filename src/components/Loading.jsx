export default function Loading({ text = '加载中...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <p className="loading__text">{text}</p>
    </div>
  )
}
