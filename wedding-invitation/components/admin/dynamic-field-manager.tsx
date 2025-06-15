"use client"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DynamicField = {
  id: string
  name: string
  type: "text" | "image" | "date" | "location" | "color"
  defaultValue: string
  description: string
}

interface DynamicFieldManagerProps {
  fields: DynamicField[]
  onChange: (fields: DynamicField[]) => void
}

export function DynamicFieldManager({ fields, onChange }: DynamicFieldManagerProps) {
  const addField = () => {
    const newField: DynamicField = {
      id: `field_${Date.now()}`,
      name: "",
      type: "text",
      defaultValue: "",
      description: "",
    }
    onChange([...fields, newField])
  }

  const updateField = (index: number, field: Partial<DynamicField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...field }
    onChange(newFields)
  }

  const removeField = (index: number) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    onChange(newFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center sticky top-0 dark:bg-gray-900 pb-4 z-10">
        <Label className="text-base font-medium">Các trường động</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm trường
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          Chưa có trường động nào. Thêm trường để cho phép người dùng tùy chỉnh nội dung.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 p-4 border rounded-md border-gray-200 dark:border-gray-800"
            >
              <div className="col-span-12 sm:col-span-3">
                <Label htmlFor={`field-name-${index}`}>Tên trường</Label>
                <Input
                  id={`field-name-${index}`}
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                  placeholder="Nhập tên field"
                  className="mt-1"
                />
              </div>

              <div className="col-span-12 sm:col-span-3">
                <Label htmlFor={`field-type-${index}`}>Loại</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => updateField(index, { type: value as DynamicField["type"] })}
                >
                  <SelectTrigger id={`field-type-${index}`} className="mt-1">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Văn bản</SelectItem>
                    <SelectItem value="image">Hình ảnh</SelectItem>
                    <SelectItem value="date">Ngày tháng</SelectItem>
                    <SelectItem value="location">Địa điểm</SelectItem>
                    <SelectItem value="color">Màu sắc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 sm:col-span-3">
                <Label htmlFor={`field-default-${index}`}>Giá trị mặc định</Label>
                <Input
                  id={`field-default-${index}`}
                  value={field.defaultValue}
                  onChange={(e) => updateField(index, { defaultValue: e.target.value })}
                  placeholder="Nhập nội dung"
                  className="mt-1"
                />
              </div>

              <div className="col-span-12 sm:col-span-2">
                <Label htmlFor={`field-desc-${index}`}>Mô tả</Label>
                <Input
                  id={`field-desc-${index}`}
                  value={field.description}
                  onChange={(e) => updateField(index, { description: e.target.value })}
                  placeholder="Nhập tiêu đề"
                  className="mt-1"
                />
              </div>

              <div className="col-span-12 sm:col-span-1 flex items-end justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Xóa trường</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        <p>
          <strong>Lưu ý:</strong> Để sử dụng các trường động trong template, hãy sử dụng cú pháp{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{"{{tên_trường}}"}</code>
        </p>
        <p className="mt-1">
          Ví dụ:{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
            {"<h1>{{tên_cô_dâu}} & {{tên_chú_rể}}</h1>"}
          </code>
        </p>
      </div>
    </div>
  )
}
