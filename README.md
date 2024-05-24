## 安裝
```
git clone https://github.com/stevenhuang226/anime-crawler.git
```
- 或是下載zip檔案並且解壓縮
## 使用
```
node --experimental-websocket main.js
```
- 輸入要搜尋的動漫名稱
![pic1](src/pic1.png)
- 選擇一個片源
![pic2](src/pic2.png)
- 輸入要下載的集數的代碼，冒號，路徑（絕對路徑）並且使用逗號分隔
- 輸入all，冒號，資料夾路徑（絕對路徑），將會在該資料夾內依照順序從1.mp4開始命名
- 輸入 " n " 取消下載
![pic3](src/pic3.png)
```
{code}:{path}, {code}:{path}
```
```
all:{/path/to/folder/}
```
## 支援的網站
1. myself-bbs.com(support download)
2. anime1.me(support download)
## 依賴
- nodejs v20.10 or later
