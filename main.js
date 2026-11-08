/* Aurea People — interactions */
(function () {
  "use strict";

  var CONTACT_EMAIL = "info@aurea-people.com";

  /* ----- Header shadow on scroll ----- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Mobile navigation ----- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the mobile menu after tapping a link
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close the mobile menu with Escape and return focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        toggle.focus();
      }
    });
  }

  /* ----- Scroll-reveal animations ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ----- Animated hero counters ----- */
  var counters = document.querySelectorAll(".stat dt");
  var animateCount = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "+";
    var duration = 1200;
    var start = null;

    var tick = function (ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + (progress === 1 ? suffix : "");
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    var statIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { statIo.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ----- Active nav link highlighting ----- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window) {
    var sectionIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { sectionIo.observe(s); });
  }

  /* ----- Contact form → pre-filled email (no backend needed) ----- */
  var form = document.getElementById("contact-form");
  var hint = document.getElementById("form-hint");

  if (form && hint) {
    var HINT_DEFAULT = hint.textContent;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var company = form.company.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        hint.textContent = "Please fill in your name, email and message.";
        hint.classList.remove("success");
        return;
      }

      var subject = "Enquiry from " + name + (company ? " (" + company + ")" : "");
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        (company ? "Company: " + company + "\n" : "") +
        "\n" +
        message;

      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      hint.textContent = "Your email client should open now. Thank you!";
      hint.classList.add("success");
      form.reset();
    });
  }

  /* ----- Footer year ----- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
