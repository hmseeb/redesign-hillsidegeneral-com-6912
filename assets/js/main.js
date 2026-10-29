/* Hillside General Construction & Electrical — site scripts
   - mobile navigation
   - LeadrVision form handling (progressive enhancement; plain POST still works)
   - ?submitted=1 confirmation
   - subtle reveal on scroll (honours prefers-reduced-motion)
*/
(function () {
  "use strict";

  var ENDPOINT = "https://vision.leadrai.com/api/forms/bfd133f94f8a2c677a6880f0204d9223";

  /* ---------------- Mobile navigation ---------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  /* ---------------- Forms ---------------- */
  function setStatus(form, message, isError) {
    var box = form.querySelector(".form-status");
    if (!box) return;
    var text = box.querySelector(".form-status-text");
    if (text) text.textContent = message;
    box.classList.toggle("is-error", !!isError);
    box.classList.add("is-visible");
    box.setAttribute("role", isError ? "alert" : "status");
  }

  function initForms() {
    var forms = document.querySelectorAll("form[data-leadr]");
    var submitted = new URLSearchParams(window.location.search).get("submitted") === "1";

    Array.prototype.forEach.call(forms, function (form) {
      /* Record the page the visitor submitted from */
      var pageField = form.querySelector('input[name="_page"]');
      if (pageField) pageField.value = window.location.href;

      /* Plain-HTML submission already happened: show confirmation */
      if (submitted) {
        setStatus(form, "Thanks, your message was sent. We will get back to you shortly — for anything urgent, call (818) 896-5400.", false);
      }

      form.addEventListener("submit", function (e) {
        if (!window.fetch || !form.checkValidity()) return; /* let the browser handle it */
        e.preventDefault();

        var button = form.querySelector('button[type="submit"]');
        var originalLabel = button ? button.textContent : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Sending…";
        }

        var payload = {};
        new FormData(form).forEach(function (value, key) {
          payload[key] = typeof value === "string" ? value : String(value);
        });
        payload._page = window.location.href;

        fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        })
          .then(function (res) {
            return res.json().catch(function () { return { ok: res.ok }; });
          })
          .then(function (data) {
            if (data && data.ok) {
              setStatus(form, "Thanks, your message was sent. We will get back to you shortly — for anything urgent, call (818) 896-5400.", false);
              form.reset();
              var pf = form.querySelector('input[name="_page"]');
              if (pf) pf.value = window.location.href;
              var box = form.querySelector(".form-status");
              if (box && typeof box.scrollIntoView === "function") {
                box.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            } else {
              throw new Error("Submission rejected");
            }
          })
          .catch(function () {
            setStatus(form, "Sorry, that did not send. Please call (818) 896-5400 or email info@hillsidegeneral.com and we will take care of it.", true);
          })
          .then(function () {
            if (button) {
              button.disabled = false;
              button.textContent = originalLabel;
            }
          });
      });
    });
  }

  /* ---------------- Footer year ---------------- */
  function initYear() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initNav();
    initForms();
    initYear();
  });
})();
