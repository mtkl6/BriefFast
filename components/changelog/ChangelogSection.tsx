import { formatDate, formatDistance, parseISO } from "date-fns";
import type { ChangelogItem } from "./types";

export function ChangelogSection({ items }: { items: ChangelogItem[] }) {
  return (
    <section id="changelog">
      <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-6 text-left">
        {items?.map((item) => (
          <div
            key={`changelog-${item.date}`}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm"
          >
            <small
              className="inline-block rounded-full border border-yellow-400/50 bg-zinc-900 px-3 py-1 font-medium text-yellow-400 text-xs"
              title={formatDate(parseISO(item.date), "yyyy-MM-dd")}
            >
              {formatDistance(parseISO(item.date), new Date(), {
                addSuffix: true,
              })}
            </small>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-zinc-300">
              {item.changes.map((change, j) => (
                <li key={`${item.date}-change-${j}`}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
