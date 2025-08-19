import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const JoinScreen = ({
  code,
  setCode,
  onJoin,
}: {
  code: string;
  setCode: (v: string) => void;
  onJoin: () => void;
}) => {
  return (
    <section className="panel">
      <h2>Join</h2>
      <div className="row">
        <Input
          className="code"
          placeholder="Enter code e.g. FOX-271"
          value={code}
          onChange={(e)=>setCode(e.target.value.toUpperCase())}
        />
        <Button className="btn" onClick={onJoin}>Join</Button>
      </div>
      <p className="muted">Tip: The host will show the code on the projector.</p>
    </section>
  );
};