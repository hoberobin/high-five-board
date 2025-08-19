import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";

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
  const [touched, setTouched] = React.useState(false);
  const limit = 140;

  const trimmed = text.trim();
  const isValid = trimmed.length > 0 && trimmed.length <= limit && /\p{Emoji}/u.test(emoji);

  const EMOJIS = ["🎉","✨","🎊","🏆","👏","🚀","⭐","🔥","💪","🌟","🥳","💯"];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (isValid) onSubmit();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card variant="glass" elevation="sm" className="w-full max-w-xl">
        <CardHeader withDivider>
          <CardTitle className="text-2xl">Share Your Tiny Win</CardTitle>
          <CardDescription>Keep it short, positive, and fun. Add your favorite emoji!</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Win text */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="win-text">
                Your victory
              </label>
              <Input
                id="win-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Sent that email I was avoiding!"
                maxLength={limit}
                aria-invalid={touched && !trimmed ? "true" : undefined}
                className="h-12 text-base"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                {touched && !trimmed ? (
                  <span className="text-red-600">Please describe your win.</span>
                ) : <span>Keep it under {limit} characters.</span>}
                <span>{trimmed.length}/{limit}</span>
              </div>
            </div>

            {/* Emoji input + quick picks */}
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="emoji">
                Celebration emoji
              </label>
              <div className="flex items-center gap-3">
                <Input
                  id="emoji"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="🎉"
                  className="h-12 w-24 text-center text-xl font-semibold"
                  aria-invalid={touched && !/\p{Emoji}/u.test(emoji) ? "true" : undefined}
                />
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`h-10 w-10 rounded-lg border transition hover:scale-105 ${
                        emoji === em ? "border-purple-500 bg-purple-50" : "border-gray-200"
                      }`}
                      aria-label={`Choose ${em}`}
                      title={em}
                    >
                      <span className="text-xl">{em}</span>
                    </button>
                  ))}
                </div>
              </div>
              {touched && !/\p{Emoji}/u.test(emoji) && (
                <p className="mt-1 text-xs text-red-600">Please use a valid emoji.</p>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                type="submit"
                className="h-12 text-base"
                disabled={!isValid}
              >
                Celebrate! {emoji || "🎉"}
              </Button>
              <Button
                variant="outline"
                className="h-12 text-base"
                type="button"
                onClick={onOpenDisplay}
              >
                Open Display
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-gray-500">
          Your win appears on the big board in real-time ✨
        </CardFooter>
      </Card>
    </div>
  );
};