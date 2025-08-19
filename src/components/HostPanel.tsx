import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const HostPanel = ({
  boardName,
  setBoardName,
  onCreateBoard,
  code,
  onOpenDisplay,
}: {
  boardName: string;
  setBoardName: (v: string) => void;
  onCreateBoard: () => void;
  code?: string;
  onOpenDisplay: () => void;
}) => {
  return (
    <section className="panel">
      <h2>Host</h2>
      <div className="row">
        <Input
          className="text"
          placeholder="Board name"
          value={boardName}
          onChange={(e)=>setBoardName(e.target.value)}
        />
        <Button className="btn" onClick={onCreateBoard}>Create Board</Button>
      </div>
      {code && (
        <div className="hint">
          <strong>Join code:</strong> {code} &nbsp;•&nbsp;
          <Button variant="link" className="link" onClick={onOpenDisplay}>Open Display</Button>
        </div>
      )}
    </section>
  );
}