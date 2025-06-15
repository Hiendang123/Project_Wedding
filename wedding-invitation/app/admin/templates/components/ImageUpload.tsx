import { ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (file: File | null) => void;
  label: string;
  description?: string;
}

export function ImageUpload({ currentImage, onImageChange, label, description }: ImageUploadProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="mt-2 flex items-center gap-x-3">
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300">
          <Image
            src={currentImage}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Chọn ảnh
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
} 