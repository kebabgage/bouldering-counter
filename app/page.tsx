"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import { useColours } from "@/hooks/useColours";

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const today = toDateString(new Date());

export default function Home() {
  const [date, setDate] = useState(today);
  const [colours, setColours] = useColours(date);
  const isToday = date === today;

  function shiftDate(days: number) {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + days);
    const next = toDateString(d);
    if (next > today) return;
    setDate(next);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex w-full items-center justify-between text-xl">
          <button onClick={() => shiftDate(-1)}>&larr;</button>
          <span>{isToday ? "Today" : date}</span>
          <button onClick={() => shiftDate(1)} disabled={isToday} className="disabled:opacity-30">
            &rarr;
          </button>
        </div>
        {colours.map((color, index) => (
          <div
            key={color.color}
            className="flex w-full items-center justify-between"
          >
            <Button
              color={color.color}
              disabled={!isToday}
              onClick={() =>
                setColours((prev) =>
                  prev.map((item, i) =>
                    i === index ? { ...item, count: item.count - 1 } : item,
                  ),
                )
              }
            >
              -
            </Button>
            <div className="text-2xl">{color.count}</div>
            <Button
              color={color.color}
              disabled={!isToday}
              onClick={() =>
                setColours((prev) =>
                  prev.map((item, i) =>
                    i === index ? { ...item, count: item.count + 1 } : item,
                  ),
                )
              }
            >
              +
            </Button>
          </div>
        ))}
      </main>
    </div>
  );
}
