import { useEffect, useMemo, useState } from "react";
import { db, ensureAnon } from "./lib/firebase";
import {
  addDoc, collection, getDocs, limit, onSnapshot,
  orderBy, query, serverTimestamp, where
} from "firebase/firestore";
import confetti from "canvas-confetti";
import "./index.css";

type Win = { id: string; text: string; emoji: string; status: string };

function makeCode() {
  const animals = ["FOX","OWL","ELK","BEE","LYNX","OTTER","DOVE","HARE","MOTH"];
  return `${animals[Math.floor(Math.random()*animals.length)]}-${Math.floor(Math.random()*900+100)}`;
}

export default function App() {
  const [mode, setMode] = useState<"join"|"submit"|"display"|"host">("join");
  const [boardId, setBoardId] = useState("");
  const [boardName, setBoardName] = useState("High Five Board");
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [wins, setWins] = useState<Win[]>([]);
  const [moderation] = useState(false); // toggle true to test pending flow

  useEffect(() => { ensureAnon(); }, []);

  // Live listener for Display
  useEffect(() => {
    if (mode !== "display" || !boardId) return;
    const winsRef = collection(db, "boards", boardId, "wins");
    const unsub = onSnapshot(
      query(winsRef, where("status","==","approved"), orderBy("createdAt","desc"), limit(100)),
      (snap) => {
        const next: Win[] = [];
        snap.forEach(d => next.push({ id: d.id, ...(d.data() as any) }));
        if (wins[0]?.id && next[0]?.id && next[0].id !== wins[0].id) confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        setWins(next);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, boardId]);

  async function createBoard() {
    const c = makeCode();
    const ref = await addDoc(collection(db, "boards"), {
      name: boardName,
      code: c,
      theme: "confetti",
      moderation,
      createdAt: serverTimestamp(),
    });
    setBoardId(ref.id);
    setCode(c);
    setMode("display"); // host typically opens display right away
  }

  async function loadBoardByCode(c: string) {
    const q = query(collection(db, "boards"), where("code","==", c.toUpperCase()), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
  }

  async function joinWithCode() {
    const b = await loadBoardByCode(code);
    if (!b) return alert("Board code not found");
    setBoardId(b.id);
    setMode("submit");  // Join Screen → Submit Screen
  }

  async function submitWin() {
    if (!text.trim() || !boardId) return;
    await addDoc(collection(db, "boards", boardId, "wins"), {
      text: text.trim(),
      emoji,
      status: moderation ? "pending" : "approved",
      createdAt: serverTimestamp(),
    });
    setText("");
    // small client-side confetti for the participant
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
  }

  const latest = useMemo(() => wins[0], [wins]);

  return (
    <div className="wrap">
      <header className="header">
        <h1>🙌 High Five Board</h1>
        <p>Playful, light, communal celebration of tiny wins.</p>
      </header>

      {/* Host: create a board & show code */}
      <section className="panel">
        <h2>Host</h2>
        <div className="row">
          <input
            className="text"
            placeholder="Board name"
            value={boardName}
            onChange={(e)=>setBoardName(e.target.value)}
          />
          <button className="btn" onClick={createBoard}>Create Board</button>
        </div>
        {boardId && (
          <div className="hint">
            <strong>Join code:</strong> {code} &nbsp;•&nbsp;
            <button className="link" onClick={()=>setMode("display")}>Open Display</button>
          </div>
        )}
      </section>

      {/* 1) Join Screen */}
      {mode === "join" && (
        <section className="panel">
          <h2>Join</h2>
          <div className="row">
            <input
              className="code"
              placeholder="Enter code e.g. FOX-271"
              value={code}
              onChange={(e)=>setCode(e.target.value.toUpperCase())}
            />
            <button className="btn" onClick={joinWithCode}>Join</button>
          </div>
          <p className="muted">Tip: The host will show the code on the projector.</p>
        </section>
      )}

      {/* 2) Submit Screen */}
      {mode === "submit" && (
        <section className="panel">
          <h2>Submit a tiny win</h2>
          <div className="row">
            <input
              className="text"
              placeholder="What tiny win?"
              value={text}
              maxLength={140}
              onChange={(e)=>setText(e.target.value)}
            />
            <input
              className="emoji"
              value={emoji}
              onChange={(e)=>setEmoji(e.target.value)}
            />
            <button className="btn" onClick={submitWin}>Celebrate!</button>
            <button className="ghost" onClick={()=>setMode("display")}>Open Display</button>
          </div>
        </section>
      )}

      {/* 3) Display Board Screen */}
      {mode === "display" && (
        <section className="panel display">
          <h2>Display Board</h2>
          {latest ? (
            <div className="spotlight">
              <div className="big">{latest.emoji}</div>
              <div className="headline">{latest.text}</div>
            </div>
          ) : (
            <p className="muted">Waiting for wins…</p>
          )}

          <div className="grid">
            {wins.map(w => (
              <div key={w.id} className="card">
                <div className="em">{w.emoji}</div>
                <div className="txt">{w.text}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}