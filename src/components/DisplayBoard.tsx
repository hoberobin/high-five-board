import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Win } from "../types";

const DisplayBoard = ({
  latest,
  wins,
}: {
  latest: Win | undefined;
  wins: Win[];
}) => {
  return (
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
        {wins.map((w) => (
          <Card key={w.id} className="card">
            <div className="em">{w.emoji}</div>
            <div className="txt">{w.text}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}


export default DisplayBoard;
