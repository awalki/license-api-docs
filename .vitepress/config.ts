import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "License API",
  description: "Make your programs protected",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "License API Docs",
        items: [
          { text: "Integration", link: "/docs/integration" },
          { text: "Self-hosting", link: "/docs/self-hosting" },
        ],
      },
      {
        text: "Connectors",
        items: [
          { text: "Rust", link: "/docs/integration/connectors/rust" },
          { text: "Python", link: "/docs/integration/connectors/python" },
        ],
      },
      {
        text: "API Reference",
        items: [{ text: "Reference", link: "/docs/api" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/awalki/license_api" },
    ],
  },
});
