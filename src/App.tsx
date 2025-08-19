import { useEffect, useMemo, useState } from "react";
import { db, ensureAnon } from "./lib/firebase";
import {
  collection, limit, onSnapshot, orderBy, query, where
} from "firebase/firestore";
import confetti from "canvas-confetti";
import "./index.css";

import { Mode, Win } from "./types";
import { createBoard, loadBoardByCode } from "./services/board";
import { submitWin } from "./services/wins";

import { HostPanel } from "./components/HostPanel";
import { JoinScreen } from "./components/JoinScreen";
import { SubmitScreen } from "./components/SubmitScreen";
import DisplayBoard from "./components/DisplayBoard";

export default function App() {
  const [mode, setMode] = useState<Mode>("join");
  const [boardId, setBoardId] = useState("");
  const [boardName, setBoardName] = useState("High Five Board");
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [wins, setWins] = useState<Win[]>([]);
  const [moderation] = useState(false);

  useEffect(() => { ensureAnon(); }, []);

  // Live Display listener
  useEffect(() => {
    if (mode !== "display" || !boardId) return;
    const winsRef = collection(db, "boards", boardId, "wins");
    const unsub = onSnapshot(
      query(winsRef, where("status","==","approved"), orderBy("createdAt","desc"), limit(100)),
      (snap) => {
        const next: Win[] = [];
        snap.forEach(d => next.push({ id: d.id, ...(d.data() as any) }));
        if (wins[0]?.id && next[0]?.id && next[0].id !== wins[0].id) {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
        setWins(next);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, boardId]);

  async function handleCreateBoard() {
    const { boardId: id, code: c } = await createBoard(boardName, moderation);
    setBoardId(id);
    setCode(c);
    setMode("display");
  }

  async function joinWithCode() {
    const b = await loadBoardByCode(code);
    if (!b) return alert("Board code not found");
    setBoardId(b.id);
    setMode("submit");
  }

  async function handleSubmitWin() {
    if (!text.trim() || !boardId) return;
    await submitWin(boardId, text, emoji, moderation);
    setText("");
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
  }

  const latest = useMemo(() => wins[0], [wins]);

  return (
    <div className="wrap">
      <header className="header">
        <h1>🙌 High Five Board</h1>
        <p>Playful, light, communal celebration of tiny wins.</p>
      </header>

      <HostPanel
        boardName={boardName}
        setBoardName={setBoardName}
        onCreateBoard={handleCreateBoard}
        code={boardId ? code : undefined}
        onOpenDisplay={() => setMode("display")}
      />

      {mode === "join" && (
        <JoinScreen
          code={code}
          setCode={setCode}
          onJoin={joinWithCode}
        />
      )}

      {mode === "submit" && (
        <SubmitScreen
          text={text}
          setText={setText}
          emoji={emoji}
          setEmoji={setEmoji}
          onSubmit={handleSubmitWin}
          onOpenDisplay={() => setMode("display")}
        />
      )}

      {mode === "display" && (
        <DisplayBoard latest={latest} wins={wins} />
      )}
    </div>
  );
}