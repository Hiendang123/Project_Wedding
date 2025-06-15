"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { WeddingInvitation } from "@/interface/WeddingInvitation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  gender: string;
  phone: string;
  address: string;
  country: string;
  dateOfBirth: string;
  status: string;
  registeredAt: string;
  profilePicture?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [weddingInvitations, setWeddingInvitations] = useState<WeddingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface UserResponse {
    user: User;
    weddingInvitations: WeddingInvitation[];
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserResponse>(`${API_ENDPOINTS.users}/${params.id}`);
        setUser(response.data.user);
        setWeddingInvitations(response.data.weddingInvitations);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(error.response?.data?.message || "Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUserData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-gray-500">Không tìm thấy thông tin người dùng</div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline">Hoạt động</Badge>;
      case "suspended":
        return <Badge className="bg-red-500 text-white" variant="outline">Đã khóa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  const getRoleText = (role: string) => {
    return role === "admin" ? "Admin" : "Người dùng";
  };

  return (
    <div className="space-y-6 pt-6 lg:pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Thông tin người dùng</h1>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Họ và tên</p>
                <p className="mt-1">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Số điện thoại</p>
                <p className="mt-1">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vai trò</p>
                <p className="mt-1">{getRoleText(user.role)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Giới tính</p>
                <p className="mt-1">{getGenderText(user.gender)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày sinh</p>
                <p className="mt-1">{format(new Date(user.dateOfBirth), "dd/MM/yyyy", { locale: vi })}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Địa chỉ</p>
                <p className="mt-1">{user.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quốc gia</p>
                <p className="mt-1">{user.country}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái</p>
                <p className="mt-1">{getStatusBadge(user.status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ngày đăng ký</p>
                <p className="mt-1">{format(new Date(user.registeredAt), "dd/MM/yyyy", { locale: vi })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wedding Invitations Card */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thiệp cưới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {weddingInvitations.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Cô dâu - Chú rể
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Mẫu thiệp
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ngày tạo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weddingInvitations.map((invitation) => (
                    <tr
                      key={invitation._id}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="px-4 py-3">
                      <div className="font-medium">{invitation?.groomName} & {invitation?.brideName}</div>
                        <div className="text-sm text-gray-500">
                        <a href={`/wedding/${invitation?.slug}`} target="_blank" className="text-blue-500 hover:text-blue-600">
                            {invitation?.slug}
                        </a>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {invitation.template?.thumbnail && (
                            <img 
                              src={invitation.template.thumbnail} 
                              alt={invitation.template.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">
                                <a href={`/templates/${invitation.template?._id}`} target="_blank" className="text-blue-500 hover:text-blue-600">
                                    {invitation.template?.name || 'Không có mẫu'}
                                </a>
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {invitation.template?._id || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {invitation.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString('vi-VN') : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-center text-gray-500">Chưa có thiệp cưới nào</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 