import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "@auth0/nextjs-auth0";

const f = createUploadthing();

export const ourFileRouter = {
  videoUploader: f({ video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getSession();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.sub };
    })
    .onUploadComplete(async ({ middlewareData, file }) => {
      return { uploadedBy: middlewareData.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
