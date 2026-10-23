// 2026-10-24 起文法詳解拆成每級一檔(grammar-detail-n5.js…);這支只是相容外殼,載入全部五級。
['n5', 'n4', 'n3', 'n2', 'n1'].forEach(function (lv) { var s = document.createElement('script'); s.src = 'grammar-detail-' + lv + '.js'; document.head.appendChild(s); });
