import { defineConfig } from "vite";

export default defineConfig({
  experimental: {
    renderBuiltUrl: function (filename, { hostType }) {
      if (hostType === "js") {
        return { runtime: `window.__prependStaticUrl("${filename}")` };
      } else if (hostType === "html") {
        return `./${filename}`;
      }

      return { relative: true };
    },
  },
});
