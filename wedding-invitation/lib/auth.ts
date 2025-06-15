// Đây là file mô phỏng authentication, trong thực tế bạn sẽ sử dụng NextAuth hoặc giải pháp xác thực khác

// Các loại người dùng có thể có
export type UserRole = "admin" | "user"

// Cấu trúc user
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  image?: string
}

// Giả lập hàm lấy người dùng hiện tại, trong thực tế sẽ lấy từ session
export async function getCurrentUser(): Promise<User | null> {
  // Giả lập người dùng đã đăng nhập và có vai trò admin
  return {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    image: "/placeholder.svg?height=100&width=100&text=Admin",
  }

  // Để test với user thông thường, bỏ comment dòng dưới và comment đoạn code trên
  // return {
  //   id: '2',
  //   name: 'Regular User',
  //   email: 'user@example.com',
  //   role: 'user',
  //   image: '/placeholder.svg?height=100&width=100&text=User'
  // }

  // Để test với trường hợp chưa đăng nhập
  // return null
}
