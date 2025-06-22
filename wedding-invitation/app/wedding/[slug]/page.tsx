"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "@/app/config/api";
import { WeddingInvitation } from "@/interface/WeddingInvitation";

export default function WeddingPage() {
  const params = useParams();
  const [weddingInvitation, setWeddingInvitation] =
    useState<WeddingInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeddingInvitation = async () => {
    try {
      setLoading(true);
      // Fetch wedding invitation by slug
      const response = await axios.get(
        `${API_ENDPOINTS.weddingInvitations}/${params.slug}`,
        {
          params: {
            fields: true,
            template: true,
            slug: true,
          },
        }
      );
      const responseData = response.data as { data: WeddingInvitation };
      setWeddingInvitation(responseData.data);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching wedding invitation:", error);
      setError(
        error.response?.data?.message || "Lỗi khi tải thông tin thiệp cưới"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to replace placeholders in HTML/CSS with actual values
  const replacePlaceholders = (content: string) => {
    let result = content;

    // Handle dynamicFields as array (from API response)
    const dynamicFields = weddingInvitation?.template?.dynamicFields || [];
    if (Array.isArray(dynamicFields)) {
      dynamicFields.forEach((field) => {
        const placeholder = `{{${field.name}}}`;
        result = result.replace(
          new RegExp(placeholder, "g"),
          weddingInvitation?.fields?.[field.name] || ""
        );
      });
    }

    // Also handle direct field replacement for common fields
    if (weddingInvitation?.fields) {
      Object.entries(weddingInvitation.fields).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, "g"), value || "");
      });
    }

    return result;
  };

  useEffect(() => {
    if (params.slug) {
      fetchWeddingInvitation();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !weddingInvitation) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        <main className="container mx-auto py-8 px-4">
          <div className="text-center text-red-500 py-8">
            {error || "Không tìm thấy thiệp cưới"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <main
      className="wedding-invitation-container"
      dangerouslySetInnerHTML={{
        __html: `
          <style>${replacePlaceholders(
            weddingInvitation?.template?.css || ""
          )}</style>
          ${replacePlaceholders(weddingInvitation?.template?.html || "")}
          <script>${weddingInvitation?.template?.js || ""}</script>
        `,
      }}
    />
  );
}
