import Link from "next/link"
import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-pink-900/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
              <span className="text-xl font-bold">WeddingCard</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Tạo thiệp cưới online đẹp mắt và độc đáo cho ngày trọng đại của bạn.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-pink-400 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-pink-400 transition">
                  Tính năng
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-pink-400 transition">
                  Mẫu thiệp
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-pink-400 transition">
                  Cách thức
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:text-pink-400 transition">
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-400 transition">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-400 transition">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-pink-400 transition">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-500 dark:text-gray-400">
              <li>Email: info@weddingcard.com</li>
              <li>Điện thoại: +84 123 456 789</li>
              <li className="flex gap-4 mt-4">
                {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                  <Link key={social} href="#" className="text-gray-400 hover:text-pink-500 transition">
                    <div className="w-10 h-10 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center">
                      <span className="sr-only">{social}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} WeddingCard. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
