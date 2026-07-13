import type { Creator } from "../../lib/schema";

const creator: Creator = {
  id: "maria-santos",
  name: "Maria Santos",
  bio: "Type designer from Quezon City. Focuses on clean sans-serif families for digital interfaces.",
  location: "Quezon City",
  links: [
    { label: "GitHub", url: "https://github.com/maria-santos" },
    { label: "Behance", url: "https://behance.net/maria-santos" },
  ],
  fontIds: ["lumin-sans", "lumin-mono"],
};

export default creator;
