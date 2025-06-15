"use server"

import { revalidatePath } from "next/cache"

export type DynamicField = {
  id: string
  name: string
  type: "text" | "image" | "date" | "location" | "color"
  defaultValue: string
  description: string
}

export type TemplateData = {
  name: string
  category: string
  price: string
  status: string
  html: string
  css: string
  js: string
  dynamicFields: DynamicField[]
}

export async function saveTemplate(data: TemplateData) {
  try {
    // Trong thực tế, bạn sẽ lưu dữ liệu vào cơ sở dữ liệu ở đây
    // Ví dụ: await db.templates.create({ data })

    // Khi lưu, chúng ta sẽ tạo một HTML đầy đủ từ các phần riêng lẻ
    const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name}</title>
  <style>
${data.css}
  </style>
</head>
<body>
${data.html}
  <script>
${data.js}
  </script>
</body>
</html>`

    console.log("Saving template:", data)
    console.log("Full HTML:", fullHtml)

    // Giả lập độ trễ của mạng
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Revalidate để cập nhật dữ liệu
    revalidatePath("/admin/templates")

    return { success: true, message: "Đã lưu mẫu thiệp thành công!" }
  } catch (error) {
    console.error("Error saving template:", error)
    return { success: false, message: "Có lỗi xảy ra khi lưu mẫu thiệp." }
  }
}

export async function createTemplate(formData: FormData) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'Có lỗi xảy ra khi tạo mẫu thiệp' };
    }

    revalidatePath('/admin/templates');
    return { success: true, data };
  } catch (error) {
    console.error('Error creating template:', error);
    return { error: 'Có lỗi xảy ra khi tạo mẫu thiệp' };
  }
}
