import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
// export default defineConfig({
export default withMermaid({
  title: "Blog&Notes",
  description: "Just playing around",
  appearance: false, // 禁用外观切换功能，隐藏深色模式切换按钮
  base: "/blog/",
  srcDir: "posts",
  head: [["link", { rel: "icon", href: "/blog/favIcon.svg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "家", link: "/" },
      { text: "collection", link: "/archive" },
    ],

    sidebar: [],

    socialLinks: [{ icon: "github", link: "" }],
  },
  markdown: {
    config: (md) => {
      // md.use(mermaidLess, { debug: () => {} });
    },
  },
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },
  vite: {
    optimizeDeps: {
      include: ["mermaid"],
    },
  },
});
