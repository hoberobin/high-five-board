import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Win } from "../types";

type Props = {
  latest?: Win;
  wins: Win[];
};

const DisplayBoard: React.FC<Props> = ({ latest, wins }) => {
  return (
    <div className="space-y-8">
      {/* Spotlight / Empty */}
      {latest ? (
        <Card
          variant="glass"
          elevation="md"
          className="overflow-hidden"
        >
          <CardContent padded={false}>
            <div className="relative isolate">
              {/* subtle gradient glow */}
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6),transparent_60%)]" />
              <div className="px-6 py-10 md:py-12 grid place-items-center text-center">
                <div className="text-7xl md:text-8xl leading-none mb-4">
                  {latest.emoji}
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                  {latest.text}
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  Newest celebration ✨
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card variant="glass" elevation="sm">
          <CardHeader>
            <CardTitle className="text-center w-full">Waiting for Wins…</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid place-items-center py-10 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-600">
                Share the join code and celebrate your first tiny victory!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid of previous wins */}
      {wins.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
            Previous Celebrations
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wins.map((w, i) => (
              <Card
                key={w.id}
                variant="glass"
                elevation="sm"
                hoverable
                className="group transition-all duration-200"
              >
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl shrink-0">{w.emoji}</div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 group-hover:translate-x-[0.5px] transition">
                        {w.text}
                      </div>
                      {/* optional: subtle index badge */}
                      <div className="mt-1 text-xs text-gray-500">
                        #{String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayBoard;