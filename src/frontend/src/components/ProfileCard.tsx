import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { InstagramEntry } from "../backend.d";
import DeleteDialog from "./DeleteDialog";

interface Props {
  entry: InstagramEntry;
  index: number;
}

function timeAgo(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Abhi abhi";
  if (minutes < 60) return `${minutes} min pehle`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ghante pehle`;
  const days = Math.floor(hours / 24);
  return `${days} din pehle`;
}

const AVATAR_COLORS = [
  "from-pink-500 to-purple-600",
  "from-orange-400 to-pink-500",
  "from-purple-500 to-indigo-600",
  "from-rose-400 to-orange-500",
  "from-fuchsia-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

export default function ProfileCard({ entry, index }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initials = entry.name.slice(0, 2).toUpperCase();
  const ocidIndex = index + 1;

  return (
    <>
      <motion.div
        data-ocid={`entries.item.${ocidIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="card-hover relative bg-card border border-border rounded-2xl p-4 group"
      >
        {/* Delete button */}
        <button
          type="button"
          data-ocid={`delete.open_modal_button.${ocidIndex}`}
          onClick={() => setDeleteOpen(true)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Avatar + Info */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-foreground truncate">
              {entry.name}
            </p>
            <a
              href={`https://instagram.com/${entry.instagramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary text-sm hover:underline truncate"
            >
              <span className="font-medium">@{entry.instagramUsername}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="gap-1 text-xs font-medium">
            <MapPin className="w-3 h-3" />
            {entry.area}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {timeAgo(entry.timestamp)}
          </span>
        </div>
      </motion.div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        entryId={entry.id}
        entryName={entry.name}
      />
    </>
  );
}
