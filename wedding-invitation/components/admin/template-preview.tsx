"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import type { DynamicField } from "./dynamic-field-manager"

interface TemplatePreviewProps {
  html: string
  css: string
  js: string
  dynamicFields: DynamicField[]
}

export function TemplatePreview({ html, css, js, dynamicFields }: TemplatePreviewProps) {
  const [loading, setLoading] = useState(true)
  const [iframeContent, setIframeContent] = useState("")
  const [iframeKey, setIframeKey] = useState(0)

  // Thay thế các giá trị động trong template
  const processTemplate = () => {
    let processedHtml = html
    let processedCss = css

    // Thay thế các giá trị động
    dynamicFields.forEach((field) => {
      const regex = new RegExp(`{{${field.name}}}`, "g")
      let value = field.defaultValue

      // Xử lý giá trị dựa trên loại trường
      switch (field.type) {
        case "color":
          // Đảm bảo giá trị màu sắc có định dạng hex
          if (!value.startsWith("#")) {
            value = "#" + value
          }
          // Thay thế trong cả HTML và CSS
          processedHtml = processedHtml.replace(regex, value)
          processedCss = processedCss.replace(regex, value)
          break
        case "date":
          // Format ngày tháng nếu có giá trị
          if (value) {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              value = date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })
            }
          }
          processedHtml = processedHtml.replace(regex, value || "")
          break
        case "location":
          // Nếu là địa điểm, thêm icon vị trí
          if (value) {
            value = `<span class="location"><svg class="inline-block w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>${value}</span>`
          }
          processedHtml = processedHtml.replace(regex, value || "")
          break
        case "text":
        default:
          // Giữ nguyên giá trị text
          processedHtml = processedHtml.replace(regex, value || "")
          break
      }
    })

    // Tạo một HTML cơ bản để hiển thị nội dung
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          /* Reset CSS cơ bản */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          /* Áp dụng CSS của người dùng */
          ${processedCss}
        </style>
      </head>
      <body>
        ${processedHtml}
        <script>${js}</script>
      </body>
      </html>
    `
  }

  useEffect(() => {
    setLoading(true)
    // Tạo nội dung cho iframe
    setIframeContent(processTemplate())
    setIframeKey((prevKey) => prevKey + 1)

    // Đặt timeout để mô phỏng thời gian tải
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [html, css, js, dynamicFields])

  return (
    <div className="relative border rounded-md overflow-hidden h-full bg-white dark:bg-gray-950">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-900/50 z-10">
          <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
        </div>
      )}
      <iframe
        key={iframeKey}
        srcDoc={iframeContent}
        title="Template Preview"
        className="w-full h-full"
        sandbox="allow-scripts"
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}
