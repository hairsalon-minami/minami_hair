// 目次の生成とh2の前に要素を追加する

// h2、h3取得
const articleContent = document.getElementById("article-content");
const hList = articleContent.querySelectorAll("h2, h3");

// 目次に戻るを作る関数
const tocBack = () => {
  let ele = document.createElement("div");
  ele.className = "toc-back";
  let link = document.createElement("a");
  link.href = "#tableOfContents";
  link.textContent = "目次へ";
  ele.appendChild(link);
  return ele;
};

// 目次のliを作る関数
const tocLi = (el) => {
  let item = document.createElement("li");
  let link = document.createElement("a");
  link.href = "#" + el.id;
  link.textContent = el.textContent;
  item.appendChild(link);
  return item;
};

// h3リストを作る関数
const h3Ul = () => {
  let li = document.createElement("li");
  let ul = document.createElement("ul");
  li.appendChild(ul);
  return li;
};

// 目次リストの下準備
const tocList = document.createElement("ul");
tocList.className = "toc";
let h3List;
let check = 2;

// ループで目次リストを作成
for (var i = 0; i < hList.length; i++) {
  let hEle = hList[i];
  let h = parseInt(hEle.tagName.substring(1));

  if (h == 2) tocList.appendChild(tocLi(hEle));
  if (h == 3) {
    if (check < 3) {
      h3List = document.createElement("ul");
      tocList.lastChild.appendChild(h3List);
    }
    h3List.appendChild(tocLi(hEle));
  }
  // 二番目のh2の前に要素を追加
  if (i > 0 && check >= h) hEle.parentNode.insertBefore(tocBack(), hEle);

  check = h;
}

// 目次作成
const tocHead = document.createElement("h2");
tocHead.id = "tableOfContents";
tocHead.textContent = "目次";
const h2First = hList[0];
h2First.parentNode.insertBefore(tocHead, h2First);
h2First.parentNode.insertBefore(tocList, h2First);

// 要素の最後に、目次に戻るを追加
articleContent.appendChild(tocBack());
