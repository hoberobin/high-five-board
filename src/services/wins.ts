import { db } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const submitWin = async (boardId: string, text: string, emoji: string, moderation = false) => {
  return addDoc(collection(db, "boards", boardId, "wins"), {
    text: text.trim(),
    emoji,
    status: moderation ? "pending" : "approved",
    createdAt: serverTimestamp(),
  });
}