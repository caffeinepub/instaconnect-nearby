import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteEntry } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryId: bigint;
  entryName: string;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  entryId,
  entryName,
}: Props) {
  const [pin, setPin] = useState("");
  const { mutateAsync, isPending } = useDeleteEntry();

  const handleDelete = async () => {
    if (pin.length !== 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }
    try {
      await mutateAsync({ id: entryId, pin: BigInt(pin) });
      toast.success(`${entryName}'s ID has been removed`);
      setPin("");
      onOpenChange(false);
    } catch {
      toast.error("Wrong PIN! Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-ocid="delete.dialog"
        className="sm:max-w-sm rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">
            Delete Entry?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Enter your PIN to remove <strong>{entryName}</strong>'s Instagram
            ID.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 my-2">
          <Label
            htmlFor="delete-pin"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Lock className="w-3.5 h-3.5" /> PIN
          </Label>
          <Input
            id="delete-pin"
            data-ocid="delete.pin_input"
            type="password"
            inputMode="numeric"
            placeholder="••••"
            maxLength={4}
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
          />
        </div>

        <AlertDialogFooter className="gap-2">
          <Button
            data-ocid="delete.cancel_button"
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setPin("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            data-ocid="delete.confirm_button"
            variant="destructive"
            className="rounded-full"
            onClick={handleDelete}
            disabled={isPending || pin.length !== 4}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isPending ? "Deleting..." : "Yes, Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
