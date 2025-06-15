"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"
import { API_ENDPOINTS } from "@/app/config/api"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    // Lấy email từ localStorage nếu có
    const registeredEmail = localStorage.getItem("registeredEmail")
    if (registeredEmail) {
      setFormData(prev => ({
        ...prev,
        email: registeredEmail
      }))
      // Xóa email khỏi localStorage sau khi đã sử dụng
      localStorage.removeItem("registeredEmail")
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post<LoginResponse>(API_ENDPOINTS.login, formData)
      
      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.token)
      
      toast.success("Đăng nhập thành công")
      
      // Chuyển hướng dựa vào role
      if (response.data.user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <CardDescription className="text-center">
            Đăng nhập để tiếp tục
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 