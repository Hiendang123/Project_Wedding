"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const monthlyData = [
  { name: "T1", value: 12000000 },
  { name: "T2", value: 14000000 },
  { name: "T3", value: 15000000 },
  { name: "T4", value: 18000000 },
  { name: "T5", value: 16000000 },
  { name: "T6", value: 19000000 },
  { name: "T7", value: 22000000 },
  { name: "T8", value: 21000000 },
  { name: "T9", value: 24000000 },
  { name: "T10", value: 22000000 },
  { name: "T11", value: 18000000 },
  { name: "T12", value: 24500000 },
]

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1}`,
  value: Math.floor(Math.random() * 1000000) + 500000,
}))

const yearlyData = [
  { name: "2020", value: 80000000 },
  { name: "2021", value: 150000000 },
  { name: "2022", value: 210000000 },
  { name: "2023", value: 275000000 },
]

type TimeRange = "daily" | "monthly" | "yearly"

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")

  // Chọn dữ liệu dựa trên timeRange
  const data = {
    daily: dailyData,
    monthly: monthlyData,
    yearly: yearlyData,
  }[timeRange]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue="monthly" onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Chọn thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Theo ngày</SelectItem>
            <SelectItem value="monthly">Theo tháng</SelectItem>
            <SelectItem value="yearly">Theo năm</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => {
                if (value >= 1000000) return `${value / 1000000}tr`
                return value
              }}
            />
            <Tooltip formatter={(value) => [formatCurrency(value as number), "Doanh thu"]} />
            <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
