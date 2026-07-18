(() => {
  if (window.location.protocol !== "file:") return;

  document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.createElement("div");
    overlay.className = "runtime-warning";
    overlay.innerHTML = `
      <div class="runtime-warning-card" role="alert">
        <p class="eyebrow">LOCAL SERVER REQUIRED</p>
        <h1>Open Latin Academy through localhost</h1>
        <p>
          This page is currently using a <code>file://</code> address. Browsers
          isolate storage between local HTML files, so learner progress cannot
          be shared reliably between the homepage, Foundations and Book I.
        </p>
        <p>
          Close this tab, then run <strong>Start Latin Academy.bat</strong>
          from the project folder. The site will open at
          <code>http://localhost:8000</code>.
        </p>
        <div class="runtime-warning-actions">
          <a href="http://localhost:8000">Open localhost</a>
          <button type="button" id="dismissRuntimeWarning">Continue without saved progress</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("dismissRuntimeWarning")?.addEventListener("click", () => {
      overlay.remove();
    });
  });
})();
