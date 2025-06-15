"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import axios from "axios"
import { API_ENDPOINTS } from "@/app/config/api"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post(API_ENDPOINTS.logout)
      // Xóa token và user từ localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      // Chuyển hướng về trang đăng nhập
      router.push("/login")
      toast.success("Đăng xuất thành công")
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error(error.response?.data?.message || "Lỗi khi đăng xuất")
    }
  }

  return (
    <header className="container mx-auto py-6 px-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold">WeddingCard</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/#features"
          className="hover:text-pink-400 transition"
        >
          Tính năng
        </Link>
        <Link
          href="/templates"
          className="hover:text-pink-400 transition"
        >
          Mẫu thiệp
        </Link>
        <Link
          href="/#how-it-works"
          className="hover:text-pink-400 transition"
        >
          Cách thức
        </Link>
        <Link
          href="/#testimonials"
          className="hover:text-pink-400 transition"
        >
          Đánh giá
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => router.push("/login")}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Đăng nhập
          </Button>
        )}
      </div>
    </header>
  )
}
