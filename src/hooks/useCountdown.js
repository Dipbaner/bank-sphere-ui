import { useEffect, useState } from 'react'

export default function useCountdown(targetMs) {
  const calc = () => Math.max(0, Math.round((targetMs - Date.now()) / 1000))
  const [left, setLeft] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setLeft(calc()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs])
  return left
}

export const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`