import * as React from "react";
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
  onCreateBoard: () => void | Promise<void>;
  code?: string;
  onOpenDisplay: () => void;
}) => {
  const [creating, setCreating] = React.useState(false);
  const trimmed = boardName.trim();

  async function handleCreate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!trimmed) return;
    try {
      setCreating(true);
      await Promise.resolve(onCreateBoard());
    } finally {
      setCreating(false);
    }
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // noop
    }
  }

  return (
    <section className="space-y-4">
      {/* Title & hint */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Host a Board</h2>
        <p className="text-sm text-gray-500">
          Name your board and spin it up. You’ll get a short join code to share.
        </p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <Input
          placeholder="Board name (e.g. 5th Grade Wins, Weekly Shoutouts)"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          className="h-12 text-base"
        />
        <Button
          type="submit"
          className="h-12"
          disabled={!trimmed || creating}
          isLoading={creating}
        >
          Create Board
        </Button>
      </form>

      {/* Active board info */}
      {code && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white/70 px-4 py-3 border border-white/30">
          <div className="text-sm text-gray-600">Join code</div>
          <div className="font-mono tracking-wider uppercase text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            {code}
          </div>

          <div className="ms-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyCode}>
              Copy
            </Button>
            <Button size="sm" onClick={onOpenDisplay}>
              Open Display
            </Button>
          </div>

          {/* Optional share link (commented out; uncomment if you want) */}
          {/* <div className="w-full text-xs text-gray-500 pt-1">
            Share link: {typeof window !== "undefined" ? `${window.location.origin}?code=${code}` : ""}
          </div> */}
        </div>
      )}
    </section>
  );
};