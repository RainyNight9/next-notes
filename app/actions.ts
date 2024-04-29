"use server";

import { redirect } from "next/navigation";
import { addNote, updateNote, delNote } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sleep } from "@/lib/utils";
import { TEditorFormState } from "@/types";
import { stat, mkdir, writeFile } from 'fs/promises'
import { join } from "path";
import mime from "mime";
import dayjs from 'dayjs';

const schema = z.object({
  title: z.string(),
  content: z.string().min(1, "请填写内容").max(100, "字数最多 100"),
});

export async function saveNote(
  prevState: TEditorFormState,
  formData: FormData
) {
  const noteId = formData.get("noteId") as string;

  const data = {
    title: formData.get("title"),
    content: formData.get("body"),
    updateTime: new Date(),
  };

  // 校验数据
  const validated = schema.safeParse(data);
  if (!validated.success) {
    return {
      errors: validated.error.issues,
    };
  }

  // 为了让效果更明显
  await sleep(1000);

  const str = JSON.stringify(data);

  if (noteId) {
    updateNote(noteId, str);
    revalidatePath("/", "layout");
  } else {
    const res = await addNote(str);
    revalidatePath("/", "layout");
  }
  return { message: `Add Success!` };
}

export async function deleteNote(
  prevState: TEditorFormState,
  formData: FormData
) {
  const noteId = formData.get("noteId") as string;
  delNote(noteId);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function importNote(formData: FormData) {
  const file = formData.get('file') as File;

  // 空值判断
  if (!file) {
    return { error: "File is required." };
  }

  // 写入文件
  const buffer = Buffer.from(await file.arrayBuffer());
  const relativeUploadDir = `/uploads/${dayjs().format("YY-MM-DD")}`;
  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(e)
      return { error: "Something went wrong." }
    }
  }

  try {
    // 写入文件
    const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
    const filename = file.name.replace(/\.[^/.]+$/, "")
    const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
    await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

    // 调用接口，写入数据库
    const res = await addNote(JSON.stringify({
      title: filename,
      content: buffer.toString('utf-8')
    }))

    // 清除缓存
    revalidatePath('/', 'layout')

    return { fileUrl: `${relativeUploadDir}/${uniqueFilename}`, uid: res }
  } catch (e) {
    console.error(e)
    return { error: "Something went wrong." }
  }
}
