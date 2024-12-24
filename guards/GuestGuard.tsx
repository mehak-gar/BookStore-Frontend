// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

export const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const userData = JSON.parse(localStorage.getItem('userData')as string)
    const accessToken = localStorage.getItem('accessToken')

    if (userData?.roles?.includes('super-admin') && router.pathname == '/reset-account') {
      router.replace('/')
    }

    if (window.localStorage.getItem('userData') && accessToken  && router.pathname =='/login') {
      router.replace('/')
    }

    // if (window.localStorage.getItem('userData')) {
    //   router.replace('/')
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route])

  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
