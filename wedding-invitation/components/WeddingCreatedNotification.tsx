"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit3, Share2, X } from "lucide-react";

interface WeddingCreatedNotificationProps {
  show: boolean;
  onClose: () => void;
  weddingSlug?: string;
}

export function WeddingCreatedNotification({
  show,
  onClose,
  weddingSlug,
}: WeddingCreatedNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="max-w-sm border-pink-200 dark:border-pink-800 shadow-lg">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <Badge
                variant="secondary"
                className="bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300"
              >
                Thiệp cưới đã tạo
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">
              🎉 Thiệp cưới của bạn đã sẵn sàng!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Bạn có thể chỉnh sửa thông tin cô dâu, chú rể và các chi tiết khác
              bất cứ lúc nào.
            </p>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Edit3 className="h-3 w-3 mr-1" />
              Chỉnh sửa
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Share2 className="h-3 w-3 mr-1" />
              Chia sẻ
            </Button>
          </div>

          {weddingSlug && (
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                Link thiệp cưới:
              </p>
              <p className="font-mono text-gray-700 dark:text-gray-300 break-all">
                /wedding/{weddingSlug}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
