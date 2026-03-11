import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Heart, Instagram, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import ProfileCard from "./components/ProfileCard";
import ShareModal from "./components/ShareModal";
import { useGetAllEntries } from "./hooks/useQueries";

const queryClient = new QueryClient();
const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

function AppContent() {
  const [search, setSearch] = useState("");
  const [activeArea, setActiveArea] = useState("All");
  const [shareOpen, setShareOpen] = useState(false);
  const { data: entries = [], isLoading } = useGetAllEntries();

  const areas = useMemo(() => {
    const unique = Array.from(
      new Set(entries.map((e) => e.area).filter(Boolean)),
    );
    return ["All", ...unique];
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchArea = activeArea === "All" || e.area === activeArea;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.instagramUsername.toLowerCase().includes(q);
      return matchArea && matchSearch;
    });
  }, [entries, activeArea, search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="insta-gradient text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight">
                  InstaConnect
                </h1>
                <p className="text-white/70 text-xs">
                  Nearby Instagram Community
                </p>
              </div>
            </div>
            <Button
              type="button"
              data-ocid="header.share_button"
              onClick={() => setShareOpen(true)}
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg gap-2 rounded-full px-6"
            >
              <Plus className="w-4 h-4" />
              Apni ID Share Karo
            </Button>
          </div>
          {/* Hero text */}
          <div className="mt-8 mb-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Aas Paas ki
              <br />
              <span className="text-white/80">Instagram IDs</span>
            </h2>
            <p className="mt-2 text-white/70 text-sm max-w-md">
              Apni community ke logo se connect karo — voluntarily share karo
              aur doosron ko dhundho.
            </p>
          </div>
        </div>
        {/* Wave bottom */}
        <div
          className="h-8 bg-background"
          style={{ clipPath: "ellipse(100% 100% at 50% 100%)" }}
        />
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="entries.search_input"
            placeholder="Naam ya username se search karo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full border-border"
          />
        </div>

        {/* Area filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {areas.map((area) => (
            <button
              type="button"
              key={area}
              data-ocid="entries.area_filter.tab"
              onClick={() => setActiveArea(area)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeArea === area
                  ? "insta-gradient text-white shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="entries.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="p-4 rounded-2xl border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <motion.div
            data-ocid="entries.empty_state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 insta-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Instagram className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Koi ID nahi mili
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {entries.length === 0
                ? "Pehle aap apni Instagram ID share karo!"
                : "Is area mein koi nahi mila. Filter badlo."}
            </p>
            <Button
              type="button"
              onClick={() => setShareOpen(true)}
              className="insta-gradient text-white rounded-full px-6 border-0"
            >
              <Plus className="w-4 h-4 mr-2" /> Abhi Share Karo
            </Button>
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <motion.div
            data-ocid="entries.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filtered.map((entry, idx) => (
                <ProfileCard key={String(entry.id)} entry={entry} index={idx} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border text-center">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
          © {new Date().getFullYear()}. Built with{" "}
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
