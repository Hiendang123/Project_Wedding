import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCode, Users, CreditCard, TrendingUp } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <TrendingUp className="h-4 w-4 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24,500,000đ</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+18%</span> so với tháng trước
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          <Users className="h-4 w-4 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,254</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+12%</span> so với tháng trước
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Giao dịch</CardTitle>
          <CreditCard className="h-4 w-4 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">632</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+8%</span> so với tháng trước
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mẫu thiệp</CardTitle>
          <FileCode className="h-4 w-4 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">48</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+4</span> mẫu mới trong tháng
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
