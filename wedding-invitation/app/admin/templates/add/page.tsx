"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Save, Code, Play, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeEditor } from "@/components/admin/code-editor"
import { DynamicFieldManager, type DynamicField } from "@/components/admin/dynamic-field-manager"
import { TemplatePreview } from "@/components/admin/template-preview"
import { ImageUpload } from "../components/ImageUpload"
import axios from "axios"
import { API_ENDPOINTS } from "@/app/config/api"
import { toast } from "sonner"
import { ht } from "date-fns/locale"
import { Spinner } from "@/components/ui/spinner"

export default function AddTemplatePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // State cho form tạo mẫu thiệp mới
  const [templateName, setTemplateName] = useState("")
  const [templateCategory, setTemplateCategory] = useState("")
  const [templatePrice, setTemplatePrice] = useState("free")
  const [templateStatus, setTemplateStatus] = useState("draft")
  const [htmlCode, setHtmlCode] = useState("")
  const [cssCode, setCssCode] = useState("")
  const [jsCode, setJsCode] = useState("")
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('/templates/thumbnails/default.jpg')

  const [activeTab, setActiveTab] = useState("editor")
  const [activeEditorTab, setActiveEditorTab] = useState("html")

  const handleThumbnailChange = (file: File | null) => {
    setThumbnail(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl('/templates/thumbnails/default.jpg')
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName) {
      toast.error("Vui lòng nhập tên mẫu thiệp")
      return
    }

    if (!templateCategory) {
      toast.error("Vui lòng chọn danh mục")
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', templateName)
      formData.append('category', templateCategory)
      formData.append('price', templatePrice)
      formData.append('status', templateStatus)
      formData.append('html', htmlCode)
      formData.append('css', cssCode)
      formData.append('js', jsCode)
      formData.append('dynamicFields', JSON.stringify(dynamicFields))
      
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }

      const token = localStorage.getItem('token');

      const response = await axios.post(API_ENDPOINTS.templates, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      
      toast.success("Tạo mẫu thiệp thành công")
      router.push("/admin/templates")
    } catch (error: any) {
      console.error("Error creating template:", error)
      toast.error(error.response?.data?.message || "Lỗi khi tạo mẫu thiệp")
    }
  }

  return (
    <div className="space-y-6 pt-6 lg:pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/templates")} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Quay lại</span>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Tạo mẫu thiệp mới</h1>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/templates")}>
            Hủy
          </Button>
          <Button onClick={handleSaveTemplate} disabled={isPending} className="bg-pink-600 hover:bg-pink-700">
            {isPending ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu mẫu thiệp
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="editor">
            <Code className="mr-2 h-4 w-4" />
            Soạn thảo
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Play className="mr-2 h-4 w-4" />
            Xem trước
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên mẫu thiệp</Label>
              <Input
                id="name"
                placeholder="Nhập tên mẫu thiệp"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={templateCategory} onValueChange={setTemplateCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="elegant">Sang trọng</SelectItem>
                  <SelectItem value="romantic">Lãng mạn</SelectItem>
                  <SelectItem value="minimalist">Tối giản</SelectItem>
                  <SelectItem value="floral">Hoa</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="modern">Hiện đại</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Giá</Label>
              <Select value={templatePrice} onValueChange={setTemplatePrice}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Miễn phí</SelectItem>
                  <SelectItem value="paid">Trả phí</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={templateStatus} onValueChange={setTemplateStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Bản nháp</SelectItem>
                  <SelectItem value="review">Đang xét duyệt</SelectItem>
                  <SelectItem value="published">Đã xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Thumbnail</Label>
            <ImageUpload
              currentImage={previewUrl}
              onImageChange={handleThumbnailChange}
              label="Thumbnail"
              description="Upload ảnh thumbnail cho mẫu thiệp (JPG, PNG)"
            />
          </div>

          <div className="grid gap-2">
            <Label>Mã HTML/CSS/JS</Label>
            <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="js">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="border rounded-md">
                <div className="h-[300px]">
                  <CodeEditor language="html" value={htmlCode} onChange={(value) => setHtmlCode(value || "")} />
                </div>
              </TabsContent>
              <TabsContent value="css" className="border rounded-md">
                <div className="h-[300px]">
                  <CodeEditor language="css" value={cssCode} onChange={(value) => setCssCode(value || "")} />
                </div>
              </TabsContent>
              <TabsContent value="js" className="border rounded-md">
                <div className="h-[300px]">
                  <CodeEditor language="javascript" value={jsCode} onChange={(value) => setJsCode(value || "")} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Trường động</h2>
            <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <div className="max-h-[300px] overflow-y-auto pr-2">
                <DynamicFieldManager fields={dynamicFields} onChange={setDynamicFields} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="py-4 h-screen">
          <TemplatePreview html={htmlCode} css={cssCode} js={jsCode} dynamicFields={dynamicFields} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
