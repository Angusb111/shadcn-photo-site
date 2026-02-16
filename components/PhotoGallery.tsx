//components\PhotoGallery.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import { FloatingBlobs } from "@/components/FloatingBlobs";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface Photo {
  id: string;
  name: string;
  description: string;
  src: string;
  thumb?: string | null;
  full?: string | null;
  createdTime?: string;
  width?: number;
  height?: number;
}

interface Album {
  id: string;
  name: string;
  photos: Photo[];
}

export function PhotoGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch("/api/photos");
        const data: Album[] = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbums();
  }, []);

  if (loading) return <Loader />;

  if (albums.length === 0) return <p className="text-center mt-10">No albums found.</p>;

  return (
    <div className="relative min-h-screen">
      <FloatingBlobs isOpen={!!selectedPhoto} />
      <div className="relative z-10 p-4">
        <Tabs defaultValue={albums[0].id} className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 bg-uu border h-auto">
            {albums.map((album) => (
              <TabsTrigger key={album.id} value={album.id}>
                {album.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {albums.map((album) => (
            <TabsContent key={album.id} value={album.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {album.photos.map((photo) => {
                  const fallback = photo.name.replace(/\.[^/.]+$/, "");
                  return (
                    <motion.div key={photo.id} whileHover={{ scale: 1.015 }}>
                      <Card
                        className="overflow-hidden rounded-sm shadow-md cursor-pointer p-0"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <CardContent className="p-0">
                          <div className="relative w-full aspect-[3/2]">
                            <Image
                              src={photo.thumb || photo.src}
                              alt={photo.description || fallback}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
<Dialog
  open={!!selectedPhoto}
  onOpenChange={() => setSelectedPhoto(null)}
>
  <DialogContent
    className={`
      bg-black/0
      p-0
      flex justify-center items-center
      w-full h-full
      border-none
    `}
  >
    {selectedPhoto && (
      <div
        className="relative flex flex-col items-left justify-center min-h-[80vh] max-h-[95vh] max-w-[95vw] p-4"
      >
        {/* Image */}
        <div className="relative w-auto h-full flex justify-center items-center">
          <Image
            src={selectedPhoto.full || selectedPhoto.src}
            alt={selectedPhoto.description || selectedPhoto.name}
            width={selectedPhoto.width || 4000}
            height={selectedPhoto.height || 6000}
            className="object-contain max-h-[80vh] max-w-[100vw] h-auto w-auto"
          />
        </div>
        {/* Caption */}
        <div className="mt-4 text-left text-white max-w-[95vw]">
          <DialogTitle className="text-lg sm:text-xl md:text-5xl opacity-90 font-normal coolvetica">
            {selectedPhoto.description || selectedPhoto.name.replace(/\.[^/.]+$/, "")}
          </DialogTitle>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}