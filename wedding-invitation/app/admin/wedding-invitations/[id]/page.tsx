"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"
import { API_ENDPOINTS } from "@/app/config/api"
import { toast } from "sonner"
import { WeddingInvitation } from "@/interface/WeddingInvitation"

export default function EditWeddingInvitationPage() {
  const params = useParams()
  const router = useRouter()
  const [weddingInvitation, setWeddingInvitation] = useState<WeddingInvitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch wedding invitation
  useEffect(() => {
    const fetchWeddingInvitation = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_ENDPOINTS.weddingInvitations}/${params.id}`)
        const data = response.data as { data: WeddingInvitation }
        setWeddingInvitation(data.data)
        setError(null)
      } catch (error: any) {
        console.error("Error fetching wedding invitation:", error)
        setError(error.response?.data?.message || "Lỗi khi tải thông tin thiệp cưới")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchWeddingInvitation()
    }
  }, [params.id])

  // Handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    if (!weddingInvitation) return

    setWeddingInvitation(prev => {
      if (!prev) return null
      return {
        ...prev,
        customValues: {
          ...prev.customValues,
          [fieldName]: value
        }
      }
    })
  }

  // Handle status change
  const handleStatusChange = (value: string) => {
    if (!weddingInvitation) return

    setWeddingInvitation(prev => {
      if (!prev) return null
      return {
        ...prev,
        status: value
      }
    })
  }

  // Handle save
  const handleSave = async () => {
    if (!weddingInvitation) return

    try {
      setIsSaving(true)
      await axios.put(`${API_ENDPOINTS.weddingInvitations}/${params.id}`, {
        customValues: weddingInvitation.customValues,
        status: weddingInvitation.status
      })
      toast.success("Cập nhật thiệp cưới thành công")
      router.push("/admin/wedding-invitations")
    } catch (error: any) {
      console.error("Error updating wedding invitation:", error)
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật thiệp cưới")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-[60vh]">
            <Spinner size="lg" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !weddingInvitation) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="text-center text-red-500 py-8">{error || "Không tìm thấy thiệp cưới"}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/admin/wedding-invitations")} className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Quay lại</span>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa thiệp cưới</h1>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isSaving ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Xem trước</h2>
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div 
                className="preview-container"
                dangerouslySetInnerHTML={{ 
                  __html: `
                    <style>${weddingInvitation.templateId?.css}</style>
                    ${weddingInvitation.templateId?.html}
                    <script>${weddingInvitation.templateId?.js}</script>
                  `
                }} 
              />
            </div>
          </div>

          {/* Edit Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Chỉnh sửa</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={weddingInvitation.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Đã xuất bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {weddingInvitation.templateId.dynamicFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">{field.description}</label>
                  {field.type === "color" ? (
                    <input
                      type="color"
                      value={weddingInvitation.customValues[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-10 rounded-md border border-gray-300 dark:border-gray-700"
                    />
                  ) : (
                    <input
                      type={field.type === "date" ? "date" : "text"}
                      value={weddingInvitation.customValues[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 