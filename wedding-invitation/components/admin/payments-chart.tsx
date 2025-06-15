"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const monthlyData = [
  { name: "T1", value: 42 },
  { name: "T2", value: 48 },
  { name: "T3", value: 52 },
  { name: "T4", value: 60 },
  { name: "T5", value: 55 },
  { name: "T6", value: 65 },
  { name: "T7", value: 73 },
  { name: "T8", value: 71 },
  { name: "T9", value: 80 },
  { name: "T10", value: 74 },
  { name: "T11", value: 60 },
  { name: "T12", value: 82 },
]

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1}`,
  value: Math.floor(Math.random() * 5) + 1,
}))

const yearlyData = [
  { name: "2020", value: 250 },
  { name: "2021", value: 420 },
  { name: "2022", value: 580 },
  { name: "2023", value: 780 },
]

type TimeRange = "daily" | "monthly" | "yearly"

export function PaymentsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly")

  // Chọn dữ liệu dựa trên timeRange
  const data = {
    daily: dailyData,
    monthly: monthlyData,
    yearly: yearlyData,
  }[timeRange]

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
          <LineChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} giao dịch`, "Số lượng"]} />
            <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
