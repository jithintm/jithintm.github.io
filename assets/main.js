(function () {
  var root = document.documentElement;
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("theme").addEventListener("click", function () {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Line 3 rail: one station for each section
  var rail = document.getElementById("line");
  var secs = document.querySelectorAll("main section[id]");
  secs.forEach(function (s) {
    var a = document.createElement("a");
    a.href = "#" + s.id;
    a.textContent = s.querySelector("h2") ? s.querySelector("h2").textContent : s.id;
    rail.appendChild(a);
  });
  var stations = rail.querySelectorAll("a");
  var links = document.querySelectorAll(".nav nav a");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var h = "#" + e.target.id;
      links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === h); });
      stations.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === h); });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  secs.forEach(function (s) { io.observe(s); });

  // Reading progress
  var bar = document.getElementById("progress");
  function prog() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  }
  addEventListener("scroll", prog, { passive: true }); prog();

  // Clock (Bengaluru time)
  var clock = document.getElementById("clock");
  function tick() {
    clock.textContent = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false
    });
  }
  tick(); setInterval(tick, 30000);

  // At 7:00 pm (Bengaluru) one short notice appears per visit
  var toast = document.getElementById("toast");
  function seven() {
    var p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }).format(new Date());
    if (+p === 19 && !toast.dataset.shown) {
      toast.dataset.shown = "1";
      toast.textContent = "It is 7:00 pm. A new scenario can start now. Say hello.";
      toast.hidden = false;
      setTimeout(function () { toast.hidden = true; }, 9000);
    }
  }
  seven(); setInterval(seven, 60000);

  console.log("You read the source to the end. Good. Say hello: thejithinmathew@gmail.com");
})();
