import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

export const JoinScreen = ({
  code,
  setCode,
  onJoin,
}: {
  code: string;
  setCode: (v: string) => void;
  onJoin: () => void;
}) => {
  const [touched, setTouched] = React.useState(false);

  const formatted = code.toUpperCase().replace(/\s+/g, "");
  const isValid = /^[A-Z]{2,5}-\d{3}$/.test(formatted);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (isValid) onJoin();
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card variant="glass" elevation="sm" className="w-full max-w-md">
        <CardHeader withDivider>
          <CardTitle className="text-2xl">Join a Board</CardTitle>
          <CardDescription>Enter the join code the host is showing.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="sr-only">Join code</span>
              <Input
                value={formatted}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. FOX-271"
                inputMode="text"
                pattern="[A-Z]{2,5}-[0-9]{3}"
                aria-invalid={touched && !isValid ? "true" : undefined}
                aria-describedby="join-hint join-error"
                className="text-center font-mono tracking-wider uppercase h-12 text-lg"
              />
            </label>

            {touched && !isValid ? (
              <p id="join-error" className="text-sm text-red-600">
                Codes look like <span className="font-mono">FOX-271</span>.
              </p>
            ) : (
              <p id="join-hint" className="text-sm text-gray-500">
                Tip: The host will show the code on the projector.
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={!isValid}
            >
              Join & Celebrate 🎉
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};