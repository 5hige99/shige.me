---
title: "Gitでdevブランチをmainブランチにマージする"
date: 2025-01-25
tags: ["Git"]
---

## はじめに
devブランチで作業をしていて、mainブランチにマージしたい場合のgit操作を毎回忘れるのでメモしておきます。

### **1. devブランチの変更をリモートにプッシュ**
```sh
git pull origin dev  # リモートの変更を取り込む
git push origin dev  # devの変更をリモートへプッシュ
```

### **2. mainに切り替えてdevをマージ**
```sh
git switch main  # mainブランチに切り替え
git pull origin main  # 念のためリモートのmainも最新にする
git merge dev  # devの変更をmainに統合
```

競合が発生した場合は手動で解決し、修正後に 
```sh
git commit
```

### **3. mainの変更をリモートへプッシュ**
```sh
git push origin main
```
これで `dev` の変更が `main` に反映されます。

### **4. devを続けて使う場合**
引き続き `dev` で開発を続ける場合は、そのまま `dev` に戻って作業を継続できます。

```sh
git switch dev
```

**もし devをリセットしたい場合（mainから新しく作り直す場合）**
```sh
git branch -D dev  # ローカルのdevを削除
git switch -c dev  # mainから新しくdevを作成
git push -u origin dev  # リモートにプッシュ
```