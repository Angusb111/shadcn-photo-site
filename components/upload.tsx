"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export function Upload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Upload Photo
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!selectedFile) return;

              setUploading(true);

              const formData = new FormData();
              formData.append("file", selectedFile);
              formData.append("caption", caption);

              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();
              console.log("Upload result:", data);

              alert(data.success ? "Uploaded to Drive ✅" : "Upload failed ❌");

              setUploading(false);
            }}
            className="flex flex-col gap-6"
          >
            {/* File Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Select image</label>
              <Input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setSelectedFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }}
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-full h-72 rounded-xl overflow-hidden border">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Caption */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Caption</label>
              <Input
                type="text"
                placeholder="e.g. Sunset over the hills..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={uploading}
              className="w-full rounded-xl"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}