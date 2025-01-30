---
title: "個人ブログにノートブロックを追加した"
date: 2025-01-30
tags: ["Markdown", "Astro"]
---

ZennやQiitaなどのブログサービスではノートブロックが独自の記法で表示できるようになっています。
- [Zennのマークダウン記法](https://zenn.dev/zenn/articles/markdown-guide#zenn-%E7%8B%AC%E8%87%AA%E3%81%AE%E8%A8%98%E6%B3%95)
- [Qiitaのマークダウン記法](https://qiita.com/Qiita/items/c686397e4a0f4f11683d)

今回はそれらと同じように個人ブログでもノートブロックの記述ができるようにしました。

```markdown
:::note
これは重要な記事です
:::
```

:::note
これは重要な記事です
:::

```markdown
:::warning
警告メッセージをここに書きます
:::
```

:::warning
警告メッセージをここに書きます
:::

```markdown
:::tip
便利な情報をここに書きます
:::
```

:::tip
便利な情報をここに書きます
:::

## 実装手順
:::note
パッケージのインストールはpnpmで行っています。
:::

### remark-directive
まず、Markdownの拡張構文を解析するための`remark-directive`パッケージをインストールします。

```bash
pnpm add remark-directive
```

このパッケージは`:::note`のような独自の記法を解析し、ASTに変換する役割を担います。
:::tip
ASTとはAbstract Syntax Treeの略で、Markdownのパース結果を木構造で表現したものです。
これにより、マークアップとロジックを分離できるようになります。
::: 

### remark-container
次に、コンテナ形式のディレクティブを処理するための`remark-container`パッケージをインストールします。

```bash
pnpm add remark-container
```

このパッケージにより、`:::note`から`:::`で囲まれたブロックをコンテナとして扱うことができます。

### カスタムプラグインの作成
最後に、解析されたディレクティブをHTMLに変換するカスタムプラグインを作成します。`src/plugins/remarkNoteBlock.js`のような形で作成します。

```javascript
import { visit } from 'unist-util-visit';

export function remarkNoteBlock() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const type = node.name;
        
        // div要素としてレンダリング
        data.hName = 'div';
        data.hProperties = {
          class: `note-block note-${type}`,
        };
      }
    });
  };
}
```

### Astroの設定
作成したプラグインをAstroの設定に追加します。`astro.config.mjs`を以下のように更新します。

```javascript
import remarkDirective from 'remark-directive';
import { remarkNoteBlock } from './src/plugins/remarkNoteBlock';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkNoteBlock],
  },
});
```

### スタイリング
最後に、ノートブロックのスタイルを定義します。
`src/styles/global.css`に以下のようなスタイルを記述しました。
```css
.note, .warning, .tip {
  display: flex;
  padding: 1rem;
  margin: 1.5rem 0 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 3.5rem;
  white-space: pre-wrap;
  width: 100%;
}

.note {
  background-color: #f6f8fa;
  border-left: 4px solid #0366d6;
}

.warning {
  background-color: #fff5f5;
  border-left: 4px solid #e53e3e;
}

.tip {
  background-color: #f0fff4;
  border-left: 4px solid #38a169;
} 
```

これで、Markdownファイル内で`:::note`、`:::warning`、`:::tip`の記法を使用してノートブロックを表示できるようになりました！