export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main className="error-fallback" role="alert">
      <h1>页面出错了</h1>
      <p>任务列表加载时发生错误，请尝试重新加载页面。</p>
      <pre className="error-fallback__message">{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        重试
      </button>
    </main>
  )
}
