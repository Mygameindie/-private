// music.js — User can add local audio/video files (mp3/mov/mp4/etc) as tracks
(function () {
  const userTracks = []; // {name, url, type}

  function $(id) { return document.getElementById(id); }

  function setToggleText(isOn) {
    const btn = $("musicToggleButton");
    if (!btn) return;
    btn.textContent = isOn ? "🔊 Music On" : "🔇 Music Off";
  }

  function isVideo(type, name) {
    const t = (type || "").toLowerCase();
    const n = (name || "").toLowerCase();
    if (t.startsWith("video/")) return true;
    // iOS sometimes gives empty type for .mov
    return n.endsWith(".mov") || n.endsWith(".mp4") || n.endsWith(".webm");
  }

  function initUserUploadPlayer() {
    const fileInput = $("userMusicFiles");
    const clearBtn = $("clearUserPlaylistBtn");
    const list = $("userMusicPlaylist");
    const player = $("userMusicPlayer");

    if (!fileInput || !clearBtn || !list || !player) return;

    player.preload = "metadata";
    player.playsInline = true;
    player.loop = false;

    function refreshList() {
      list.innerHTML = "";
      userTracks.forEach((t, i) => {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = t.name;
        list.appendChild(opt);
      });
    }

    function playIndex(i) {
      const t = userTracks[i];
      if (!t) return;

      player.src = t.url;

      // ซ่อนจอวิดีโอให้เหมือนเพลง (ถ้าอยากโชว์วิดีโอ ให้เปลี่ยนเป็น block)
      player.style.display = isVideo(t.type, t.name) ? "none" : "none";

      player.play().then(() => setToggleText(true)).catch((e) => {
        console.warn("Playback blocked:", e);
        setToggleText(false);
      });
    }

    fileInput.addEventListener("change", () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) return;

      files.forEach(f => {
        userTracks.push({
          name: f.name,
          type: f.type || "",
          url: URL.createObjectURL(f)
        });
      });

      refreshList();

      // auto play first newly added
      const firstNew = userTracks.length - files.length;
      list.selectedIndex = firstNew;
      playIndex(firstNew);

      // allow same file again later
      fileInput.value = "";
    });

    list.addEventListener("change", () => {
      const i = parseInt(list.value, 10);
      if (!Number.isFinite(i)) return;
      playIndex(i);
    });

    clearBtn.addEventListener("click", () => {
      try { player.pause(); } catch(e) {}
      player.removeAttribute("src");
      player.load();
      setToggleText(false);

      userTracks.forEach(t => { try { URL.revokeObjectURL(t.url); } catch(e) {} });
      userTracks.length = 0;
      refreshList();
    });

    // auto next when ended
    player.addEventListener("ended", () => {
      if (!userTracks.length) return;
      let next = list.selectedIndex + 1;
      if (next >= userTracks.length) next = 0;
      list.selectedIndex = next;
      playIndex(next);
    });

    // Toggle button works for BOTH: user player first, else backgroundMusic fallback
    const toggleBtn = $("musicToggleButton");
    if (toggleBtn && !toggleBtn.dataset.userToggleBound) {
      toggleBtn.dataset.userToggleBound = "1";
      toggleBtn.addEventListener("click", () => {
        if (player.src) {
          if (player.paused) player.play().then(() => setToggleText(true)).catch(()=>setToggleText(false));
          else { player.pause(); setToggleText(false); }
          return;
        }
        const bgm = $("backgroundMusic");
        if (!bgm) return;
        if (bgm.paused) bgm.play().then(() => setToggleText(true)).catch(()=>setToggleText(false));
        else { bgm.pause(); setToggleText(false); }
      });
    }
  }

  // keep your existing selector system working
  function initExistingSelector() {
    const selector = $("musicSelector");
    const audio = $("backgroundMusic");
    if (!selector || !audio) return;
    const source = audio.querySelector("source");
    if (!source) return;

    selector.addEventListener("change", () => {
      const selectedTrack = selector.value;
      source.src = selectedTrack;
      audio.load();
      audio.play().catch(e => console.warn("Playback issue:", e));
      setToggleText(true);

      if (selectedTrack === "my-music3.mp3") {
        document.querySelectorAll(".plants").forEach(i => i.style.visibility = "hidden");
      }
    });
  }

  // auto init on load (ไม่ต้องแก้ main.js)
  window.addEventListener("load", () => {
    initUserUploadPlayer();
    initExistingSelector();
  });
})();