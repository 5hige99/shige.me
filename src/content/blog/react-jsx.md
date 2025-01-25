---
title: "React の JSX はなぜ親要素で囲む必要があるのか"
date: 2025-01-04
tags: ["React"]
---
## はじめに
Reactを書いていると複数の要素がある場合は親要素で囲むを無意識的に書いているが、なぜ親要素で囲む必要があるのかを説明できるか？って言われた時に少しあれ？なんでだっけと思ったのでなぜなのかを調べてみました。

### 1. **JavaScript の構文ルール**
JSX はコンパイル時に JavaScript に変換されます。次のような JSXは

```javascript
<div>Hello</div>
<div>World</div>
```

以下のように変換されます。

```javascript
React.createElement('div', null, 'Hello');
React.createElement('div', null, 'World');
```

これでは JavaScript の文法的にエラーとなります。なぜなら、JavaScript の構文上、一つの式（`React.createElement`）しか返すことができないからです。つまり、この上記のサンプルコードはどれが親ルートか分からない状況となっているのです。なので複数の要素を返すには、それらを一つの親要素で囲む必要があります。

### 2. **React のレンダリングロジック**
React のコンポーネントは **単一の要素を返すこと** が期待されています。

```javascript
function App() {
  return (
    <div>Hello</div>
    <div>World</div>
  );
}
```

このコードでは、React が「どの要素がルート（親要素）であるか」を判断できません。React は仮想 DOM を作成する際に、ツリー構造を必要とします。複数のルート要素があると、React はそれをどのように管理するか判断できなくなります。

### 3. **親要素を作る方法**
JSX では親要素で囲むことでこの問題を解決します。例えば、次のように書きます。

```javascript
function App() {
  return (
    <div>
      <div>Hello</div>
      <div>World</div>
    </div>
  );
}
```

### 4. **Fragment の利用**
親要素を作るたびに余計な `<div>` を追加したくない場合、React の **Fragment** を利用できます。

```javascript
function App() {
  return (
    <>
      <div>Hello</div>
      <div>World</div>
    </>
  );
}
```

`<></>` は実際には DOM に追加されないため、不要な要素を作成せずに複数の要素を返せます。

## さいごに
普段無意識にできていることでも今回のように実際わかっていなかったことに怖くなった。ついできないことばかりに目が行きがちだが、もう一度できていたつもりだった知識を学び直すのも大事かもしれない。