import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Setting06Icon } from "@hugeicons/core-free-icons";

interface SettingsDialogProps {
  pangramLang: "tagalog" | "english";
  onPangramChange: (lang: "tagalog" | "english") => void;
}

export default function SettingsDialog({
  pangramLang,
  onPangramChange,
}: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="sm" />}>
        <HugeiconsIcon icon={Setting06Icon} size={16} />
        Settings
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Settings</DialogTitle>
          <DialogDescription>
            Configure the preview text language.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Preview Language</Label>
            <div className="flex gap-2">
              <Button
                variant={pangramLang === "tagalog" ? "default" : "outline"}
                size="sm"
                onClick={() => onPangramChange("tagalog")}
              >
                Tagalog
              </Button>
              <Button
                variant={pangramLang === "english" ? "default" : "outline"}
                size="sm"
                onClick={() => onPangramChange("english")}
              >
                English
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
