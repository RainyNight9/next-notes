"use server";

import { redirect } from "next/navigation";
import { addNote, updateNote, delNote } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sleep } from "@/lib/utils";
import { TEditorFormState } from "@/types";

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
