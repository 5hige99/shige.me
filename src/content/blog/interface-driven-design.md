---
title: "interfaceを用いて持続可能なソフトウェア設計を目指す"
date: 2025-04-07
tags: ["Java", "ソフトウェア設計"]
---

## TL;DR

- interfaceを使って依存関係を疎結合にする
- 変更に強いソフトウェア設計を実現する
- 実装の詳細を隠蔽することで、変更の影響範囲を最小限に抑える

:::note
記事タイトルからinterfaceのみで変更に強いソフトウェア設計を実現できるとは限りません。あくまでも一つの手法としてinterfaceに焦点を当てて執筆しています。
:::

## interfaceについて

interfaceって何？って聞かれたら、「契約」って答えるかも。

例えば、コンビニのレジ打ちのバイトを考えてみる。

```java
interface CashierOperation {
    void scanItem();
    void calculateTotal();
    void acceptPayment();
}
```

このinterfaceは「レジ打ち」という仕事の契約書みたいなもの。

- 商品をスキャンする
- 合計金額を計算する
- 支払いを受け取る

これらの操作は、誰がやっても同じ結果になるはず。新人でもベテランでも、やることは変わらない。

## interfaceを意識することで何がいいのか

### 1. 変更が楽になる

例えば、決済システムを考えてみよう。

```java
interface PaymentProcessor {
    void processPayment(int amount);
}

class CashPayment implements PaymentProcessor {
    public void processPayment(int amount) {
        System.out.println("現金で" + amount + "円支払い");
    }
}

class CreditCardPayment implements PaymentProcessor {
    public void processPayment(int amount) {
        System.out.println("クレカで" + amount + "円支払い");
    }
}
```

新しい決済方法が追加されても、既存のコードは変更不要。PayPayとかQRコード決済とか、どんどん追加できる。

### 2. テストが書きやすい

モックを使ってテストが簡単に書ける。

```java
class MockPayment implements PaymentProcessor {
    public void processPayment(int amount) {
        // テスト用の実装
    }
}
```

### 3. 依存関係がわかりやすい

interfaceを見るだけで、そのクラスが何をするべきかがわかる。実装の詳細は隠蔽されているから、本質的な部分に集中できる。

## 理解度テスト

自分の理解度を確認するためのメモ。

### 問題1: 依存の問題

以下のコードには問題がある。

```java
class OrderService {
    private CashPayment payment = new CashPayment();
    
    public void checkout(int amount) {
        payment.processPayment(amount);
    }
}
```

#### 問題点
- CashPaymentに直接依存している
- 支払い方法を変更する際にOrderServiceの実装を変更する必要がある
- テストが書きづらい（モック化が難しい）

#### 改善案

```java
class OrderService {
    private PaymentProcessor payment;
    
    public OrderService(PaymentProcessor payment) {
        this.payment = payment;
    }
    
    public void checkout(int amount) {
        payment.processPayment(amount);
    }
}
```

### 問題2: 実装の切り替え

新しい決済方法を追加する場合：

```java
// PayPay決済の追加
class PayPayPayment implements PaymentProcessor {
    public void processPayment(int amount) {
        System.out.println("PayPayで" + amount + "円支払い");
    }
}

// 使用例
OrderService service1 = new OrderService(new CashPayment());
OrderService service2 = new OrderService(new PayPayPayment());
```

### 問題3: テスト容易性

テストコードの例：

```java
@Test
void paymentTest() {
    // テスト用のモック作成
    PaymentProcessor mockPayment = new PaymentProcessor() {
        public void processPayment(int amount) {
            // テスト用の実装
        }
    };
    
    OrderService service = new OrderService(mockPayment);
    service.checkout(1000);
}
```