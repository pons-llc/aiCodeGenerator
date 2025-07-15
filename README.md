# Gemini Code Generator for kintone

このプラグインは、kintoneアプリのフィールド構成をもとに、Google Gemini API（Generative Language API）を使用してJavaScriptカスタマイズコードを自動生成するツールです。

## 機能概要

- kintoneアプリのフィールド一覧を取得し、波括弧付きで表示ボタンを生成
- ユーザーが入力したプロンプト内容とイベント条件をもとに、Gemini APIにリクエスト送信
- kintone.proxyを使ったAPIキーの保存と認証対応
- 生成されたコードをテキストエリアに表示し、JSファイルとしてダウンロード可能
- サンプルコード（非表示、submitエラー、lookup、サブテーブル形式）も事前に参考情報として送信

## セットアップ

### 1. Google Gemini API キーの取得

[Google AI Studio](https://makersuite.google.com/app) からAPIキーを取得してください。

### 2. プラグイン設定画面でのAPIキー保存

初回読み込み時、APIキー入力欄が表示されます。取得したキーを入力し、「保存」ボタンをクリックして設定してください。設定後、再度プラグイン設定画面を開きます。

## 使い方

1. プラグイン設定画面で、生成したい内容をテキストエリアに入力します。
2. `{フィールドコード}` ボタンをクリックすることで、アプリのフィールドコードを挿入可能です。
3. 実行イベントと詳細条件をプルダウンから選択します。
4. 「生成」ボタンをクリックすると、Gemini API へのリクエストが送信され、結果が画面に表示されます。
5. 「ダウンロード」ボタンで、生成されたコードブロックのみを抽出し `.js` ファイルとして保存可能です。

## 依存API

- Google Generative Language API (Gemini)
- kintone REST API
- kintone.proxy (プラグイン内でAPIキーの秘匿と送信を実現)
## ライセンス
MITライセンスにて提供

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
