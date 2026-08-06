import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy.html"),
        "project-bite-me": resolve(
          import.meta.dirname,
          "project/bite-me.html"
        ),
        "project-mp-doors": resolve(
          import.meta.dirname,
          "project/mp-doors.html"
        ),
        "project-zednictvi-kravciv": resolve(
          import.meta.dirname,
          "project/zednictvi-kravciv.html"
        ),
      },
    },
  },
});