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
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="2.5" />
          <path d="M13.5 8a5.5 5.5 0 0 1-.3 1.8l1.3.8-.9 1.6-1.5-.4a5.5 5.5 0 0 1-1.6 1l-.2 1.7h-1.8l-.2-1.7a5.5 5.5 0 0 1-1.6-1l-1.5.4-.9-1.6 1.3-.8A5.5 5.5 0 0 1 2.5 8a5.5 5.5 0 0 1 .3-1.8L1.5 5.4l.9-1.6 1.5.4a5.5 5.5 0 0 1 1.6-1L5.6 1.5h1.8l.2 1.7a5.5 5.5 0 0 1 1.6 1l1.5-.4.9 1.6-1.3.8c.2.6.3 1.2.3 1.8Z" />
        </svg>
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
