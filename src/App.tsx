import { useEffect, useMemo, useState } from "react";
import { db, ensureAnon } from "./lib/firebase";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import confetti from "canvas-confetti";
import "./index.css";

import { Mode, Win } from "./types";
import { createBoard, loadBoardByCode } from "./services/board";
import { submitWin } from "./services/wins";

import { HostPanel } from "./components/HostPanel";
import { JoinScreen } from "./components/JoinScreen";
import { SubmitScreen } from "./components/SubmitScreen";
import DisplayBoard from "./components/DisplayBoard";

// UI
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";

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
      query(winsRef, where("status", "==", "approved"), orderBy("createdAt", "desc"), limit(100)),
      (snap) => {
        const next: Win[] = [];
        snap.forEach((d) => next.push({ id: d.id, ...(d.data() as any) }));
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

  function resetToJoin() {
    setMode("join");
    setCode("");
    setBoardId("");
    setText("");
    setEmoji("🎉");
    setWins([]);
  }

  const latest = useMemo(() => wins[0], [wins]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Top Bar */}
      <Card variant="glass" elevation="sm" className="sticky top-4 z-10">
        <CardHeader className="flex flex-wrap items-center gap-3 justify-between">
          <div className="min-w-0">
            <CardTitle as="h1" className="text-2xl md:text-3xl flex items-center gap-2 truncate">
              <span role="img" aria-label="high-five">🙌</span>
              {boardName}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 truncate">
              Playful, light, communal celebration of tiny wins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Code badge */}
            {boardId && (
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-mono text-sm tracking-wider uppercase">
                <span className="text-gray-600">Code</span>
                <span className="text-gray-900">{code}</span>
              </div>
            )}

            {mode !== "join" && (
              <>
                {boardId && mode !== "display" && (
                  <Button size="sm" onClick={() => setMode("display")}>
                    Open Display
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={resetToJoin}>
                  ← Back
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        {/* Host controls */}
        <CardContent className="pt-0">
          <HostPanel
            boardName={boardName}
            setBoardName={setBoardName}
            onCreateBoard={handleCreateBoard}
            code={boardId ? code : undefined}
            onOpenDisplay={() => setMode("display")}
          />
        </CardContent>
      </Card>

      {/* Main Panels */}
      {mode === "join" && (
        <Card variant="glass" elevation="sm">
          <CardContent>
            <JoinScreen code={code} setCode={setCode} onJoin={joinWithCode} />
          </CardContent>
          <CardFooter className="justify-center text-sm text-gray-500">
            Perfect for classrooms, teams, and events ✨
          </CardFooter>
        </Card>
      )}

      {mode === "submit" && (
        <Card variant="glass" elevation="sm">
          <CardContent>
            <SubmitScreen
              text={text}
              setText={setText}
              emoji={emoji}
              setEmoji={setEmoji}
              onSubmit={handleSubmitWin}
              onOpenDisplay={() => setMode("display")}
            />
          </CardContent>
        </Card>
      )}

      {mode === "display" && (
        <Card variant="glass" elevation="sm">
          <CardContent padded={false}>
            <DisplayBoard latest={latest} wins={wins} />
          </CardContent>
        </Card>
      )}

      {/* Gentle empty spacer */}
      <div className="h-6" />
    </div>
  );
}