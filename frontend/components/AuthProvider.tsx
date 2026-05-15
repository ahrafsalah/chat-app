"use client"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const {isLoggedIn} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      return router.push("/login")
    }else{
      return router.push("/")
    }

  }, [isLoggedIn])
  return (
    <div>
      {children}
    </div>
  )
}

export default AuthProvider