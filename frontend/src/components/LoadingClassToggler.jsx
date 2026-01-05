import { useEffect } from 'react'

export default function LoadingClassToggler() {
  useEffect(() => {
    const handler = (e) => {
      try {
        if (e?.detail) document.documentElement.classList.add('arch-loading-active')
        else document.documentElement.classList.remove('arch-loading-active')
      } catch (err) {}
    }
    window.addEventListener('arch-loading', handler)
    return () => window.removeEventListener('arch-loading', handler)
  }, [])
  return null
}
