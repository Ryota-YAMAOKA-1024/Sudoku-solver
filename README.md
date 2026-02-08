# 数独ソルバー

深さ優先探索（DFS）アルゴリズムを用いた数独パズルソルバー。解析過程をリアルタイムで視覚化し、サイバーパンク風の演出を施したWebアプリケーション。

## 開発者

Ryota Yamaoka

## 機能

### 3つのモード

- **Manual-Fill**: 手動で数字を入力（数独ルール違反は自動で拒否）
- **Auto-Fill**: 可解なパズルを自動生成
- **Run**: 深さ優先探索で解析開始

### 視覚化

- 探索中のセルをリアルタイムでハイライト表示
- バックトラック時は赤色でフラッシュ
- 解決時は緑色の成功エフェクト
- 回路基板風のアニメーション演出

### 設定

- 最小解析時間: 5〜120秒
- 最大解析時間: 5〜120秒

## 技術スタック

- React 18 + TypeScript
- Vite
- Tailwind CSS

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build
```

## 使い方

1. **Auto-Fill** をクリックしてパズルを生成、または **Manual-Fill** で手動入力
2. 最小・最大解析時間をスライダーで調整
3. **Run** をクリックして解析開始
4. 左側のパネルで探索状況を確認

## ファイル構成

```
src/
├── components/
│   ├── Cell.tsx            # 個別セル
│   ├── SudokuGrid.tsx      # 9x9グリッド
│   ├── ControlPanel.tsx    # ボタン・スライダー
│   ├── StatusDisplay.tsx   # ステータス表示
│   └── CircuitAnimation.tsx # 回路アニメーション
├── hooks/
│   └── useSudokuSolver.ts  # DFSソルバー
├── utils/
│   ├── validator.ts        # ルール検証
│   └── sudokuGenerator.ts  # パズル生成
├── types/
│   └── index.ts            # 型定義
├── App.tsx
└── index.css
```

## アルゴリズム

深さ優先探索（DFS）を使用:

1. 空のセルを探す
2. 1〜9の数字を順に試す
3. 有効な配置なら次のセルへ再帰
4. 行き詰まったらバックトラック
5. すべてのセルが埋まったら解決
