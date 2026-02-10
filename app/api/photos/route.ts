import { google } from "googleapis";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL!,
  key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

export async function GET() {
  // List subfolders (albums) of your main folder
  const foldersRes = await drive.files.list({
    q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id,name)",
    orderBy: "name",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const folders = foldersRes.data.files ?? [];

  // For each folder, fetch images inside
  const albums = await Promise.all(
    folders.map(async (folder) => {
      const imagesRes = await drive.files.list({
        q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
        fields: "files(id,name,description,createdTime)",
        orderBy: "createdTime desc",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });

      const photos = imagesRes.data.files?.map((file) => ({
        id: file.id,
        name: file.name,
        description: file.description ?? "",
        src: `https://drive.google.com/uc?id=${file.id}`,
      }));

      return {
        id: folder.id,
        name: folder.name,
        photos: photos ?? [],
      };
    })
  );

  return NextResponse.json(albums);
}