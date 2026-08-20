/* 撕纸拼贴风 · 个人主页 交互脚本（优化版） */
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

  /* 2. 汉堡菜单交互 */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active");
      navToggle.setAttribute("aria-expanded", isOpen);
    });
    // 点击菜单项后关闭菜单
    navMenu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    // 点击外部关闭菜单
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 3. 返回顶部按钮 */
  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* 4. 滚动进度条 */
  var scrollProgress = document.getElementById("scrollProgress");
  if (scrollProgress) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + "%";
    }, { passive: true });
  }

  /* 5. 打字机效果 */
  var typewriter = document.getElementById("typewriter");
  if (typewriter) {
    var texts = ["Research · Analysis · Project Management", "数据分析 · 产业研究 · 项目管理"];
    var textIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 80;

    function type() {
      var currentText = texts[textIndex];
      if (isDeleting) {
        typewriter.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
      } else {
        typewriter.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // 停顿
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // 切换文本停顿
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }

  /* 6. 技能条滚动进场动画 */
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

  /* 7. 纸片入场动画 */
  var sheets = document.querySelectorAll(".paper[data-rise]");
  if (sheets.length) {
    if ("IntersectionObserver" in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            setTimeout(function () { en.target.classList.add("is-in"); }, (en.target.dataset.rise || 0) * 90);
            io2.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      sheets.forEach(function (s) { io2.observe(s); });

      // 兜底：若长时间未触发，强制全部显示
      setTimeout(function () {
        document.querySelectorAll(".paper[data-rise]:not(.is-in)").forEach(function (s) {
          s.classList.add("is-in");
        });
      }, 2600);
    } else {
      sheets.forEach(function (s) { s.classList.add("is-in"); });
    }
  }

  /* 8. 平滑锚点滚动 */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
