export type Mode = "join" | "submit" | "display" | "host";

export type Win = {
  id: string;
  text: string;
  emoji: string;
  status: "approved" | "pending" | "hidden";
  createdAt?: any; // Firestore Timestamp
};