/* ===== EDIT THIS BLOCK FIRST =====
   Replace placeholders only after the owner gives permission and accurate details. */
const CONFIG = {
  brand: "NOISY BEAN",
  phoneLink: "+910000000000",
  whatsapp: "910000000000",              // country code + number, digits only
  whatsappIntro: "Hi! I'd like to order:",
  mapsQuery: "Your Cafe Address Here",
  currency: "₹"
};

(function () {
  "use strict";

  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = CONFIG.brand; });
  document.querySelectorAll("[data-tel]").forEach(function (el) { el.href = "tel:" + CONFIG.phoneLink; });
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    el.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hi! I have a question about the drop.");
  });
  document.querySelectorAll("[data-maps]").forEach(function (el) {
    el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
  });

  /* mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  function setNav(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "CLOSE" : "MENU";
  }
  toggle.addEventListener("click", function () { setNav(!nav.classList.contains("open")); });
  nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  /* menu filter */
  var chips = document.querySelectorAll(".chip");
  var items = document.querySelectorAll(".item");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.f;
      chips.forEach(function (c) { c.classList.toggle("on", c === chip); c.setAttribute("aria-pressed", String(c === chip)); });
      items.forEach(function (it) { it.hidden = !(f === "all" || it.dataset.cat === f); });
    });
  });

  /* order list -> WhatsApp message (a plain wa.me link; no backend, no payment) */
  var order = {};   // name -> {price, qty}
  var box = document.getElementById("order");
  var list = document.getElementById("orderList");
  var countEl = document.getElementById("count");
  var totalEl = document.getElementById("total");
  var body = document.getElementById("orderBody");
  var head = document.getElementById("orderToggle");
  var send = document.getElementById("send");

  function render() {
    var names = Object.keys(order);
    var count = 0, total = 0;
    list.innerHTML = "";
    names.forEach(function (n) {
      var o = order[n];
      count += o.qty; total += o.qty * o.price;
      var li = document.createElement("li");
      var label = document.createElement("span");
      label.textContent = n;
      var q = document.createElement("span");
      q.className = "qty";
      var minus = document.createElement("button");
      minus.type = "button"; minus.textContent = "-"; minus.setAttribute("aria-label", "Remove one " + n);
      var num = document.createElement("span"); num.textContent = o.qty;
      var plus = document.createElement("button");
      plus.type = "button"; plus.textContent = "+"; plus.setAttribute("aria-label", "Add one more " + n);
      minus.addEventListener("click", function () { change(n, -1); });
      plus.addEventListener("click", function () { change(n, 1); });
      q.appendChild(minus); q.appendChild(num); q.appendChild(plus);
      li.appendChild(label); li.appendChild(q);
      list.appendChild(li);
    });
    countEl.textContent = count;
    totalEl.textContent = CONFIG.currency + total;
    box.hidden = count === 0;
    if (count === 0) { body.hidden = true; head.setAttribute("aria-expanded", "false"); }
    var lines = names.map(function (n) { return "- " + order[n].qty + " x " + n; });
    var text = CONFIG.whatsappIntro + "\n" + lines.join("\n") + "\nTotal: " + CONFIG.currency + total + " (please confirm)";
    send.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
  }
  function change(name, d) {
    if (!order[name]) return;
    order[name].qty += d;
    if (order[name].qty <= 0) delete order[name];
    render();
  }
  document.querySelectorAll(".add").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".item");
      var n = card.dataset.name, p = Number(card.dataset.price);
      if (!order[n]) order[n] = { price: p, qty: 0 };
      order[n].qty += 1;
      btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
      render();
    });
  });
  head.addEventListener("click", function () {
    var open = body.hidden;
    body.hidden = !open;
    head.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("clear").addEventListener("click", function () { order = {}; render(); });

  /* reveal on scroll */
  var rev = document.querySelectorAll(".item, blockquote");
  rev.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add("in"); }); }

  /* image fallback (the pink background stays visible instead of a broken icon) */
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.opacity = "0"; });
  });
})();
