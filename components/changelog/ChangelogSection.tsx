import { formatDate, formatDistance, parseISO } from "date-fns";
import type { ChangelogItem } from "./types";

export function ChangelogSection({ items }: { items: ChangelogItem[] }) {
  return (
    <section id="changelog">
      <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-4">
        {items?.map((item) => (
          <div
            key={`changelog-${item.date}`}
            className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6 backdrop-blur-sm"
          >
            <div className="flex justify-center">
              <small
                className="inline-block rounded-full border border-yellow-400/50 bg-zinc-900 px-2 py-0.5 font-medium text-yellow-400 text-xs"
                title={formatDate(parseISO(item.date), "yyyy-MM-dd")}
              >
                {formatDistance(parseISO(item.date), new Date(), {
                  addSuffix: true,
                })}
              </small>
            </div>
            <ul className="mt-4 space-y-2 text-zinc-300">
              {item.changes.map((change, j) => (
                <li
                  key={`${item.date}-change-${j}`}
                  className="flex items-start gap-2"
                >
                  <span className="flex-shrink-0">{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
