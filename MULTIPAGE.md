# 海賊嫚說芳療：多頁模組

2026-10-11 本機改版，尚未公開發布。

- 首頁 index.html：主視覺與精選入口。
- about.html：創辦人、資歷與品牌理念。
- profiling.html：精油側寫說明與體驗入口。
- team.html：九位講師與原始個案回饋。
- courses.html：課程總覽；三門課各自有 course-*.html 詳細頁。
- calendar.html：課程行事曆。
- events.html：活動列表；兩個活動各自有 event-*.html 詳細頁。
- faq.html：常見問題與聯絡說明。
- site.css / site.js：共用樣式、手機導覽、摘要展開與講師 QR 視窗。

所有頁面以靜態 HTML 輸出，沒有新增框架、後臺或蒐集表單。HTML 內容可各自維護；改導覽時須同步各頁。舊首頁錨點由 site.js 導向對應頁面。芳療管家通知表單尚未建立，日期待使用者確認；不虛構資訊。
