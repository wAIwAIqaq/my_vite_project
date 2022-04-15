import { defineConfig, normalizePath } from "vite";
// 引入 path 包注意两点
// 1.为避免类型报错 你需要通过‘pnpm i @types/node -D’ 安装类型
// 2.tsconfig.node.json 中设置 `"allowSyntheticDefaultImports":true`
import path from "path";
import react from "@vitejs/plugin-react";

import autoprefixer from "autoprefixer";

import Windicss from "vite-plugin-windicss";
// 使用normalizePath 解决windows环境下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));
export default defineConfig({
  // 手动指定项目根目录位置
  root: path.join(__dirname, "src"),
  plugins: [
    Windicss(),
    react({
      babel: {
        // 加入babel插件
        plugins: [
          // 适配 styled-component
          "babel-plugin-styled-components",
          // 适配 emotion
          "@emotion/babel-plugin",
        ],
      },
      // 注意：对于emotion,需要单独加上这个配置
      // 通过 “@emotion/react” 包 编译emotion中特殊 jsx 语法
      jsxImportSource: "@emotion/react",
    }),
  ],
  css: {
    // 进行 Postcss 配置
    postcss: {
      plugins: [
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"],
        }),
      ],
    },
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中,name表示当前文件名,local表示类名
      generateScopedName: "[name]_[local]__[hash:base64:5]",
    },
    preprocessorOptions: {
      scss: {
        // additionData 的内容会在每个scss文件的开头自动注入
        additionalData: `@import "${variablePath}";`,
      },
    },
  },
});
