import React, { useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export default function MaterialLoader() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => setOpen(Boolean(e?.detail))
    window.addEventListener('arch-loading', handler)
    return () => window.removeEventListener('arch-loading', handler)
  }, [])

  return (
    <Backdrop open={open} sx={{ zIndex: 1300, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
