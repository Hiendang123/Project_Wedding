import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const EXPRESS_API_URL = `http://localhost:${
  process.env.SERVER_PORT || 3001
}/api`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("🏴‍☠️ Fetching template:", id);
    console.log("🏴‍☠️ Express API URL:", `${EXPRESS_API_URL}/templates/${id}`);

    // Try to fetch from Express server first
    try {
      const response = await axios.get(`${EXPRESS_API_URL}/templates/${id}`, {
        timeout: 5000, // 5 second timeout
      });

      console.log("🏴‍☠️ Template fetched from Express:", response.data);
      return NextResponse.json(response.data, { status: response.status });
    } catch (expressError: any) {
      console.warn("⚠️ Express server not available, using fallback data");

      // 🏴‍☠️ Fallback template data - GenG style!
      const fallbackTemplate = {
        _id: id,
        name: "Thiệp mẫu đỏ hiện đại",
        category: "modern",
        price: "paid",
        priceAmount: 20000,
        comparePrice: 50000,
        status: "active",
        thumbnail: "/placeholder.jpg",
        html: `
          <div style="text-align: center; padding: 40px; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; border-radius: 15px; margin: 20px;">
            <h1 style="font-size: 28px; margin-bottom: 20px;">💕 {{tên_cô_dâu}} & {{tên_chú_rể}}</h1>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="margin: 0 0 10px 0;">🎊 Kính mời tham dự</h2>
              <p style="margin: 5px 0;">Lễ cưới của chúng tôi</p>
              <p style="margin: 5px 0; font-weight: bold;">{{ngày_cưới}}</p>
              <p style="margin: 5px 0;">Tại: {{tên_địa_điểm}}</p>
              <p style="margin: 5px 0;">{{địa_chỉ}}</p>
            </div>
            <p style="font-style: italic; opacity: 0.9;">Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi!</p>
          </div>
        `,
        css: `
          body {
            font-family: 'Georgia', serif;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
          }
          .invitation-card {
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
        `,
        js: `
          console.log('🎊 Wedding invitation template loaded');
          // Add any interactive features here
        `,
        dynamicFields: [
          {
            id: "1",
            name: "tên_cô_dâu",
            type: "text",
            defaultValue: "Cô Dâu",
            description: "Tên cô dâu",
          },
          {
            id: "2",
            name: "tên_chú_rể",
            type: "text",
            defaultValue: "Chú Rể",
            description: "Tên chú rể",
          },
          {
            id: "3",
            name: "ngày_cưới",
            type: "date",
            defaultValue: "01/01/2024",
            description: "Ngày cưới",
          },
          {
            id: "4",
            name: "tên_địa_điểm",
            type: "text",
            defaultValue: "Nhà hàng ABC",
            description: "Tên địa điểm",
          },
          {
            id: "5",
            name: "địa_chỉ",
            type: "text",
            defaultValue: "123 Đường ABC, Quận 1, TP.HCM",
            description: "Địa chỉ",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      };

      return NextResponse.json(fallbackTemplate);
    }
  } catch (error: any) {
    console.error("🚨 Error fetching template:", error);

    return NextResponse.json(
      {
        error: "Không thể tải template",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
