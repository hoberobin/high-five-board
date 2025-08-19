import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const SubmitScreen = ({
  text,
  setText,
  emoji,
  setEmoji,
  onSubmit,
  onOpenDisplay,
}: {
  text: string;
  setText: (v: string) => void;
  emoji: string;
  setEmoji: (v: string) => void;
  onSubmit: () => void;
  onOpenDisplay: () => void;
}) => {
  return (
    <section className="panel">
      <h2>Submit a tiny win</h2>
      <div className="row">
        <Input
          className="text"
          placeholder="What tiny win?"
          value={text}
          maxLength={140}
          onChange={(e)=>setText(e.target.value)}
        />
        <Input
          className="emoji"
          value={emoji}
          onChange={(e)=>setEmoji(e.target.value)}
        />
        <Button className="btn" onClick={onSubmit}>Celebrate!</Button>
        <Button variant="ghost" className="ghost" onClick={onOpenDisplay}>Open Display</Button>
      </div>
    </section>
  );
}