"use strict";

// PWA registration is independent of the presentation logic.
if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    const base = new URL("./", document.baseURI);
    navigator.serviceWorker.register(new URL("sw.js", base), { scope: base.href })
      .catch(error => console.warn("LinkWich-Monitor PWA:", error));
  }, { once: true });
}
