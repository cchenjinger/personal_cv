/* 撕纸拼贴风 · 个人主页 交互脚本 */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* 1. 导航激活态：根据当前页面文件名高亮对应项 */
  var page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  var map = {
    "index.html": "nav-about",
    "education.html": "nav-edu",
    "practice.html": "nav-practice",
    "projects.html": "nav-projects",
    "skills.html": "nav-skills"
  };
  var activeId = map[page];
  if (activeId) {
    var el = document.getElementById(activeId);
    if (el) el.classList.add("is-active");
  }

  /* 2. 技能条滚动进场动画 */
  var bars = document.querySelectorAll(".skill-bar i[data-w]");
  if ("IntersectionObserver" in window && bars.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.width = en.target.getAttribute("data-w");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.35 });
    bars.forEach(function (b) { io.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.width = b.getAttribute("data-w"); });
  }

  /* 3. 纸片入场动画 */
  var sheets = document.querySelectorAll(".paper[data-rise]");
  if (sheets.length) {
    if ("IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en, i) {
          if (en.isIntersecting) {
            setTimeout(function () { en.target.classList.add("is-in"); }, (en.target.dataset.rise || 0) * 90);
            io2.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      sheets.forEach(function (s) { io2.observe(s); });

      /* 兜底：若长时间未触发（如打印/截图），强制全部显示 */
      setTimeout(function () {
        document.querySelectorAll(".paper[data-rise]:not(.is-in)").forEach(function (s) {
          s.classList.add("is-in");
        });
      }, 2600);
    } else {
      sheets.forEach(function (s) { s.classList.add("is-in"); });
    }
  }
})();
