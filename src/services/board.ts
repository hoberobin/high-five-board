import { db } from "../lib/firebase";
import {
  addDoc, collection, getDocs, limit, query, serverTimestamp, where
} from "firebase/firestore";

export const createBoard = async (name: string, moderation = false) => {
  const animals = ["FOX","OWL","ELK","BEE","LYNX","OTTER","DOVE","HARE","MOTH"];
  const code = `${animals[Math.floor(Math.random()*animals.length)]}-${Math.floor(Math.random()*900+100)}`;

  const ref = await addDoc(collection(db, "boards"), {
    name,
    code,
    theme: "confetti",
    moderation,
    createdAt: serverTimestamp(),
  });
  return { boardId: ref.id, code };
}

export const loadBoardByCode = async (code: string) => {
  const q = query(
    collection(db, "boards"),
    where("code", "==", code.toUpperCase()),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...(doc.data() as any) };
}