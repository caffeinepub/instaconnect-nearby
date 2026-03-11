import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Instagram, Loader2, Lock, MapPin, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddEntry } from "../hooks/useQueries";

const CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Surat",
  "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareModal({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [area, setArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [pin, setPin] = useState("");
  const { mutateAsync, isPending } = useAddEntry();

  const finalArea = area === "Other" ? customArea : area;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !username.trim() ||
      !finalArea.trim() ||
      pin.length !== 4
    ) {
      toast.error("Sab fields sahi se bharo, PIN 4 digits ka hona chahiye");
      return;
    }
    try {
      await mutateAsync({
        name: name.trim(),
        instagramUsername: username.trim().replace(/^@/, ""),
        area: finalArea.trim(),
        pin: BigInt(pin),
      });
      toast.success("Instagram ID share ho gayi! 🎉");
      setName("");
      setUsername("");
      setArea("");
      setCustomArea("");
      setPin("");
      onOpenChange(false);
    } catch {
      toast.error("Kuch galat hua, dobara try karo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="share.dialog"
        className="sm:max-w-md rounded-2xl"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 insta-gradient rounded-xl flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg">
                Apni Instagram ID Share Karo
              </DialogTitle>
              <DialogDescription className="text-xs">
                Community ke saath voluntarily share karo
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="share-name"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <User className="w-3.5 h-3.5" /> Aapka Naam
            </Label>
            <Input
              id="share-name"
              data-ocid="share.name_input"
              placeholder="Jaise: Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label
              htmlFor="share-username"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <Instagram className="w-3.5 h-3.5" /> Instagram Username
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                @
              </span>
              <Input
                id="share-username"
                data-ocid="share.username_input"
                placeholder="username (@ ke bina)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-7"
                required
              />
            </div>
          </div>

          {/* Area */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5" /> Aapka Shehar
            </Label>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger data-ocid="share.area_select">
                <SelectValue placeholder="Shehar chuniye..." />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {area === "Other" && (
              <Input
                placeholder="Apna shehar likhiye"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                className="mt-1"
              />
            )}
          </div>

          {/* PIN */}
          <div className="space-y-1.5">
            <Label
              htmlFor="share-pin"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <Lock className="w-3.5 h-3.5" /> 4-Digit PIN (Delete ke liye)
            </Label>
            <Input
              id="share-pin"
              data-ocid="share.pin_input"
              type="password"
              inputMode="numeric"
              placeholder="••••"
              maxLength={4}
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              required
            />
            <p className="text-xs text-muted-foreground">
              Ye PIN yaad rakhna — baad mein delete karne ke kaam aayega
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              data-ocid="share.cancel_button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Ruk Jao
            </Button>
            <Button
              type="submit"
              data-ocid="share.submit_button"
              disabled={isPending}
              className="flex-1 insta-gradient text-white border-0 rounded-full font-semibold"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isPending ? "Share ho raha hai..." : "Share Karo! 🚀"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
