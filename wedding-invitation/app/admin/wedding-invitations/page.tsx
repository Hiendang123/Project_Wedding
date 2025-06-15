"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Edit,Eye, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"
import { API_ENDPOINTS } from "@/app/config/api"
import { toast } from "sonner"
import { WeddingInvitation } from "@/interface/WeddingInvitation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function WeddingInvitationsPage() {
  const router = useRouter()
  const [weddingInvitations, setWeddingInvitations] = useState<WeddingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch wedding invitations
  useEffect(() => {
    const fetchWeddingInvitations = async () => {
      try {
        setLoading(true)
        const response = await axios.get(API_ENDPOINTS.weddingInvitations, {
          params: {
            sort: 'newest'
          }
        })
        const data = response.data as { data: WeddingInvitation[] }
        setWeddingInvitations(data.data)
        setError(null)
      } catch (error: any) {
        console.error("Error fetching wedding invitations:", error)
        setError(error.response?.data?.message || "Lỗi khi tải danh sách thiệp cưới")
      } finally {
        setLoading(false)
      }
    }

    fetchWeddingInvitations()
  }, [])

  // Handle delete wedding invitation
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thiệp cưới này?")) return

    try {
      await axios.delete(`${API_ENDPOINTS.weddingInvitations}/${id}`)
      setWeddingInvitations(prev => prev.filter(invitation => invitation._id !== id))
      toast.success("Xóa thiệp cưới thành công")
    } catch (error: any) {
      console.error("Error deleting wedding invitation:", error)
      toast.error(error.response?.data?.message || "Lỗi khi xóa thiệp cưới")
    }
  }

  // Filter wedding invitations
  const filteredInvitations = weddingInvitations.filter(invitation => {
    const matchesSearch = 
      invitation?.groomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation?.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation?.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || invitation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">{error}</div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm theo tên cô dâu, chú rể..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg">
      <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên cô dâu & chú rể</TableHead>
              <TableHead>Mẫu thiệp</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <Spinner size="md" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredInvitations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Không tìm thấy mẫu thiệp nào
                </TableCell>
              </TableRow>
            ) : (
              filteredInvitations.map((invitation) => (
                <TableRow key={invitation._id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">{invitation?.groomName} & {invitation?.brideName}</div>
                    <div className="text-sm text-gray-500">
                      <a href={`/wedding/${invitation?.slug}`} target="_blank" className="text-blue-500 hover:text-blue-600">
                        {invitation?.slug}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a href={`/templates/${invitation?.template?._id}`} target="_blank" className="text-blue-500 hover:text-blue-600">
                      {invitation?.template?.name}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`/admin/users/${invitation?.user?._id}`} target="_blank" className="text-blue-500 hover:text-blue-600">
                      {invitation?.user?.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invitation.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {invitation.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString('vi-VN') : ''}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push(`/wedding/${invitation.slug}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem trước</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => router.push(`/admin/wedding-invitations/${invitation._id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDelete(invitation._id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 