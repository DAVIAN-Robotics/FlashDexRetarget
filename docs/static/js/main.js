// Looping clips load when they approach the viewport and pause when they leave it.
(function () {
  var clips = Array.prototype.slice.call(document.querySelectorAll("video.loop"));

  function load(v) {
    if (v.dataset.loaded) return;
    v.src = v.dataset.src;
    v.dataset.loaded = "1";
  }
  function play(v) {
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  if (!("IntersectionObserver" in window)) {
    clips.forEach(function (v) { load(v); play(v); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { load(v); play(v); }
        else if (v.dataset.loaded) v.pause();
      });
    }, { rootMargin: "300px 0px" });
    clips.forEach(function (v) { io.observe(v); });
  }

  // Clips in the same row restart together so side-by-side comparisons stay in sync.
  document.querySelectorAll("[data-sync]").forEach(function (row) {
    var vids = row.querySelectorAll("video");
    var lead = vids[0];
    if (!lead) return;
    lead.addEventListener("seeked", function () {
      if (lead.currentTime < 0.2) vids.forEach(function (v) { if (v !== lead) v.currentTime = 0; });
    });
  });

  var btn = document.getElementById("copy-bib");
  if (btn) {
    btn.addEventListener("click", function () {
      var text = document.getElementById("bibtex-text").innerText;
      var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  }
})();
