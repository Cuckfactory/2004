/* SIGNED IN — a 2004 desktop that still has your number */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const state = {
    z: 20,
    dragging: null,
    nightMin: 1 * 60 + 47, // 1:47 AM
    dawnMin: 6 * 60 + 12,
    speed: 14, // game seconds per real second
    lastTs: performance.now(),
    paused: false,
    memory: 3,
    attention: 5,
    maxAttention: 5,
    nights: 1,
    kept: 0,
    lost: 0,
    nudges: 0,
    songsPlayed: 0,
    vibe: "ambient",
    playing: false,
    trackIndex: 0,
    volume: 0.35,
    bootDone: false,
    status: "listening to something I can't name",
    upgrades: {
      extraTab: false,
      betterVis: false,
      coffee: false,
      goldSkin: false,
      ghost: false,
    },
    chats: {},
    unread: {},
  };

  const TRACKS = [
    { name: "17 untitled (bedroom take).mp3", genre: "emo", bpm: 86, key: "A", color: "#7ec8ff" },
    { name: "burned_cd_track_04.mp3", genre: "pop", bpm: 112, key: "C", color: "#ffb347" },
    { name: "dial-up love theme.mp3", genre: "ambient", bpm: 68, key: "D", color: "#c9a0dc" },
    { name: "not In The End but close.mp3", genre: "nu-metal", bpm: 105, key: "E", color: "#ff6b4a" },
    { name: "aimless_loop_finalFINAL.wav", genre: "idm", bpm: 128, key: "F", color: "#6f6" },
    { name: "song from a screenname I deleted.mp3", genre: "ambient", bpm: 72, key: "G", color: "#e8c36a" },
    { name: "windows_shutdown_but_make_it_hurt.mp3", genre: "ambient", bpm: 54, key: "C", color: "#9ad" },
    { name: "skatepark parking lot.mp3", genre: "pop", bpm: 118, key: "A", color: "#fc8" },
  ];

  const CONTACTS = [
    {
      id: "jess",
      name: "jessxox",
      pic: "🌸",
      genre: "emo",
      persona: "soft",
      status0: "homework? theoretically",
      online: true,
      mood: "online",
      patience: 90,
      maxPatience: 90,
      story: 0,
      lines: {
        hello: [
          "omg you're actually on",
          "hi hi hi",
          "i was hoping you'd be signed in",
          "hey. don't make it weird.",
        ],
        chat: [
          "do you ever feel like this year already happened",
          "my mom just yelled up the stairs. i have like 20 minutes",
          "what are you listening to",
          "i made a new playlist. it's all songs that sound like hallways",
          "are you going to that thing on friday or are we both lying",
          "sometimes i write messages and delete them. this is one i didn't",
          "a/s/l even though we already know lol",
          "the light in my room is that cheap christmas one. it makes everything look kinder",
        ],
        music: [
          "wait this song. leave it on",
          "this is so us it's embarrassing",
          "ok who gave you my exact frequency",
        ],
        bye: [
          "ok she's coming. don't sign off",
          "i'll be on tomorrow. or i won't. you know how it is",
          "gn. don't let the desktop go cold",
        ],
      },
      replies: ["i'm here", "this song is for you", "don't go yet", "lol same", "a/s/l  /  / online"],
    },
    {
      id: "angel",
      name: "xXdark_angelXx",
      pic: "🖤",
      genre: "nu-metal",
      persona: "night",
      status0: "numb. not in a cute way",
      online: true,
      mood: "away",
      patience: 120,
      maxPatience: 120,
      story: 0,
      lines: {
        hello: ["you still keep weird hours. good.", "hey stranger", "the house is finally quiet"],
        chat: [
          "everyone is so loud in the daytime. i only trust 2am people",
          "if you could keep one window open forever which one",
          "i wrote something. it's bad. i'm sending it anyway: the cursor blinks like it knows",
          "do you think the people in our buddy lists remember our real names",
          "nudge me if you're still a person",
          "my display pic is from a photobooth i never went back to",
        ],
        music: [
          "this track has teeth. leave it",
          "finally something that isn't pretending to be fine",
        ],
        bye: ["going away. not offline. there's a difference", "don't let dawn win"],
      },
      replies: ["still a person", "keep talking", "nudge", "window: this one", "your writing isn't bad"],
    },
    {
      id: "mike",
      name: "mike_2002",
      pic: "🛹",
      genre: "pop",
      persona: "bro",
      status0: "got the burned cd burnER",
      online: true,
      mood: "online",
      patience: 70,
      maxPatience: 70,
      story: 0,
      lines: {
        hello: ["yo", "bruh you on", "dude my connection is dying but i'm here"],
        chat: [
          "you still have that map pack??",
          "my brother is hogging the phone line. if i vanish that's why",
          "we should start a server. or a band. same energy",
          "i put 47 songs on one cd and it skipped during the good part. tragedy",
          "want me to send a wink. i found a cursed one",
          "a/s/l lmao why do people still type that",
        ],
        music: ["TURN IT UP", "this slaps in a parking lot way", "ok now it's a night"],
        bye: ["phone line. funeral for my download", "later gator. stay signed in"],
      },
      replies: ["yo", "send the wink", "band name ideas", "lol", "i got the map"],
    },
    {
      id: "mom",
      name: "Home-PC",
      pic: "☕",
      genre: "ambient",
      persona: "mom",
      status0: "Dinner in the fridge. Don't make me come upstairs.",
      online: true,
      mood: "online",
      patience: 200,
      maxPatience: 200,
      story: 0,
      lines: {
        hello: ["Are you still on this thing?", "It's late."],
        chat: [
          "There is lasagna. I am not asking.",
          "Your father says the phone bill looked like a novel.",
          "I liked that song you played yesterday. Don't tell your friends I said that.",
          "Sleep exists. I checked.",
          "I put your washed hoodie on the chair. The black one you pretend isn't your favorite.",
        ],
        music: ["Turn it down a little. The walls are thin and I am trying to love you anyway."],
        bye: ["Goodnight, glow of my hallway.", "I'm leaving this window open. That's the deal."],
      },
      replies: ["i'll eat", "5 more minutes", "love you", "it's not that late", "goodnight"],
    },
    {
      id: "radio",
      name: "now_playing",
      pic: "📻",
      genre: "idm",
      persona: "bot",
      status0: "i only speak if the song does",
      online: true,
      mood: "online",
      patience: 999,
      maxPatience: 999,
      story: 0,
      lines: {
        hello: ["signal acquired"],
        chat: ["..."],
        music: [],
        bye: ["static"],
      },
      replies: ["what do you hear", "stay", "change the song"],
    },
    {
      id: "tape",
      name: "the_tape",
      pic: "📠",
      genre: "idm",
      persona: "desk",
      status0: "after-hours desk. I only ping when the print is rude",
      online: true,
      mood: "online",
      patience: 999,
      maxPatience: 999,
      story: 0,
      lines: {
        hello: ["desk is open. don't expect fireworks. I wait for the weird ones."],
        chat: [
          "most of what moves is noise. I delete noise for a living",
          "if I write you it already survived three filters",
          "I don't say buy. I say look. there's a difference and the night knows it",
        ],
        music: ["leave the radio on. I type over it"],
        bye: ["desk goes dark at dawn. the prints don't."],
      },
      replies: ["show me", "how rare", "I'm looking", "quiet night?"],
    },
    {
      id: "kate",
      name: "katie.p",
      pic: "🎹",
      genre: "pop",
      persona: "soft",
      status0: "practicing. don't listen through the wall",
      online: true,
      mood: "away",
      patience: 80,
      maxPatience: 80,
      story: 0,
      lines: {
        hello: ["oh. hi. i thought you deleted me", "hey. i'm supposed to be asleep"],
        chat: [
          "i learned the sad part of a song and not the rest. typical",
          "do you still sit in the back of assembly",
          "if i send you a voice clip the file will be too big and also too much",
          "my metronome is the only thing that keeps time honestly",
          "tell me a secret that wouldn't survive daylight",
        ],
        music: ["leave this one. i can play along from here", "this is the hallway song. you remembered"],
        bye: ["i have to close the lid. the keys will still be warm", "don't vanish. that's my move"],
      },
      replies: ["i didn't delete you", "play the sad part", "secret: i'm still here", "goodnight pianist"],
    },
    {
      id: "ghost",
      name: "old_screenname",
      pic: "👻",
      genre: "ambient",
      persona: "ghost",
      status0: "this used to be you",
      online: false,
      mood: "offline",
      locked: true,
      patience: 150,
      maxPatience: 150,
      story: 0,
      lines: {
        hello: ["you kept the password", "i've been in the recycle bin the whole time"],
        chat: [
          "do you remember why we made this name",
          "you were going to be so many people",
          "leave a status. i'll read it from the other side of the glass",
          "the first song you ever paused for someone is still in recent files",
        ],
        music: ["that's the one. that's the hallway."],
        bye: ["i won't log off. that's the whole trick"],
      },
      replies: ["i remember", "stay listed", "what was the name for", "i'm still those people"],
    },
  ];

  // ---------- audio ----------
  let actx, master, visAnalyser, currentNodes = [];
  function audio() {
    if (actx) return actx;
    actx = new (window.AudioContext || window.webkitAudioContext)();
    master = actx.createGain();
    master.gain.value = state.volume;
    visAnalyser = actx.createAnalyser();
    visAnalyser.fftSize = 64;
    master.connect(visAnalyser);
    visAnalyser.connect(actx.destination);
    return actx;
  }
  function beep(freq, dur, type = "square", vol = 0.08) {
    const c = audio();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(master);
    o.start(); o.stop(c.currentTime + dur);
  }
  function ping() {
    beep(880, 0.08, "sine", 0.05);
    setTimeout(() => beep(1320, 0.12, "sine", 0.04), 70);
  }
  function nudgeSound() {
    [440, 520, 440, 520, 440].forEach((f, i) => setTimeout(() => beep(f, 0.07, "square", 0.06), i * 80));
  }
  function stopSong() {
    currentNodes.forEach((n) => { try { n.stop(); } catch(e) {} });
    currentNodes = [];
    state.playing = false;
    if (state._loopTimer) { clearTimeout(state._loopTimer); state._loopTimer = null; }
  }
  function playTrack(i) {
    audio().resume();
    stopSong();
    state.trackIndex = i;
    state.playing = true;
    state.songsPlayed++;
    state.vibe = TRACKS[i].genre;
    const t = TRACKS[i];
    const c = audio();
    const now = c.currentTime;
    // simple generative loop from track params
    const scale = {
      A: [220, 247, 262, 294, 330, 349, 392],
      C: [262, 294, 330, 349, 392, 440, 494],
      D: [294, 330, 349, 392, 440, 494, 523],
      E: [165, 196, 220, 247, 294, 330, 392],
      F: [175, 196, 220, 262, 294, 349, 392],
      G: [196, 220, 247, 294, 330, 392, 440],
    }[t.key];
    const beat = 60 / t.bpm;
    const steps = 32;
    for (let k = 0; k < 4; k++) {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = t.genre === "nu-metal" ? "sawtooth" : t.genre === "idm" ? "square" : "triangle";
      g.gain.value = 0.0001;
      osc.connect(g); g.connect(master);
      osc.start(now);
      for (let s = 0; s < steps * 4; s++) {
        const note = scale[(s * (k + 1) + k * 2) % scale.length] * (k === 0 ? 1 : k === 1 ? 0.5 : 2);
        const when = now + s * beat * 0.5;
        osc.frequency.setValueAtTime(note, when);
        const acc = s % 4 === 0 ? 0.045 : 0.02;
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(acc * (k === 1 ? 1.2 : 0.7), when + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, when + beat * 0.45);
      }
      osc.stop(now + steps * 4 * beat * 0.5 + 0.2);
      currentNodes.push(osc);
    }
    // schedule loop
    const len = steps * 4 * beat * 0.5;
    if (state._loopTimer) clearTimeout(state._loopTimer);
    state._loopTimer = setTimeout(() => { if (state.playing && state.trackIndex === i) playTrack(i); }, len * 1000);
    renderWinamp();
    maybeMusicChat();
    save();
  }

  // ---------- persistence ----------
  function save() {
    const slim = {
      memory: state.memory,
      attention: state.attention,
      maxAttention: state.maxAttention,
      nights: state.nights,
      kept: state.kept,
      lost: state.lost,
      nudges: state.nudges,
      songsPlayed: state.songsPlayed,
      status: state.status,
      upgrades: state.upgrades,
      nightMin: state.nightMin,
      contacts: CONTACTS.map((c) => ({
        id: c.id, online: c.online, mood: c.mood, patience: c.patience, story: c.story, locked: c.locked,
      })),
    };
    try { localStorage.setItem("signed-in", JSON.stringify(slim)); } catch (e) {}
  }
  function load() {
    try {
      const raw = localStorage.getItem("signed-in");
      if (!raw) return;
      const d = JSON.parse(raw);
      Object.assign(state, {
        memory: d.memory ?? state.memory,
        attention: d.attention ?? state.attention,
        maxAttention: d.maxAttention ?? state.maxAttention,
        nights: d.nights ?? 1,
        kept: d.kept ?? 0,
        lost: d.lost ?? 0,
        nudges: d.nudges ?? 0,
        songsPlayed: d.songsPlayed ?? 0,
        status: d.status ?? state.status,
        upgrades: Object.assign(state.upgrades, d.upgrades || {}),
        nightMin: d.nightMin ?? state.nightMin,
      });
      (d.contacts || []).forEach((s) => {
        const c = CONTACTS.find((x) => x.id === s.id);
        if (c) Object.assign(c, s);
      });
    } catch (e) {}
  }

  // ---------- windows ----------
  function focusWin(el) {
    state.z += 1;
    el.style.zIndex = state.z;
    $$(".window").forEach((w) => w.classList.add("inactive"));
    el.classList.remove("inactive", "minimized", "hidden");
    $$(".task").forEach((t) => t.classList.toggle("active", t.dataset.for === el.id));
  }
  function makeDraggable(win) {
    ensureCtrls(win);
    const bar = win.querySelector(".titlebar");
    bar.addEventListener("mousedown", (e) => {
      if (e.target.closest(".ctrl")) return;
      focusWin(win);
      if (win.classList.contains("maximized")) return;
      const r = win.getBoundingClientRect();
      state.dragging = { el: win, dx: e.clientX - r.left, dy: e.clientY - r.top };
    });
    bar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".ctrl")) return;
      toggleMax(win.id);
    });
    win.addEventListener("mousedown", () => focusWin(win));
  }
  function ensureCtrls(win) {
    const ctrls = win.querySelector(".titlebar .ctrls");
    if (!ctrls) return;
    let btn = ctrls.querySelector('[data-act="max"]');
    if (!btn) {
      btn = document.createElement("div");
      btn.className = "ctrl";
      btn.dataset.act = "max";
      btn.title = "maximize";
      btn.textContent = "□";
      const close = ctrls.querySelector('[data-act="close"]');
      ctrls.insertBefore(btn, close || null);
    }
    if (!btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMax(win.id);
      });
    }
  }
  function toggleMax(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const b = el.querySelector('[data-act="max"]');
    if (el.classList.contains("maximized")) {
      el.classList.remove("maximized");
      ["left", "top", "width", "height"].forEach((p) => el.style.removeProperty(p));
      const g = el._geom;
      if (g) {
        el.style.left = g.left;
        el.style.top = g.top;
        el.style.width = g.width;
        el.style.height = g.height;
      }
      if (b) b.textContent = "□";
    } else {
      el._geom = {
        left: el.style.left || el.offsetLeft + "px",
        top: el.style.top || el.offsetTop + "px",
        width: (el.style.width && el.style.width !== "auto") ? el.style.width : el.offsetWidth + "px",
        height: (el.style.height && el.style.height !== "auto") ? el.style.height : el.offsetHeight + "px",
      };
      el.classList.add("maximized");
      el.style.setProperty("left", "0px", "important");
      el.style.setProperty("top", "0px", "important");
      el.style.setProperty("width", "100%", "important");
      el.style.setProperty("height", "100%", "important");
      if (b) b.textContent = "❐";
    }
    focusWin(el);
    if (id === "paint") setTimeout(paintFit, 30);
    if (id === "soli") setTimeout(soliPaint, 30);
    if (id === "winamp") renderWinamp();
  }
  window.addEventListener("mousemove", (e) => {
    if (!state.dragging) return;
    const { el, dx, dy } = state.dragging;
    el.style.left = Math.max(0, e.clientX - dx) + "px";
    el.style.top = Math.max(0, e.clientY - dy) + "px";
  });
  window.addEventListener("mouseup", () => (state.dragging = null));

  function openApp(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("hidden", "minimized");
    focusWin(el);
    syncTasks();
    if (id === "winamp" && !state.playing) playTrack(state.trackIndex);
    if (id === "msn") renderMessenger();
    if (id === "ledger") renderLedger();
    if (id === "quote") quoteSearch(($("#quote-q") && $("#quote-q").value) || quote.q);
    if (id === "soli") soliPaint();
    if (id === "mine") minePaint();
    if (id === "paint") setTimeout(paintFit, 40);
  }
  function minimize(id) {
    const el = document.getElementById(id);
    el.classList.add("minimized");
    syncTasks();
  }
  function closeWin(id) {
    const el = document.getElementById(id);
    el.classList.add("hidden");
    el.classList.remove("maximized");
    if (id.startsWith("chat-")) delete el.dataset.keep;
    if (id === "winamp") {
      stopSong();
      renderWinamp();
    }
    syncTasks();
  }

  function syncTasks() {
    const holder = $("#tasks");
    holder.innerHTML = "";
    $$(".window").forEach((w) => {
      if (w.classList.contains("hidden")) return;
      if (w.id.startsWith("chat-") && w.classList.contains("minimized") && !state.unread[w.dataset.cid]) {
        // still show
      }
      const t = document.createElement("div");
      t.className = "task" + (w.classList.contains("inactive") || w.classList.contains("minimized") ? "" : " active");
      t.dataset.for = w.id;
      const unread = w.dataset.cid ? state.unread[w.dataset.cid] : (w.id === "msn" ? Object.values(state.unread).reduce((a, b) => a + b, 0) : 0);
      t.innerHTML = `<span>${w.dataset.task || w.querySelector(".wtit").textContent}</span>${unread ? `<span class="badge">${unread}</span>` : ""}`;
      t.addEventListener("click", () => {
        if (!w.classList.contains("minimized") && !w.classList.contains("inactive") && !w.classList.contains("hidden")) {
          minimize(w.id);
        } else openApp(w.id);
      });
      holder.appendChild(t);
    });
  }

  // ---------- messenger ----------
  function renderMessenger() {
    const online = CONTACTS.filter((c) => c.online && !c.locked);
    const away = online.filter((c) => c.mood === "away" || c.mood === "busy");
    const on = online.filter((c) => c.mood === "online");
    const off = CONTACTS.filter((c) => !c.online && !c.locked);
    const ghost = CONTACTS.find((c) => c.id === "ghost");

    const list = (arr) =>
      arr
        .map((c) => {
          const u = state.unread[c.id] || 0;
          return `<div class="contact ${c.mood}" data-id="${c.id}">
            <div class="led"></div>
            <div class="cn"><div class="n">${c.pic} ${c.name}</div><div class="p">${c.status0}</div></div>
            ${u ? `<div class="unread">${u}</div>` : ""}
          </div>`;
        })
        .join("");

    $("#msn-list").innerHTML = `
      <div class="group-h">Online (${on.length}) <span>▾</span></div>
      ${list(on)}
      <div class="group-h">Away (${away.length}) <span>▾</span></div>
      ${list(away)}
      <div class="group-h">Offline (${off.length}) <span>▾</span></div>
      ${list(off)}
      ${!ghost.locked ? `<div class="group-h">Other (1)</div>${list([ghost])}` : ""}
    `;
    $$("#msn-list .contact").forEach((el) =>
      el.addEventListener("dblclick", () => openChat(el.dataset.id))
    );
    $$("#msn-list .contact").forEach((el) =>
      el.addEventListener("click", () => openChat(el.dataset.id))
    );
    $("#me-status").textContent = state.status;
    syncTasks();
  }

  function chatWindow(cid) {
    let el = document.getElementById("chat-" + cid);
    if (el) return el;
    const c = CONTACTS.find((x) => x.id === cid);
    el = document.createElement("div");
    el.className = "window hidden";
    el.id = "chat-" + cid;
    el.dataset.cid = cid;
    el.dataset.task = c.name;
    el.style.cssText = `left:${220 + Math.random() * 180}px;top:${60 + Math.random() * 80}px;width:380px;height:360px;`;
    el.innerHTML = `
      <div class="titlebar">
        <div class="wicon">${c.pic}</div>
        <div class="wtit">${c.name} - Conversation</div>
        <div class="ctrls">
          <div class="ctrl" data-act="min">_</div>
          <div class="ctrl" data-act="max">□</div>
          <div class="ctrl close" data-act="close">✕</div>
        </div>
      </div>
      <div class="menubar"><span>File</span><span>Edit</span><span>Actions</span><span>Help</span></div>
      <div class="wbody">
        <div class="chat-layout">
          <div class="chat-log" id="log-${cid}"></div>
          <div class="typing" id="typ-${cid}"></div>
          <div class="chat-tools">
            ${c.token
              ? `<button data-tok="why">Why?</button><button data-tok="chart">Chart</button><button data-tok="watch">Watch</button>${tokenActionBtn(c)}`
              : `<button data-em="nudge">Nudge</button><button data-em="wink">Wink</button><button data-em="brb">brb</button>`}
          </div>
          <div class="quickies" id="q-${cid}"></div>
          <div class="chat-in">
            <input id="in-${cid}" maxlength="160" placeholder="say something you'll half-remember..." />
            <button class="send" data-send="${cid}">Send</button>
          </div>
        </div>
      </div>`;
    $("#desktop").appendChild(el);
    makeDraggable(el);
    el.querySelector('[data-act="min"]').onclick = () => minimize(el.id);
    el.querySelector('[data-act="close"]').onclick = () => closeWin(el.id);
    el.querySelector("[data-send]").onclick = () => sendChat(cid);
    el.querySelector(`#in-${cid}`).addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendChat(cid);
    });
    const nudgeBtn = el.querySelector("[data-em='nudge']");
    if (nudgeBtn) nudgeBtn.onclick = () => doNudge(cid);
    const winkBtn = el.querySelector("[data-em='wink']");
    if (winkBtn) winkBtn.onclick = () => {
      sendSystem(cid, "you sent a wink. it was slightly too sincere.");
      showWink("you → " + c.name);
      setTimeout(() => npcSay(c, pick(["did you just—", "the wink animation is illegal after 1am", "ok. received."])), 500);
    };
    const brbBtn = el.querySelector("[data-em='brb']");
    if (brbBtn) brbBtn.onclick = () => {
      pushMsg(cid, "me", "brb");
      setTimeout(() => npcSay(c, pick(["k", "hurry", "i'll be here", "ok but the night is moving"])), 600);
    };
    el.querySelectorAll("[data-tok]").forEach((btn) => {
      btn.onclick = () => tokenTool(cid, btn.dataset.tok);
    });
    renderQuick(cid);
    if (!state.chats[cid]) {
      state.chats[cid] = [];
      pushSys(cid, `${c.name} appears in the glass.`);
    } else {
      paintLog(cid);
    }
    return el;
  }

  function renderQuick(cid) {
    const c = CONTACTS.find((x) => x.id === cid);
    $("#q-" + cid).innerHTML = c.replies.map((r) => `<span class="chip">${r}</span>`).join("");
    $$("#q-" + cid + " .chip").forEach((ch) =>
      ch.addEventListener("click", () => {
        $("#in-" + cid).value = ch.textContent;
        sendChat(cid);
      })
    );
  }

  function openChat(cid) {
    const c = CONTACTS.find((x) => x.id === cid);
    if (c.locked) {
      toast("unknown", "that screenname is still in the recycle bin.");
      return;
    }
    const el = chatWindow(cid);
    state.unread[cid] = 0;
    openApp(el.id);
    paintLog(cid);
    renderMessenger();
    if (c.token && c.hit && !c.revealed) {
      setTimeout(() => npcSay(c, revealToken(c)), 700);
    }
  }

  function pushMsg(cid, who, text) {
    if (!state.chats[cid]) state.chats[cid] = [];
    state.chats[cid].push({ who, text, t: clockLabel() });
    paintLog(cid);
  }
  function pushSys(cid, text) {
    if (!state.chats[cid]) state.chats[cid] = [];
    state.chats[cid].push({ who: "sys", text, t: clockLabel() });
    paintLog(cid);
  }
  function paintLog(cid) {
    const log = $("#log-" + cid);
    if (!log) return;
    log.innerHTML = (state.chats[cid] || [])
      .map((m) => {
        if (m.who === "sys") return `<div class="sys">${m.text}</div>`;
        const name = m.who === "me" ? "you" : CONTACTS.find((c) => c.id === cid).name;
        return `<div class="msg ${m.who === "me" ? "me" : ""}"><span class="from">${name}:</span> <span class="t">${escapeHtml(m.text)}</span></div>`;
      })
      .join("");
    log.scrollTop = log.scrollHeight;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function sendChat(cid) {
    const input = $("#in-" + cid);
    const text = (input.value || "").trim();
    if (!text) return;
    if (state.attention <= 0) {
      toast("attention", "you're out of attention. wait. or buy coffee in the ledger.");
      return;
    }
    state.attention = Math.max(0, state.attention - 0.35);
    input.value = "";
    pushMsg(cid, "me", text);
    const c = CONTACTS.find((x) => x.id === cid);
    if (!c.online) {
      pushSys(cid, `${c.name} is offline. your words sit in a draft the night might not deliver.`);
      renderLedger();
      return;
    }
    c.patience = Math.min(c.maxPatience, c.patience + 25);
    if (c.mood !== "online") {
      c.mood = "online";
      pushSys(cid, `${c.name} came back from away.`);
    }

    const lower = text.toLowerCase();
    let gain = 1;
    if (/love|miss|remember|stay|here|don't go|dont go|please/.test(lower)) gain = 3;
    if (/lol|lmao|haha|hehe/.test(lower)) gain = 1;
    if (/a\/s\/l/.test(lower)) gain = 2;
    if (state.vibe === c.genre) gain += 1;
    state.memory += gain;
    state.kept++;
    c.story++;

    const typ = $("#typ-" + cid);
    if (typ) typ.textContent = `${c.name} is typing...`;
    const delay = 700 + Math.random() * 1400;
    setTimeout(() => {
      if (typ) typ.textContent = "";
      npcReply(c, lower);
      renderMessenger();
      renderLedger();
      save();
    }, delay);
    renderLedger();
  }

  function npcReply(c, lower) {
    let line;
    if (/a\/s\/l/.test(lower)) {
      line = c.id === "jess" ? "16 / whatever / the room with the cheap lights" :
        c.id === "mom" ? "old enough / still your mother / kitchen" :
        c.id === "ghost" ? "former / former / the machine" :
        "online / online / online";
    } else if (/nudge/.test(lower)) {
      doNudge(c.id, true);
      return;
    } else if (c.id === "radio") {
      const tr = TRACKS[state.trackIndex];
      line = `currently: ${tr.name.replace(".mp3","").replace(".wav","")} — it sounds like ${tr.genre} trying to remember a kitchen light`;
    } else if (c.id === "tape") {
      const live = CONTACTS.filter((x) => x.token && x.online);
      if (/show|look|who|live|signed/.test(lower)) {
        line = live.length
          ? ("on the glass: " + live.map((x) => "$" + x.sym).join(", ") + ". they can speak for themselves.")
          : "quiet. I delete noise for a living.";
      } else {
        line = pick(c.lines.chat);
      }
    } else if (c.token) {
      if (/show|look|why|quote|ca|detail/.test(lower)) {
        line = revealToken(c);
        if (c.sym) quoteSearch(c.sym);
      } else if (/still|there|hello|hi/.test(lower)) {
        line = c.online ? "$" + c.sym + " still signed in." : "already away.";
      } else {
        line = revealToken(c);
      }
    } else if (/song|listen|winamp|playing|music/.test(lower)) {
      line = pick(c.lines.music.concat([`that's a ${state.vibe} night. i can work with that`]));
    } else if (/bye|gn|goodnight|sleep/.test(lower)) {
      line = pick(c.lines.bye);
    } else if (c.story > 4 && Math.random() < 0.35) {
      line = pick([
        "i don't know how to end a conversation that feels like a season",
        "if we both stay online does the morning have to happen",
        "save this window. i know you can't. i'm asking anyway",
      ]);
    } else {
      line = pick(c.lines.chat);
    }
    npcSay(c, line);
  }
  function npcSay(c, line) {
    pushMsg(c.id, "them", line);
    const chatEl = document.getElementById("chat-" + c.id);
    const open = chatEl && !chatEl.classList.contains("hidden") && !chatEl.classList.contains("minimized");
    if (!open) {
      state.unread[c.id] = (state.unread[c.id] || 0) + 1;
      ping();
      toast(c.name, line);
    } else {
      beep(700, 0.04, "sine", 0.03);
    }
    renderMessenger();
  }
  function sendSystem(cid, text) {
    pushSys(cid, text);
    state.memory += 1;
  }
  function showWink(who) {
    const ov = $("#wink-overlay");
    $("#wink-who").textContent = who + " — wink";
    ov.classList.remove("hidden");
    beep(660, 0.12, "sine", 0.05);
    setTimeout(() => beep(880, 0.16, "sine", 0.05), 90);
    setTimeout(() => ov.classList.add("hidden"), 1600);
  }
  function doNudge(cid, incoming = false) {
    state.nudges++;
    const el = document.getElementById("chat-" + cid) || chatWindow(cid);
    openApp(el.id);
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    nudgeSound();
    const c = CONTACTS.find((x) => x.id === cid);
    if (!incoming) {
      pushSys(cid, `you sent a nudge.`);
      setTimeout(() => npcSay(c, pick(["HEY", "rude. do it again", "the whole desk just jumped", "ok i'm here i'm here"])), 400);
    } else {
      pushSys(cid, `${c.name} sent you a nudge.`);
    }
  }

  function maybeMusicChat() { /* no random IMs. the tape speaks when the print is rude. */ }

  const tape = { last: 0, seen: new Set(), nominees: new Set() };
  const license = { mint: "", chain: "sol", ok: false, beta: true, quote: null, target: null, requestId: "" };
  const WSOL = "So11111111111111111111111111111111111111112";
  const SIGNED_MINT = "";
  const SIGNED_CHAIN = "sol";
  const SIGNED_DEV_BETA = true;
  const JUPITER_API_KEY = "";
  function isSolPair(p) {
    if (!p) return false;
    const chain = String(p.chainId || "").toLowerCase();
    const ca = (p.baseToken && p.baseToken.address) || "";
    return chain.indexOf("sol") >= 0 && ca && !ca.startsWith("0x");
  }
  function tokenActionBtn(c) {
    const native = isSolPair(c.pair || (c.hit && c.hit.p));
    if (!native) return `<button data-tok="trade">TRADE ↗</button>`;
    if (license.ok) return `<button data-tok="buy">⚡ BUY</button>`;
    return `<button data-tok="buy" class="buy-locked" title="SIGNED IN Professional">🔒 BUY</button>`;
  }
  function tapeContact() { return CONTACTS.find((c) => c.id === "tape"); }
  function tickerSym(p) {
    return String(p.baseToken?.symbol || "unk").replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) || "unk";
  }
  function ratio(n, d) {
    if (!d || d <= 0) return 0;
    return n / d;
  }
  function tokenPhaseStatus(sym, phase) {
    const s = "$" + sym;
    if (phase === "early") return s + " · volume before price";
    if (phase === "loud") return s + " · getting loud";
    if (phase === "away") return s + " · away";
    if (phase === "off") return s + " · signed off";
    return s + " · signed in";
  }
  function scorePair(p, nominated) {
    const liq = Number(p.liquidity?.usd || 0);
    const vol5 = Number(p.volume?.m5 || 0);
    const vol1 = Number(p.volume?.h1 || 0);
    const px5 = Number(p.priceChange?.m5 || 0);
    const px1 = Number(p.priceChange?.h1 || 0);
    const h24 = Math.abs(Number(p.priceChange?.h24 || 0));
    const buys5 = Number(p.txns?.m5?.buys || 0);
    const sells5 = Number(p.txns?.m5?.sells || 0);
    const buys1 = Number(p.txns?.h1?.buys || 0);
    const sells1 = Number(p.txns?.h1?.sells || 0);
    const tx5 = buys5 + sells5;
    const tx1 = buys1 + sells1;
    const txAccel = ratio(tx5 * 12, tx1);
    const buyAccel = ratio(buys5 * 12, buys1);
    const volAccel = ratio(vol5 * 12, vol1);
    const activity = Math.max(txAccel, volAccel, buyAccel);
    const buySkew = tx5 >= 8 ? buys5 / tx5 : 0.5;
    if (liq < 20000) return null;
    if (vol1 < 8000 && vol5 < 2500) return null;
    if (h24 > 400) return null;
    if (px1 >= 140) return null;

    let kind = null;
    let phase = "in";
    let score = 0;
    const quietPx = Math.abs(px1) <= 8 && Math.abs(px5) <= 3.5;
    const early =
      activity >= 2.1 &&
      tx5 >= 12 &&
      buyAccel >= 1.35 &&
      buys5 > sells5 &&
      quietPx;
    const loud =
      activity >= 1.8 &&
      tx5 >= 14 &&
      buySkew >= 0.55 &&
      Math.abs(px5) >= 2.5 &&
      Math.abs(px1) < 55;
    const grind =
      px1 >= 10 && px1 < 65 && px5 >= 2.5 && activity >= 1.25 && liq >= 25000;

    if (early) {
      kind = "early";
      phase = "early";
      score = 70 + activity * 10 + buySkew * 18 + Math.min(liq, 2e5) / 25000;
    } else if (loud) {
      kind = "loud";
      phase = "loud";
      score = 42 + activity * 6 + Math.min(Math.abs(px5), 12);
    } else if (grind) {
      kind = "grind";
      phase = "in";
      score = 24 + Math.min(px1, 35) + activity * 3;
    }
    if (!kind) return null;
    if (nominated) score *= 0.82;
    const note = kind === "early"
      ? `volume before price. 5m tx ${tx5} (${buys5}b/${sells5}s). tx ${txAccel.toFixed(1)}× the hour. price only ${px1 >= 0 ? "+" : ""}${px1.toFixed(1)}%.`
      : kind === "loud"
        ? `getting loud. buy accel ${buyAccel.toFixed(1)}× · vol ${volAccel.toFixed(1)}× · 5m ${px5 >= 0 ? "+" : ""}${px5.toFixed(1)}%.`
        : `slope. +${px1.toFixed(1)}% / 1h. not a firework.`;
    return {
      kind, phase, score, p, note,
      key: p.pairAddress || p.baseToken?.address || tickerSym(p),
      txAccel, buyAccel, volAccel, px1, px5, buys5, sells5,
    };
  }
  function tokenHandle(sym) {
    return "$" + String(sym || "UNK").toUpperCase();
  }
  function pruneTokenContacts() {
    const toks = CONTACTS.filter((c) => c.token && c.online);
    toks.sort((a, b) => (a.signedAt || 0) - (b.signedAt || 0));
    while (toks.length > 6) {
      const old = toks.shift();
      signTokenOff(old, "away");
    }
  }
  function signTokenOff(c, how) {
    if (!c) return;
    if (how === "away") {
      c.mood = "away";
      c.phase = "away";
      c.pic = "🟡";
      c.status0 = tokenPhaseStatus(c.sym || c.name.replace("$", ""), "away");
    } else {
      c.online = false;
      c.mood = "offline";
      c.phase = "off";
      c.pic = "⚫";
      c.status0 = tokenPhaseStatus(c.sym || c.name.replace("$", ""), "off");
      if (c.hit && c.hit.key) tape.seen.delete(c.hit.key);
    }
  }
  function upsertTokenContact(hit) {
    const p = hit.p;
    const sym = tickerSym(p);
    const id = "tok_" + sym.toLowerCase();
    let c = CONTACTS.find((x) => x.id === id);
    const fresh = !c;
    if (!c) {
      c = {
        id,
        name: tokenHandle(sym),
        pic: "🟢",
        genre: "idm",
        persona: "token",
        token: true,
        status0: tokenPhaseStatus(sym, hit.phase),
        online: true,
        mood: "online",
        patience: 180,
        maxPatience: 180,
        story: 0,
        locked: false,
        lines: { hello: [], chat: [], music: [], bye: [] },
        replies: ["show me", "why", "still there?"],
      };
      CONTACTS.push(c);
    }
    const wasGone = !fresh && (!c.online || c.mood === "offline" || c.phase === "off" || c.phase === "away");
    c.online = true;
    c.mood = "online";
    c.pic = "🟢";
    c.name = tokenHandle(sym);
    c.phase = hit.phase || "in";
    c.status0 = tokenPhaseStatus(sym, c.phase);
    c.patience = fresh || wasGone ? c.maxPatience : Math.max(c.patience, c.maxPatience * 0.75);
    c.pair = p;
    c.sym = sym.toUpperCase();
    c.hit = hit;
    if (fresh || wasGone) {
      c.revealed = false;
      c.signedAt = Date.now();
    }
    pruneTokenContacts();
    return { c, fresh, reactivated: wasGone };
  }
  function tokenDexUrl(c) {
    const p = c && (c.pair || (c.hit && c.hit.p));
    if (!p) return "";
    if (p.url) return p.url;
    if (p.chainId && p.pairAddress) return "https://dexscreener.com/" + p.chainId + "/" + p.pairAddress;
    const ca = p.baseToken && p.baseToken.address;
    return ca ? "https://dexscreener.com/search?q=" + encodeURIComponent(ca) : "";
  }
  function tokenTool(cid, act) {
    const c = CONTACTS.find((x) => x.id === cid);
    if (!c) return;
    const p = c.pair || (c.hit && c.hit.p);
    if (act === "chart") {
      const url = tokenDexUrl(c);
      if (!url) { toast(c.name, "no chart on the glass yet"); return; }
      pushSys(cid, "opening the pit's chart — trade lives there.");
      window.open(url, "_blank", "noopener");
      return;
    }
    if (act === "ca") {
      const ca = p && p.baseToken && p.baseToken.address;
      if (!ca) { toast(c.name, "no contract on this print"); return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ca).then(() => toast(c.name, "CA copied")).catch(() => toast(c.name, ca));
      } else toast(c.name, ca);
      pushSys(cid, "CA: " + ca);
      return;
    }
    if (act === "watch") {
      if (p) quote.focus = p;
      watchFocus();
      pushSys(cid, c.name + " added to the pit watch.");
      return;
    }
    if (act === "up") {
      if (p) quote.focus = p;
      conviction("up");
      pushSys(cid, "you put 2 memory on " + c.name + " ▲");
      return;
    }
    if (act === "why") {
      npcSay(c, revealToken(c));
      return;
    }
    if (act === "buy") {
      openWizard(c);
      return;
    }
    if (act === "trade") {
      const url = tokenDexUrl(c);
      if (url) window.open(url, "_blank", "noopener");
      pushSys(cid, "external pit — native ⚡ is Solana-only for now.");
    }
  }
  function revealToken(c) {
    if (!c || !c.hit) return "the print already left the glass.";
    if (!c.revealed) c.revealed = true;
    const p = c.pair || c.hit.p;
    const ca = p.baseToken?.address;
    return c.hit.note + (ca ? " · look it up in Quote.com." : "");
  }
  async function pairsFromQuery(q) {
    const data = await fetch("https://api.dexscreener.com/latest/dex/search?q=" + encodeURIComponent(q))
      .then((r) => r.json())
      .catch(() => ({ pairs: [] }));
    return data.pairs || [];
  }
  async function pairFromToken(addr) {
    const data = await fetch("https://api.dexscreener.com/latest/dex/tokens/" + encodeURIComponent(addr))
      .then((r) => r.json())
      .catch(() => null);
    const list = (data && data.pairs) || [];
    return list.sort((a, b) => Number(b.liquidity?.usd || 0) - Number(a.liquidity?.usd || 0))[0] || null;
  }
  async function scanTape() {
    if (Date.now() - tape.last < 90_000) return;
    tape.last = Date.now();
    try {
      const queries = ["SOL", "ETH", "BASE", "USDC", "WETH", "BONK"];
      const [boostLatest, boostTop, profiles, ...searchSets] = await Promise.all([
        fetch("https://api.dexscreener.com/token-boosts/latest/v1").then((r) => r.json()).catch(() => []),
        fetch("https://api.dexscreener.com/token-boosts/top/v1").then((r) => r.json()).catch(() => []),
        fetch("https://api.dexscreener.com/token-profiles/latest/v1").then((r) => r.json()).catch(() => []),
        ...queries.map(pairsFromQuery),
      ]);
      const pool = new Map();
      searchSets.flat().forEach((p) => {
        const key = p.pairAddress || p.baseToken?.address;
        if (key && !pool.has(key)) pool.set(key, { p, nominated: false });
      });
      const noms = []
        .concat(Array.isArray(boostLatest) ? boostLatest : [])
        .concat(Array.isArray(boostTop) ? boostTop : [])
        .concat(Array.isArray(profiles) ? profiles : []);
      const needFetch = [];
      noms.forEach((b) => {
        const addr = b.tokenAddress;
        if (!addr || tape.nominees.has(addr)) return;
        tape.nominees.add(addr);
        needFetch.push(addr);
      });
      const extra = await Promise.all(needFetch.slice(0, 8).map(pairFromToken));
      extra.forEach((p) => {
        if (!p) return;
        const key = p.pairAddress || p.baseToken?.address;
        if (key && !pool.has(key)) pool.set(key, { p, nominated: true });
        else if (key && pool.has(key)) pool.get(key).nominated = true;
      });

      const hits = [];
      pool.forEach(({ p, nominated }) => {
        const key = p.pairAddress || p.baseToken?.address;
        if (!key) return;
        const hit = scorePair(p, nominated);
        if (hit) hits.push(hit);
      });
      CONTACTS.filter((c) => c.token && (c.online || c.mood === "away")).forEach((c) => {
        const hit = hits.find((h) => h.key === (c.hit && c.hit.key));
        if (!hit) return;
        const prev = c.phase;
        c.hit = hit;
        c.pair = hit.p;
        if (hit.phase === "loud" && prev !== "loud" && c.online) {
          c.phase = "loud";
          c.status0 = tokenPhaseStatus(c.sym, "loud");
        } else if (hit.phase === "early" && c.online) {
          c.phase = "early";
          c.status0 = tokenPhaseStatus(c.sym, "early");
        }
      });
      hits.sort((a, b) => b.score - a.score);
      const pickOne = hits.find((h) => {
        if (!tape.seen.has(h.key)) return true;
        const ex = CONTACTS.find((x) => x.token && x.hit && x.hit.key === h.key);
        return ex && (!ex.online || ex.phase === "away" || ex.phase === "off");
      });
      if (pickOne) {
        tape.seen.add(pickOne.key);
        if (tape.seen.size > 60) tape.seen = new Set([...tape.seen].slice(-30));
        const { c, fresh, reactivated } = upsertTokenContact(pickOne);
        if (fresh) npcSay(c, c.name + " has signed in.");
        else if (reactivated) npcSay(c, pick([c.name + " has signed in again.", c.name + " is back."]));
      }
      renderMessenger();
    } catch (e) {}
  }

  function incomingTick() { /* no random buddy spam */ }

  function patienceTick(dtMin) {
    CONTACTS.forEach((c) => {
      if (c.locked || !c.online) return;
      if (c.id === "radio" || c.id === "tape") return;
      let drain = dtMin * (c.mood === "away" ? 0.4 : 1);
      if (state.vibe === c.genre && state.playing) drain *= 0.45;
      if (state.upgrades.ghost) drain *= 0.8;
      if (c.token) drain *= 0.7;
      c.patience -= drain;
      if (c.patience < c.maxPatience * 0.4 && c.mood === "online") {
        if (c.token) signTokenOff(c, "away");
        else {
          c.mood = "away";
          c.status0 = pick(["away", "brb", "stepped away from the machine"]);
        }
      }
      if (c.patience <= 0) {
        if (c.token) {
          signTokenOff(c, "off");
          toast(c.name, "signed off.");
          const el = document.getElementById("chat-" + c.id);
          if (el) pushSys(c.id, c.name + " signed off. the print cooled.");
        } else {
          c.online = false;
          c.mood = "offline";
          state.lost++;
          toast(c.name, "signed off.");
          const el = document.getElementById("chat-" + c.id);
          if (el) pushSys(c.id, `${c.name} signed off. the cursor keeps blinking anyway.`);
        }
      }
    });
    renderMessenger();
  }

  // ---------- ledger ----------
  const SHOP = [
    { id: "coffee", name: "instant coffee (max attention +3)", cost: 8, apply: () => { state.upgrades.coffee = true; state.maxAttention += 3; state.attention += 3; } },
    { id: "extraTab", name: "always-on-top rumor (contacts linger)", cost: 12, apply: () => {
      state.upgrades.extraTab = true;
      CONTACTS.forEach((c) => { c.maxPatience += 40; c.patience += 40; });
    } },
    { id: "betterVis", name: "milkdrop-ish visualization", cost: 10, apply: () => { state.upgrades.betterVis = true; } },
    { id: "goldSkin", name: "gold winamp skin (artsy)", cost: 15, apply: () => { state.upgrades.goldSkin = true; document.getElementById("winamp").style.boxShadow = "4px 6px 0 rgba(0,0,0,0.5), 0 0 24px rgba(232,195,106,0.45)"; } },
    { id: "ghost", name: "restore old_screenname from recycle bin", cost: 20, apply: () => {
      state.upgrades.ghost = true;
      const g = CONTACTS.find((c) => c.id === "ghost");
      g.locked = false; g.online = true; g.mood = "away";
      toast("old_screenname", "is online. they never weren't.");
      renderMessenger();
    } },
  ];

  function renderLedger() {
    const el = $("#ledger-body");
    if (!el) return;
    const on = CONTACTS.filter((c) => c.online && !c.locked).length;
    el.innerHTML = `
      <h2>Night Ledger</h2>
      <div class="tag">SESSION ${state.nights} — KEEP THE MACHINE WARM</div>
      <div class="stats">
        <div class="stat"><div class="k">Memory</div><div class="v">${Math.floor(state.memory)}</div></div>
        <div class="stat"><div class="k">Attention</div><div class="v">${state.attention.toFixed(1)}/${state.maxAttention}</div></div>
        <div class="stat"><div class="k">Signed in</div><div class="v">${on}</div></div>
        <div class="stat"><div class="k">Signed off</div><div class="v">${state.lost}</div></div>
        <div class="stat"><div class="k">Nudges</div><div class="v">${state.nudges}</div></div>
        <div class="stat"><div class="k">Tracks</div><div class="v">${state.songsPlayed}</div></div>
      </div>
      <div class="lore">Memory is what they leave in you when the window closes. Spend it on keeping the night expensive.</div>
      ${SHOP.map((s) => {
        const owned = state.upgrades[s.id];
        return `<div class="upg"><div>${s.name}<br><span style="color:#8a7d62">${s.cost} memory</span></div>
          <button ${owned || state.memory < s.cost ? "disabled" : ""} data-buy="${s.id}">${owned ? "owned" : "buy"}</button></div>`;
      }).join("")}
      <div class="lore" style="margin-top:16px">
        Play the song that matches a name and they stay. Answer like you mean it and the ledger fattens.
        Dawn is a mechanic. So is your mother. So is the version of you in the recycle bin.
      </div>
    `;
    $$("[data-buy]").forEach((b) =>
      b.addEventListener("click", () => {
        const s = SHOP.find((x) => x.id === b.dataset.buy);
        if (!s || state.upgrades[s.id] || state.memory < s.cost) return;
        state.memory -= s.cost;
        s.apply();
        toast("ledger", s.name);
        renderLedger();
        save();
      })
    );
    $("#memtray").textContent = `◆ ${Math.floor(state.memory)}`;
  }

  // ---------- winamp ----------
  function renderWinamp() {
    const t = TRACKS[state.trackIndex];
    $("#wa-time").textContent = state.playing ? "▶ " + clockLabel() : "■ 00:00";
    $("#wa-track").textContent = `${state.trackIndex + 1}. ${t.name}  •  ${t.genre}  •  ${t.bpm}bpm`;
    $("#wa-list").innerHTML = TRACKS.map(
      (tr, i) => `<div class="sitem" data-tr="${i}" style="padding:3px 8px;font-size:11px;color:${i === state.trackIndex ? "#6f6" : "#ccc"}">${i === state.trackIndex ? "► " : ""}${tr.name}</div>`
    ).join("");
    $$("#wa-list [data-tr]").forEach((el) =>
      el.addEventListener("click", () => playTrack(+el.dataset.tr))
    );
  }

  function drawVis() {
    const canvas = $("#wa-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, w, h);
    if (!visAnalyser) {
      requestAnimationFrame(drawVis);
      return;
    }
    const data = new Uint8Array(visAnalyser.frequencyBinCount);
    visAnalyser.getByteFrequencyData(data);
    const n = state.upgrades.betterVis ? data.length : 12;
    const bw = w / n;
    for (let i = 0; i < n; i++) {
      const v = data[i] || (state.playing ? Math.random() * 80 : 0);
      const bh = (v / 255) * h;
      const t = TRACKS[state.trackIndex];
      ctx.fillStyle = t.color;
      ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
      if (state.upgrades.betterVis) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(i * bw + 1, h - bh, bw - 2, 2);
      }
    }
    requestAnimationFrame(drawVis);
  }

  // ---------- clock / dawn ----------
  function clockLabel() {
    const h = Math.floor(state.nightMin / 60);
    const m = Math.floor(state.nightMin % 60);
    const hh = ((h + 11) % 12) + 1;
    const ap = h >= 12 ? "PM" : "AM";
    return `${hh}:${String(m).padStart(2, "0")} ${ap}`;
  }
  function tick(ts) {
    requestAnimationFrame(tick);
    const real = (ts - state.lastTs) / 1000;
    state.lastTs = ts;
    if (!state.bootDone || state.paused) return;
    state.nightMin += (real * state.speed) / 60;
    // regen attention
    state.attention = Math.min(state.maxAttention, state.attention + real * 0.12);
    if (Math.floor(state.nightMin) % 25 === 0) {
      // throttle incoming on minute marks via accumulator instead
    }
    $("#clk").textContent = clockLabel();
    const prog = Math.min(1, (state.nightMin - (1 * 60 + 47)) / (state.dawnMin - (1 * 60 + 47)));
    $("#dawn").style.opacity = Math.max(0, (prog - 0.55) * 1.6);
    $("#dawn").style.background = `linear-gradient(180deg, rgba(255,170,90,${prog * 0.15}) 0%, rgba(255,200,140,${prog * 0.22}) 100%)`;

    if (!tick._acc) tick._acc = 0;
    tick._acc += real;
    if (tick._acc > 11) {
      tick._acc = 0;
      incomingTick();
      patienceTick(2.2);
      save();
      tick._pit = (tick._pit || 0) + 1;
      if (tick._pit % 4 === 0 && quote.watches.length) {
        quoteSearch(quote.q);
      }
      if (tick._pit % 2 === 0) scanTape();
      const qw = $("#quote");
      if (qw && !qw.classList.contains("hidden") && !qw.classList.contains("minimized")) {
        pingPitWorker();
      }
    }
    if (state.nightMin >= state.dawnMin && !state._dawning) {
      dawn();
    }
    $("#memtray").textContent = `◆ ${Math.floor(state.memory)}`;
    mineTick();
    if (Math.floor(ts / 1000) % 5 === 0) saverTick();
  }

  function dawn() {
    if (state._dawning) return;
    state._dawning = true;
    state.paused = true;
    CONTACTS.forEach((c) => {
      if (c.id === "ghost") return;
      if (c.id === "mom") {
        c.mood = "away";
        c.status0 = "at work. lasagna remains.";
        return;
      }
      if (c.online && Math.random() < 0.7) {
        c.online = false;
        c.mood = "offline";
        toast(c.name, "has to be a daytime person now.");
      }
    });
    toast("dawn", "the night folded. memory kept. next dusk will remember your upgrades.");
    setTimeout(() => {
      state.nights += 1;
      state.nightMin = 1 * 60 + 37 + Math.floor(Math.random() * 20);
      state._dawning = false;
      state.paused = false;
      CONTACTS.forEach((c) => {
        if (c.locked) return;
        if (c.id === "ghost" && state.upgrades.ghost) {
          c.online = true; c.mood = "away"; c.patience = c.maxPatience;
          return;
        }
        if (c.id !== "ghost") {
          c.online = true;
          c.mood = Math.random() < 0.3 ? "away" : "online";
          c.patience = c.maxPatience * (0.6 + Math.random() * 0.4);
        }
      });
      renderMessenger();
      save();
    }, 4000);
  }

  // ---------- ui helpers ----------
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function toast(title, body) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<b>${escapeHtml(title)}</b>${escapeHtml(body)}`;
    $("#toasts").appendChild(t);
    setTimeout(() => t.remove(), 4200);
  }

  // ---------- minesweeper ----------
  const mine = { size: 9, bombs: 10, grid: [], started: false, dead: false, won: false, t0: 0, timer: 0, face: "🙂" };
  function mineNeighbors(i) {
    const s = mine.size, x = i % s, y = Math.floor(i / s), out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= s || ny >= s) continue;
      out.push(ny * s + nx);
    }
    return out;
  }
  function mineReset() {
    mine.started = mine.dead = mine.won = false;
    mine.timer = 0;
    mine.face = "🙂";
    mine.grid = Array.from({ length: mine.size * mine.size }, () => ({ bomb: false, open: false, flag: false, n: 0 }));
    minePaint();
  }
  function minePlant(safeI) {
    const forbidden = new Set([safeI, ...mineNeighbors(safeI)]);
    let placed = 0;
    let guard = 0;
    while (placed < mine.bombs && guard++ < 4000) {
      const i = Math.floor(Math.random() * mine.grid.length);
      if (mine.grid[i].bomb || forbidden.has(i)) continue;
      mine.grid[i].bomb = true;
      placed++;
    }
    mine.grid.forEach((cell, i) => {
      cell.n = mineNeighbors(i).reduce((n, j) => n + (mine.grid[j].bomb ? 1 : 0), 0);
    });
  }
  function minePaint() {
    const grid = $("#mine-grid");
    if (!grid) return;
    const flags = mine.grid.filter((c) => c.flag).length;
    $("#mine-left").textContent = String(Math.max(0, mine.bombs - flags)).padStart(3, "0");
    $("#mine-time").textContent = String(Math.min(999, mine.timer)).padStart(3, "0");
    $("#mine-face").textContent = mine.dead ? "😵" : mine.won ? "😎" : mine.face;
    const colors = ["", "#00f", "#008000", "#f00", "#000080", "#800000", "#008080", "#000", "#777"];
    grid.innerHTML = mine.grid.map((c, i) => {
      if (c.flag && !c.open) return `<div class="mc flag" data-i="${i}">⚑</div>`;
      if (!c.open) return `<div class="mc" data-i="${i}"></div>`;
      if (c.bomb) return `<div class="mc open boom" data-i="${i}">*</div>`;
      return `<div class="mc open" data-i="${i}" style="color:${colors[c.n]}">${c.n || ""}</div>`;
    }).join("");
    grid.querySelectorAll(".mc").forEach((el) => {
      const i = +el.dataset.i;
      el.addEventListener("mousedown", () => {
        if (!mine.dead && !mine.won) { mine.face = "😮"; const f = $("#mine-face"); if (f) f.textContent = "😮"; }
      });
      el.addEventListener("mouseup", () => { if (!mine.dead && !mine.won) mine.face = "🙂"; });
      el.addEventListener("click", () => mineOpen(i));
      el.addEventListener("dblclick", () => mineChord(i));
      el.addEventListener("contextmenu", (e) => { e.preventDefault(); mineFlag(i); });
    });
  }
  function mineOpen(i) {
    if (mine.dead || mine.won) return;
    const c = mine.grid[i];
    if (c.open || c.flag) return;
    if (!mine.started) {
      mine.started = true;
      mine.t0 = performance.now();
      minePlant(i);
    }
    c.open = true;
    if (c.bomb) {
      mine.dead = true;
      mine.grid.forEach((x) => { if (x.bomb) x.open = true; });
      beep(90, 0.3, "sawtooth", 0.08);
      toast("minesweeper", "boom. the night continues anyway.");
      minePaint();
      return;
    }
    if (c.n === 0) {
      mineNeighbors(i).forEach((j) => {
        if (!mine.grid[j].open && !mine.grid[j].flag) mineOpen(j);
      });
    }
    if (mine.grid.every((x) => x.bomb || x.open)) {
      mine.won = true;
      state.memory += 5;
      toast("minesweeper", "clear. +5 memory for hands that still know this.");
      renderLedger();
      save();
    }
    minePaint();
  }
  function mineChord(i) {
    const c = mine.grid[i];
    if (!c.open || !c.n || mine.dead || mine.won) return;
    const nbs = mineNeighbors(i);
    const flagged = nbs.filter((j) => mine.grid[j].flag).length;
    if (flagged !== c.n) return;
    nbs.forEach((j) => { if (!mine.grid[j].flag && !mine.grid[j].open) mineOpen(j); });
  }
  function mineFlag(i) {
    if (mine.dead || mine.won) return;
    const c = mine.grid[i];
    if (c.open) return;
    c.flag = !c.flag;
    minePaint();
  }
  function mineTick() {
    if (mine.started && !mine.dead && !mine.won) {
      mine.timer = Math.floor((performance.now() - mine.t0) / 1000);
      const el = $("#mine-time");
      if (el) el.textContent = String(Math.min(999, mine.timer)).padStart(3, "0");
    }
  }

  // ---------- klondike solitaire ----------
  const SUIT = [
    { id: "h", g: "♥", red: true },
    { id: "d", g: "♦", red: true },
    { id: "s", g: "♠", red: false },
    { id: "c", g: "♣", red: false },
  ];
  const RANKL = { 1: "A", 11: "J", 12: "Q", 13: "K" };
  const soli = {
    stock: [], waste: [], found: [[], [], [], []], tab: [[], [], [], [], [], [], []],
    sel: null, drawN: 1, won: false, moves: 0,
  };
  function rk(n) { return RANKL[n] || String(n); }
  function soliShuffle() {
    const deck = [];
    SUIT.forEach((s) => {
      for (let r = 1; r <= 13; r++) deck.push({ s: s.id, g: s.g, red: s.red, r, up: false, id: s.id + r });
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }
  function soliDeal() {
    const deck = soliShuffle();
    soli.found = [[], [], [], []];
    soli.tab = [[], [], [], [], [], [], []];
    soli.waste = [];
    soli.sel = null;
    soli.won = false;
    soli.moves = 0;
    for (let col = 0; col < 7; col++) {
      for (let n = 0; n <= col; n++) {
        const card = deck.pop();
        card.up = n === col;
        soli.tab[col].push(card);
      }
    }
    soli.stock = deck;
    soliPaint();
  }
  function soliPaint() {
    const board = $("#soli-board");
    if (!board) return;
    const cardHtml = (c, extra = "") => {
      if (!c.up) return `<div class="pcard back ${extra}" data-id="${c.id}"></div>`;
      return `<div class="pcard ${c.red ? "red" : "black"} ${extra}" data-id="${c.id}"><div class="r">${rk(c.r)}</div><div class="s">${c.g}</div></div>`;
    };
    const isSel = (id) => soli.sel && soli.sel.id === id;
    let html = `<div class="soli-top"><div class="soli-left">`;
    html += `<div class="pile slot stock" data-pile="stock">${
      soli.stock.length ? cardHtml({ ...soli.stock[soli.stock.length - 1], up: false }, "stock-top") : ""
    }</div>`;
    html += `<div class="pile slot waste" data-pile="waste">`;
    const show = soli.waste.slice(-Math.max(1, soli.drawN));
    show.forEach((c, i) => {
      html += cardHtml(c, (i === show.length - 1 && isSel(c.id) ? "sel" : "") + `" style="left:${i * 16}px`);
    });
    html += `</div></div><div class="soli-found">`;
    soli.found.forEach((p, i) => {
      const top = p[p.length - 1];
      html += `<div class="pile slot" data-pile="f${i}">${top ? cardHtml(top, isSel(top.id) ? "sel" : "") : ""}</div>`;
    });
    html += `</div></div><div class="soli-tab">`;
    soli.tab.forEach((p, i) => {
      html += `<div class="pile slot" data-pile="t${i}">`;
      if (!p.length) html += `<div class="pcard" style="opacity:0;pointer-events:none"></div>`;
      p.forEach((c, k) => {
        html += cardHtml(c, `${isSel(c.id) ? "sel" : ""}" style="top:${k * 22}px`);
      });
      html += `</div>`;
    });
    html += `</div><div class="soli-status">${
      soli.won ? "you put the night in order. +8 memory." : "click a card, then a pile · double-click to the suit stack · red on black"
    } · ${soli.moves} moves</div>`;
    board.innerHTML = html;

    board.querySelector(".stock").addEventListener("click", (e) => {
      e.stopPropagation();
      soliDraw();
    });
    board.querySelectorAll("[data-pile]").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (el.dataset.pile === "stock") return;
        const cardEl = e.target.closest(".pcard");
        soliClick(el.dataset.pile, cardEl ? cardEl.dataset.id : null);
      });
      el.addEventListener("dblclick", (e) => {
        const cardEl = e.target.closest(".pcard");
        if (cardEl) soliAuto(cardEl.dataset.id);
      });
    });
  }
  function soliFind(id) {
    if (!id) return null;
    for (let i = 0; i < 7; i++) {
      const k = soli.tab[i].findIndex((c) => c.id === id);
      if (k >= 0) return { kind: "t", i, k, pile: soli.tab[i] };
    }
    const w = soli.waste.findIndex((c) => c.id === id);
    if (w >= 0) return { kind: "w", i: 0, k: w, pile: soli.waste };
    for (let i = 0; i < 4; i++) {
      const k = soli.found[i].findIndex((c) => c.id === id);
      if (k >= 0) return { kind: "f", i, k, pile: soli.found[i] };
    }
    return null;
  }
  function soliCanTab(moving, destTop) {
    if (!destTop) return moving.r === 13;
    return moving.red !== destTop.red && moving.r === destTop.r - 1;
  }
  function soliCanFound(moving, destTop) {
    if (!destTop) return moving.r === 1;
    return moving.s === destTop.s && moving.r === destTop.r + 1;
  }
  function soliTake(loc) {
    if (loc.kind === "w") {
      if (loc.k !== soli.waste.length - 1) return null;
      return [soli.waste.pop()];
    }
    if (loc.kind === "f") {
      if (loc.k !== loc.pile.length - 1) return null;
      return [loc.pile.pop()];
    }
    const run = loc.pile.slice(loc.k);
    if (run.some((c) => !c.up)) return null;
    for (let i = 1; i < run.length; i++) {
      if (run[i].red === run[i - 1].red || run[i].r !== run[i - 1].r - 1) return null;
    }
    loc.pile.length = loc.k;
    return run;
  }
  function soliFlipTop(i) {
    const p = soli.tab[i];
    if (p.length && !p[p.length - 1].up) p[p.length - 1].up = true;
  }
  function soliDrop(run, pileKey) {
    if (pileKey.startsWith("t")) {
      const i = +pileKey.slice(1);
      const dest = soli.tab[i];
      if (!soliCanTab(run[0], dest[dest.length - 1])) return false;
      dest.push(...run);
      return true;
    }
    if (pileKey.startsWith("f")) {
      if (run.length !== 1) return false;
      const i = +pileKey.slice(1);
      const dest = soli.found[i];
      if (!soliCanFound(run[0], dest[dest.length - 1])) return false;
      dest.push(run[0]);
      return true;
    }
    return false;
  }
  function soliClick(pileKey, cardId) {
    if (soli.won) return;
    if (!soli.sel) {
      if (!cardId) return;
      const loc = soliFind(cardId);
      if (!loc) return;
      const card = loc.pile[loc.k];
      if (!card.up) return;
      if (loc.kind === "w" && loc.k !== loc.pile.length - 1) return;
      soli.sel = { id: cardId, from: pileKey };
      soliPaint();
      return;
    }
    if (cardId && soli.sel.id === cardId) {
      soli.sel = null;
      soliPaint();
      return;
    }
    const loc = soliFind(soli.sel.id);
    if (!loc) { soli.sel = null; soliPaint(); return; }
    const run = soliTake(loc);
    if (!run) { soli.sel = null; soliPaint(); return; }
    if (!soliDrop(run, pileKey)) {
      if (loc.kind === "w") soli.waste.push(...run);
      else if (loc.kind === "f") soli.found[loc.i].push(...run);
      else soli.tab[loc.i].push(...run);
      soli.sel = cardId ? { id: cardId, from: pileKey } : null;
      soliPaint();
      return;
    }
    if (loc.kind === "t") soliFlipTop(loc.i);
    soli.sel = null;
    soli.moves++;
    soliCheckWin();
    soliPaint();
  }
  function soliDraw() {
    soli.sel = null;
    if (!soli.stock.length) {
      soli.stock = soli.waste.reverse().map((c) => ({ ...c, up: false }));
      soli.waste = [];
      soliPaint();
      return;
    }
    for (let n = 0; n < soli.drawN && soli.stock.length; n++) {
      const c = soli.stock.pop();
      c.up = true;
      soli.waste.push(c);
    }
    soli.moves++;
    soliPaint();
  }
  function soliAuto(id) {
    const loc = soliFind(id);
    if (!loc) return;
    const card = loc.pile[loc.k];
    if (!card.up) return;
    if (loc.kind === "t" && loc.k !== loc.pile.length - 1) return;
    if (loc.kind === "w" && loc.k !== loc.pile.length - 1) return;
    for (let i = 0; i < 4; i++) {
      if (soliCanFound(card, soli.found[i][soli.found[i].length - 1])) {
        const run = soliTake(loc);
        if (!run) return;
        soli.found[i].push(run[0]);
        if (loc.kind === "t") soliFlipTop(loc.i);
        soli.moves++;
        soliCheckWin();
        soli.sel = null;
        soliPaint();
        return;
      }
    }
  }
  function soliCheckWin() {
    if (soli.found.every((p) => p.length === 13)) {
      soli.won = true;
      state.memory += 8;
      toast("solitaire", "the deck is empty. the night is not. +8 memory.");
      renderLedger();
      save();
      beep(660, 0.12, "sine", 0.06);
      setTimeout(() => beep(880, 0.18, "sine", 0.05), 140);
    }
  }

  // ---------- 3D pipes screensaver ----------
  const pipes = { on: false, raf: 0, last: 0, segs: [], heads: [], occ: new Set() };
  const DIRS = [
    [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
  ];
  function pk(x, y, z) { return x + "," + y + "," + z; }
  function pipeColor() {
    return pick(["#3ad07a", "#4aa3ff", "#ff5d8f", "#f2c14e", "#c084fc", "#67e8f9", "#fb923c"]);
  }
  function pipesStop() {
    pipes.on = false;
    if (pipes.raf) cancelAnimationFrame(pipes.raf);
    pipes.raf = 0;
  }
  function pipesStart() {
    const canvas = $("#pipes");
    if (!canvas) return;
    pipes.on = true;
    pipes.segs = [];
    pipes.heads = [];
    pipes.occ = new Set();
    pipes.last = 0;
    for (let i = 0; i < 3; i++) pipes.spawn();
    const loop = (t) => {
      if (!pipes.on) return;
      if (t - pipes.last > 70) {
        pipes.last = t;
        pipes.step();
      }
      pipes.draw();
      pipes.raf = requestAnimationFrame(loop);
    };
    pipes.raf = requestAnimationFrame(loop);
  }
  pipes.spawn = function () {
    if (pipes.heads.length > 7) return;
    const p = {
      x: (Math.random() * 10 - 5) | 0,
      y: (Math.random() * 10 - 5) | 0,
      z: (Math.random() * 6) | 0,
      dir: (Math.random() * 6) | 0,
      color: pipeColor(),
      life: 40 + ((Math.random() * 50) | 0),
    };
    pipes.occ.add(pk(p.x, p.y, p.z));
    pipes.heads.push(p);
    pipes.segs.push({ x: p.x, y: p.y, z: p.z, nx: p.x, ny: p.y, nz: p.z, color: p.color, joint: true });
  };
  pipes.step = function () {
    if (Math.random() < 0.08) pipes.spawn();
    pipes.heads.forEach((h) => {
      h.life--;
      if (h.life <= 0) return;
      if (Math.random() < 0.28) h.dir = (Math.random() * 6) | 0;
      let tries = 0, ok = false, nx, ny, nz;
      while (tries++ < 8) {
        const d = DIRS[h.dir];
        nx = h.x + d[0]; ny = h.y + d[1]; nz = h.z + d[2];
        if (Math.abs(nx) > 8 || Math.abs(ny) > 8 || nz < 0 || nz > 7 || pipes.occ.has(pk(nx, ny, nz))) {
          h.dir = (Math.random() * 6) | 0;
          continue;
        }
        ok = true;
        break;
      }
      if (!ok) { h.life = 0; return; }
      const joint = Math.random() < 0.18;
      pipes.segs.push({ x: h.x, y: h.y, z: h.z, nx, ny, nz, color: h.color, joint });
      pipes.occ.add(pk(nx, ny, nz));
      h.x = nx; h.y = ny; h.z = nz;
    });
    pipes.heads = pipes.heads.filter((h) => h.life > 0);
    if (pipes.segs.length > 520) {
      pipes.segs = [];
      pipes.heads = [];
      pipes.occ = new Set();
      pipes.spawn();
      pipes.spawn();
    }
    if (!pipes.heads.length) pipes.spawn();
  };
  pipes.draw = function () {
    const canvas = $("#pipes");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.clientWidth || innerWidth;
    const h = canvas.height = canvas.clientHeight || innerHeight;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, w, h);
    const iso = (x, y, z) => {
      const tw = 26, th = 13;
      return {
        sx: w * 0.5 + (x - y) * tw,
        sy: h * 0.58 + (x + y) * th - z * 20,
      };
    };
    const ordered = pipes.segs.slice().sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));
    ordered.forEach((s) => {
      const a = iso(s.x, s.y, s.z);
      const b = iso(s.nx, s.ny, s.nz);
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 14;
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 11;
      ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(a.sx - 3, a.sy - 3);
      ctx.lineTo(b.sx - 3, b.sy - 3);
      ctx.stroke();
      if (s.joint) {
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(b.sx, b.sy, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath(); ctx.arc(b.sx - 2, b.sy - 2, 3, 0, Math.PI * 2); ctx.fill();
      }
    });
  };

  // ---------- Quote.com / DexScreener / the pit ----------
  const quote = { q: "sol", rows: [], focus: null, watches: [], slips: [], wallet: null, lastPing: {}, live: null, sid: null };
  function pitUrl() {
    try { return (localStorage.getItem("signed-in-pit-url") || "").replace(/\/$/, ""); } catch (e) { return ""; }
  }
  function sessionId() {
    if (quote.sid) return quote.sid;
    try {
      quote.sid = localStorage.getItem("signed-in-sid");
      if (!quote.sid) {
        quote.sid = "n" + Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem("signed-in-sid", quote.sid);
      }
    } catch (e) {
      quote.sid = "n" + Math.random().toString(36).slice(2);
    }
    return quote.sid;
  }
  function loadPit() {
    try {
      const raw = JSON.parse(localStorage.getItem("signed-in-pit") || "null");
      if (raw) {
        quote.watches = raw.watches || [];
        quote.slips = raw.slips || [];
        quote.wallet = raw.wallet || null;
        quote.q = raw.q || quote.q;
      }
    } catch (e) {}
  }
  function savePit() {
    try {
      localStorage.setItem("signed-in-pit", JSON.stringify({
        watches: quote.watches, slips: quote.slips, wallet: quote.wallet, q: quote.q,
      }));
    } catch (e) {}
  }
  function shortAddr(a) {
    if (!a) return "—";
    return a.slice(0, 6) + "…" + a.slice(-4);
  }
  function money(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return "—";
    if (x >= 1e9) return (x / 1e9).toFixed(2) + "B";
    if (x >= 1e6) return (x / 1e6).toFixed(2) + "M";
    if (x >= 1e3) return (x / 1e3).toFixed(1) + "k";
    if (x >= 1) return x.toFixed(4);
    return x.toPrecision(3);
  }
  function pairKey(p) {
    return (p.chainId || "") + ":" + (p.pairAddress || p.baseToken?.address || p.baseToken?.symbol);
  }
  function pairName(p) {
    return (p.baseToken?.symbol || "?") + "/" + (p.quoteToken?.symbol || "?");
  }
  function renderWallet() {
    const el = $("#quote-wallet");
    const tray = $("#waltray");
    if (quote.wallet) {
      if (el) el.textContent = quote.wallet.chain + " · " + shortAddr(quote.wallet.address);
      if (tray) tray.textContent = shortAddr(quote.wallet.address);
    } else {
      if (el) el.textContent = "wallet: not signed in";
      if (tray) tray.textContent = "off";
    }
  }
  function renderPit() {
    const focus = $("#quote-focus");
    if (focus) {
      if (!quote.focus) focus.textContent = "no pair selected";
      else {
        const p = quote.focus;
        const ch = Number(p.priceChange?.h24 || 0);
        focus.innerHTML = `<b>${escapeHtml(pairName(p))}</b><br>$${money(p.priceUsd)} · <span class="${ch>=0?"up":"dn"}">${ch>=0?"+":""}${ch.toFixed(2)}%</span><br><span class="dim">${escapeHtml(p.chainId || "")} · liq ${money(p.liquidity?.usd)}</span>`;
      }
    }
    const list = $("#pit-list");
    if (list) {
      if (!quote.watches.length) list.innerHTML = `<div class="dim">empty. watch a print.</div>`;
      else list.innerHTML = quote.watches.map((w) => {
        const ch = Number(w.chg || 0);
        return `<div class="row" data-watch="${escapeHtml(w.key)}"><span>${escapeHtml(w.sym)}</span><span class="${ch>=0?"up":"dn"}">${ch>=0?"+":""}${Number(ch).toFixed(1)}%</span></div>`;
      }).join("");
      list.querySelectorAll("[data-watch]").forEach((row) => {
        row.addEventListener("click", () => {
          const w = quote.watches.find((x) => x.key === row.dataset.watch);
          if (w) quoteSearch(w.addr || w.sym);
        });
      });
    }
    const slips = $("#pit-slips");
    if (slips) {
      if (!quote.slips.length) slips.innerHTML = `<div class="dim">no conviction yet</div>`;
      else slips.innerHTML = quote.slips.slice().reverse().slice(0, 8).map((s) => {
        const now = s.last || s.entry;
        const pnl = s.dir === "up" ? (now - s.entry) / s.entry : (s.entry - now) / s.entry;
        const cls = pnl >= 0 ? "up" : "dn";
        return `<div class="row"><span>${escapeHtml(s.sym)} ${s.dir === "up" ? "▲" : "▼"} ${s.stake}◆</span><span class="${cls}">${pnl>=0?"+":""}${(pnl*100).toFixed(1)}%</span></div>`;
      }).join("");
    }
    renderWallet();
    renderLive();
  }
  function renderLive() {
    const el = $("#pit-live");
    if (!el) return;
    if (!pitUrl()) {
      el.textContent = "signed in here: only you · plak een Worker-URL voor live";
      return;
    }
    const live = quote.live;
    if (!live) {
      el.textContent = "signed in here: dialing the pit…";
      return;
    }
    const names = (live.people || []).map((p) => p.name).slice(0, 8);
    el.innerHTML = `<b>${live.count || 0} signed in</b>` +
      (names.length ? "<br>" + names.map((n) => escapeHtml(n)).join(", ") : "");
  }
  function setFocus(p) {
    quote.focus = p;
    quote.live = null;
    renderPit();
    pingPitWorker();
    const url = p.url || "";
    const bar = document.querySelector("#quote .ie-url");
    if (bar && url) bar.textContent = url.replace("https://", "http://night.");
  }
  async function quoteSearch(q) {
    quote.q = (q || quote.q || "sol").trim();
    const meta = $("#quote-meta");
    const body = $("#quote-rows");
    if (meta) meta.textContent = "handshaking DexScreener over a 28.8k ghost modem…";
    if (body) body.innerHTML = `<tr><td colspan="4" class="dim">fetching ${escapeHtml(quote.q)}…</td></tr>`;
    savePit();
    try { localStorage.setItem("signed-in-ticker", quote.q); } catch (e) {}
    try {
      const res = await fetch("https://api.dexscreener.com/latest/dex/search?q=" + encodeURIComponent(quote.q));
      const data = await res.json();
      const pairs = (data.pairs || []).slice(0, 14);
      quote.rows = pairs;
      if (!pairs.length) {
        body.innerHTML = `<tr><td colspan="4" class="dim">no prints. the pit is quiet. try a ticker or paste a CA.</td></tr>`;
        if (meta) meta.textContent = "0 prints · still signed in";
        return;
      }
      const tape = pairs.map((p) => {
        const ch = Number(p.priceChange?.h24 || 0);
        return `${(p.baseToken?.symbol || "?").toUpperCase()} ${money(p.priceUsd)} ${ch >= 0 ? "▲" : "▼"}${Math.abs(ch).toFixed(1)}%`;
      }).join("  ·  ");
      $("#ticker-tape").textContent = tape + "  ·  " + tape;
      body.innerHTML = pairs.map((p, i) => {
        const ch = Number(p.priceChange?.h24 || 0);
        const cls = ch >= 0 ? "up" : "dn";
        return `<tr data-i="${i}">
          <td>${escapeHtml(pairName(p))}<br><span class="dim">${escapeHtml(p.chainId || "")} · ${escapeHtml(p.dexId || "")}</span></td>
          <td>$${money(p.priceUsd)}</td>
          <td class="${cls}">${ch >= 0 ? "+" : ""}${ch.toFixed(2)}%</td>
          <td>${money(p.volume?.h24)}</td>
        </tr>`;
      }).join("");
      body.querySelectorAll("tr[data-i]").forEach((tr) => {
        tr.addEventListener("click", () => setFocus(pairs[+tr.dataset.i]));
        tr.addEventListener("dblclick", () => {
          const p = pairs[+tr.dataset.i];
          if (p.url) window.open(p.url, "_blank", "noopener");
        });
      });
      setFocus(pairs[0]);
      markWatches(pairs);
      settleSlips(pairs);
      if (meta) meta.textContent = `${pairs.length} prints · last ${new Date().toLocaleTimeString()} · click = pit · double-click = DexScreener`;
      pingPitWorker();
    } catch (err) {
      if (body) body.innerHTML = `<tr><td colspan="4" class="dim">line busy. open DexScreener directly — the pit still exists.</td></tr>`;
      if (meta) meta.textContent = "carrier lost · use DexScreener.exe";
    }
  }
  function markWatches(pairs) {
    const map = {};
    pairs.forEach((p) => { map[pairKey(p)] = p; });
    quote.watches.forEach((w) => {
      const p = map[w.key] || pairs.find((x) => (x.baseToken?.symbol || "") === w.sym.split("/")[0]);
      if (!p) return;
      const ch5 = Math.abs(Number(p.priceChange?.m5 || 0));
      w.chg = Number(p.priceChange?.h24 || 0);
      w.last = Number(p.priceUsd || 0);
      const pingId = w.key + ":" + Math.round(ch5);
      if (ch5 >= 8 && quote.lastPing[w.key] !== pingId) {
        quote.lastPing[w.key] = pingId;
        ping();
        toast(w.sym, `the pit moved ${ch5.toFixed(1)}% in 5 minutes`);
        const radio = CONTACTS.find((c) => c.id === "radio");
        if (radio) npcSay(radio, `${w.sym} just did a ${ch5.toFixed(1)}% 5-minute. the night heard it.`);
      }
    });
    renderPit();
    savePit();
  }
  function settleSlips(pairs) {
    quote.slips.forEach((s) => {
      const p = pairs.find((x) => pairKey(x) === s.key) || pairs.find((x) => pairName(x) === s.sym);
      if (p && p.priceUsd) s.last = Number(p.priceUsd);
    });
    savePit();
    renderPit();
  }
  function watchFocus() {
    const p = quote.focus;
    if (!p) { toast("pit", "select a print first"); return; }
    const key = pairKey(p);
    if (quote.watches.some((w) => w.key === key)) {
      quote.watches = quote.watches.filter((w) => w.key !== key);
      toast("pit", pairName(p) + " left the pit");
    } else {
      quote.watches.push({
        key, sym: pairName(p), addr: p.baseToken?.address || "",
        url: p.url || "", chg: Number(p.priceChange?.h24 || 0), last: Number(p.priceUsd || 0),
      });
      toast("pit", pairName(p) + " is being watched. they linger.");
    }
    renderPit();
    savePit();
  }
  function conviction(dir) {
    const p = quote.focus;
    if (!p || !p.priceUsd) { toast("pit", "no last print"); return; }
    const stake = 2;
    if (state.memory < stake) { toast("pit", "not enough memory for a slip"); return; }
    state.memory -= stake;
    quote.slips.push({
      key: pairKey(p), sym: pairName(p), dir, stake,
      entry: Number(p.priceUsd), last: Number(p.priceUsd), t: Date.now(),
    });
    toast("conviction", `${dir === "up" ? "▲" : "▼"} ${pairName(p)} · ${stake} memory`);
    renderLedger();
    renderPit();
    savePit();
    save();
  }
  function loadLicenseCfg() {
    license.mint = SIGNED_MINT || "";
    license.chain = SIGNED_CHAIN || "sol";
    const view = $("#lic-mint-view");
    if (view) view.textContent = license.mint
      ? ("Contract: " + license.mint)
      : "Contract: not issued yet";
  }
  function refreshTokenToolbars() {
    CONTACTS.filter((c) => c.token).forEach((c) => {
      const tools = document.querySelector("#chat-" + c.id + " .chat-tools");
      if (!tools) return;
      tools.innerHTML = `<button data-tok="why">Why?</button><button data-tok="chart">Chart</button><button data-tok="watch">Watch</button>${tokenActionBtn(c)}`;
      tools.querySelectorAll("[data-tok]").forEach((btn) => {
        btn.onclick = () => tokenTool(c.id, btn.dataset.tok);
      });
    });
  }
  function renderLicense() {
    const st = $("#lic-status");
    const foot = $("#lic-foot");
    const tray = $("#protray");
    if (license.ok && license.beta) {
      if (st) { st.textContent = "License status: BETA ACTIVATED"; st.classList.remove("off"); }
      if (tray) tray.textContent = "BETA";
      if (foot) foot.textContent = "No $SIGNED mint set. Connected wallet is a beta key. Quick Trade unlocked for testing.";
    } else if (license.ok) {
      if (st) { st.textContent = "License status: ACTIVATED"; st.classList.remove("off"); }
      if (tray) tray.textContent = "PRO";
      if (foot) foot.textContent = "Welcome back. Professional features unlocked.";
    } else {
      if (st) { st.textContent = "License status: NOT ACTIVATED"; st.classList.add("off"); }
      if (tray) tray.textContent = "STD";
      if (foot) foot.textContent = license.mint
        ? "Wallet has no $SIGNED. Why / Chart / Watch stay free. ⚡ BUY stays locked."
        : "Official mint not issued. Beta key only while SIGNED_DEV_BETA is on.";
    }
    refreshTokenToolbars();
  }
  async function solHasMint(owner, mint) {
    try {
      const res = await fetch("https://api.mainnet-beta.solana.com", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", id: 1, method: "getTokenAccountsByOwner",
          params: [owner, { mint }, { encoding: "jsonParsed" }],
        }),
      });
      const data = await res.json();
      const accs = (data.result && data.result.value) || [];
      return accs.some((a) => Number(a.account.data.parsed.info.tokenAmount.uiAmount || 0) > 0);
    } catch (e) { return false; }
  }
  async function ethHasToken(owner, token) {
    try {
      const data = "0x70a08231" + owner.replace("0x", "").toLowerCase().padStart(64, "0");
      const raw = await window.ethereum.request({
        method: "eth_call",
        params: [{ to: token, data }, "latest"],
      });
      return BigInt(raw) > 0n;
    } catch (e) { return false; }
  }
  async function refreshLicense() {
    loadLicenseCfg();
    if (!license.mint) {
      license.beta = !!SIGNED_DEV_BETA;
      license.ok = !!(SIGNED_DEV_BETA && quote.wallet && quote.wallet.address);
      renderLicense();
      return;
    }
    license.beta = false;
    if (!quote.wallet) { license.ok = false; renderLicense(); return; }
    if ((license.chain === "sol" || quote.wallet.chain === "sol") && !license.mint.startsWith("0x")) {
      license.ok = await solHasMint(quote.wallet.address, license.mint);
    } else {
      license.ok = await ethHasToken(quote.wallet.address, license.mint);
    }
    renderLicense();
  }
  function openWizard(c) {
    if (!c || !c.token) return;
    if (!isSolPair(c.pair || (c.hit && c.hit.p))) {
      const url = tokenDexUrl(c);
      if (url) window.open(url, "_blank", "noopener");
      return;
    }
    if (!license.ok) {
      toast("Professional", "⚡ BUY needs $SIGNED on this machine.");
      openApp("license");
      return;
    }
    license.target = c;
    const p = c.pair || (c.hit && c.hit.p);
    const unit = $("#wiz-unit");
    if (unit) unit.value = "SOL";
    const line = $("#wiz-pair");
    if (line) line.textContent = c.name + " · " + (p && p.chainId ? p.chainId : "") + " · this is not advice.";
    $("#wiz-out").textContent = "—";
    $("#wiz-imp").textContent = "—";
    openApp("wizard");
    refreshWizardQuote();
  }
  async function refreshWizardQuote() {
    const c = license.target;
    if (!c) return;
    const p = c.pair || (c.hit && c.hit.p);
    const amt = Number(($("#wiz-amt") && $("#wiz-amt").value) || 0);
    const unit = ($("#wiz-unit") && $("#wiz-unit").value) || "SOL";
    if (!p || !amt || amt <= 0) { $("#wiz-out").textContent = "—"; return; }
    $("#wiz-out").textContent = "quoting…";
    license.quote = null;
    license.requestId = "";
    const outMint = p.baseToken && p.baseToken.address;
    if (!(unit === "SOL" && isSolPair(p) && outMint)) {
      $("#wiz-out").textContent = "Solana only";
      $("#wiz-imp").textContent = "n/a";
      return;
    }
    if (!quote.wallet || quote.wallet.chain !== "sol") {
      $("#wiz-out").textContent = "connect Phantom first";
      return;
    }
    try {
      const lamports = String(Math.round(amt * 1e9));
      const q = await jupOrder(outMint, lamports, quote.wallet.address);
      if (q && q.outAmount) {
        license.quote = q;
        const dec = Number((p.baseToken && p.baseToken.decimals) || 6);
        const got = Number(q.outAmount) / Math.pow(10, dec);
        $("#wiz-out").textContent = money(got) + " " + c.sym;
        const imp = q.priceImpact != null ? Number(q.priceImpact) : Number(q.priceImpactPct || 0);
        $("#wiz-imp").textContent = (Math.abs(imp) > 1 ? imp : imp * 100).toFixed(2) + "%";
        return;
      }
      $("#wiz-out").textContent = (q && q.errorMessage) || "no route";
      $("#wiz-imp").textContent = "n/a";
    } catch (e) {
      $("#wiz-out").textContent = "quote failed";
      $("#wiz-imp").textContent = "n/a";
    }
  }
  function jupHeaders() {
    const h = { accept: "application/json" };
    if (JUPITER_API_KEY) h["x-api-key"] = JUPITER_API_KEY;
    return h;
  }
  async function jupOrder(outputMint, lamports, taker) {
    const params = new URLSearchParams({
      inputMint: WSOL,
      outputMint,
      amount: String(lamports),
      taker,
      slippageBps: "100",
    });
    if (JUPITER_API_KEY) {
      const r = await fetch("https://api.jup.ag/swap/v2/order?" + params, { headers: jupHeaders() });
      return r.json();
    }
    const r = await fetch("https://lite-api.jup.ag/swap/v1/quote?" + params.toString().replace("&taker=" + encodeURIComponent(taker), ""), { headers: jupHeaders() });
    return r.json();
  }
  async function jupBuildSwap(order, taker) {
    if (JUPITER_API_KEY && order && order.transaction) {
      return { transaction: order.transaction, requestId: order.requestId, mode: "v2" };
    }
    const r = await fetch("https://lite-api.jup.ag/swap/v1/swap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        quoteResponse: order,
        userPublicKey: taker,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
      }),
    });
    const data = await r.json();
    return { transaction: data.swapTransaction, requestId: "", mode: "v1" };
  }
  function b64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  async function wizardContinue() {
    const c = license.target;
    if (!c) return;
    if (!isSolPair(c.pair || (c.hit && c.hit.p))) {
      const url = tokenDexUrl(c);
      if (url) window.open(url, "_blank", "noopener");
      closeWin("wizard");
      return;
    }
    if (!quote.wallet || quote.wallet.chain !== "sol") {
      toast("wizard", "connect Phantom first");
      return;
    }
    if (!license.quote) await refreshWizardQuote();
    if (!license.quote) {
      toast("wizard", "no quote");
      return;
    }
    const provider = window.solana || window.phantom?.solana;
    const web3 = window.solanaWeb3;
    if (!provider || !web3) {
      toast("wizard", "wallet library missing");
      return;
    }
    try {
      const built = await jupBuildSwap(license.quote, quote.wallet.address);
      if (!built.transaction) throw new Error("no tx");
      const tx = web3.VersionedTransaction.deserialize(b64ToBytes(built.transaction));
      if (built.mode === "v2" && built.requestId && JUPITER_API_KEY) {
        const signed = await provider.signTransaction(tx);
        const ser = signed.serialize();
        let raw = "";
        for (let i = 0; i < ser.length; i++) raw += String.fromCharCode(ser[i]);
        await fetch("https://api.jup.ag/swap/v2/execute", {
          method: "POST",
          headers: Object.assign({ "content-type": "application/json" }, jupHeaders()),
          body: JSON.stringify({ signedTransaction: btoa(raw), requestId: built.requestId }),
        });
      } else {
        await provider.signAndSendTransaction(tx);
      }
      const when = clockLabel();
      pushSys(c.id, "you entered at " + when + ". the tape only looked.");
      toast("wizard", "sent · you entered at " + when);
      closeWin("wizard");
    } catch (e) {
      toast("wizard", "sign failed — opening the public pit.");
      const url = tokenDexUrl(c);
      if (url) window.open(url, "_blank", "noopener");
    }
  }

  async function connectEth() {
    const eth = window.ethereum;
    if (!eth) { toast("wallet", "no MetaMask in this machine"); return; }
    try {
      const acc = await eth.request({ method: "eth_requestAccounts" });
      quote.wallet = { chain: "eth", address: acc[0] };
      savePit();
      renderWallet();
      toast("wallet", "signed in · " + shortAddr(acc[0]));
      pingPitWorker();
      refreshLicense();
    } catch (e) {
      toast("wallet", "connection refused");
    }
  }
  async function connectSol() {
    const provider = window.solana || window.phantom?.solana;
    if (!provider) { toast("wallet", "no Phantom in this machine"); return; }
    try {
      const res = await provider.connect();
      const addr = res.publicKey ? res.publicKey.toString() : provider.publicKey.toString();
      quote.wallet = { chain: "sol", address: addr };
      savePit();
      renderWallet();
      toast("wallet", "signed in · " + shortAddr(addr));
      pingPitWorker();
      refreshLicense();
    } catch (e) {
      toast("wallet", "connection refused");
    }
  }
  function pingPitWorker() {
    const base = pitUrl();
    if (!base || !quote.focus) return;
    const name = quote.wallet
      ? shortAddr(quote.wallet.address)
      : (state.status || "you").slice(0, 24);
    fetch(base + "/here", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        pair: pairKey(quote.focus),
        id: sessionId(),
        name,
        status: state.status,
        wallet: quote.wallet && quote.wallet.address,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        quote.live = data;
        renderLive();
      })
      .catch(() => {
        quote.live = { count: 1, people: [{ name: "you (line busy)" }] };
        renderLive();
      });
  }
  function openDex() {
    const p = quote.focus;
    if (p && p.url) { window.open(p.url, "_blank", "noopener"); return; }
    const q = ($("#quote-q") && $("#quote-q").value.trim()) || quote.q || "solana";
    window.open("https://dexscreener.com/search?q=" + encodeURIComponent(q), "_blank", "noopener");
  }

  // ---------- screensaver ----------
  let idleAt = Date.now();
  function pokeIdle() {
    idleAt = Date.now();
    const s = $("#saver");
    if (s && !s.classList.contains("hidden")) {
      s.classList.add("hidden");
      pipesStop();
    }
  }
  function saverTick() {
    if (Date.now() - idleAt < 55000) return;
    const s = $("#saver");
    if (!s || !s.classList.contains("hidden")) return;
    s.classList.remove("hidden");
    pipesStart();
  }

  // ---------- Paint ----------
  const paint = {
    tool: "pencil",
    color: "#000000",
    size: 2,
    drawing: false,
    last: null,
    snapshot: null,
  };
  const PAINT_PALETTE = [
    "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
    "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff",
    "#c56b2a", "#f59a23", "#7ec8ff", "#e8c36a", "#3c3", "#222222",
  ];
  function paintInit() {
    const c = $("#paint-c");
    const colors = $("#paint-colors");
    if (!c || !colors) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    colors.innerHTML = `<i class="paint-swatch" id="paint-cur" style="background:${paint.color}"></i>` +
      PAINT_PALETTE.map((hex) => `<i data-col="${hex}" style="background:${hex}"></i>`).join("");
    colors.querySelectorAll("[data-col]").forEach((el) => {
      el.addEventListener("click", () => {
        paint.color = el.dataset.col;
        $("#paint-cur").style.background = paint.color;
        colors.querySelectorAll("[data-col]").forEach((x) => x.classList.toggle("on", x === el));
      });
    });
    $$("#paint-tools [data-ptool]").forEach((b) => {
      b.addEventListener("click", () => {
        paint.tool = b.dataset.ptool;
        $$("#paint-tools [data-ptool]").forEach((x) => x.classList.toggle("on", x === b));
      });
    });
    const pos = (e) => {
      const r = c.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) * (c.width / r.width),
        y: (e.clientY - r.top) * (c.height / r.height),
      };
    };
    c.addEventListener("mousedown", (e) => {
      const p = pos(e);
      paint.drawing = true;
      paint.last = p;
      paint.snapshot = ctx.getImageData(0, 0, c.width, c.height);
      if (paint.tool === "fill") {
        paintFill(ctx, Math.floor(p.x), Math.floor(p.y), paint.color);
        paint.drawing = false;
        return;
      }
      if (paint.tool === "pencil" || paint.tool === "eraser") {
        ctx.beginPath();
        ctx.strokeStyle = paint.tool === "eraser" ? "#ffffff" : paint.color;
        ctx.lineWidth = paint.tool === "eraser" ? 14 : paint.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 0.1, p.y);
        ctx.stroke();
      }
    });
    window.addEventListener("mousemove", (e) => {
      if (!paint.drawing) return;
      const p = pos(e);
      if (paint.tool === "pencil" || paint.tool === "eraser") {
        ctx.strokeStyle = paint.tool === "eraser" ? "#ffffff" : paint.color;
        ctx.lineWidth = paint.tool === "eraser" ? 14 : paint.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(paint.last.x, paint.last.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        paint.last = p;
      } else if (paint.tool === "line" || paint.tool === "rect") {
        ctx.putImageData(paint.snapshot, 0, 0);
        ctx.strokeStyle = paint.color;
        ctx.lineWidth = 2;
        if (paint.tool === "line") {
          ctx.beginPath();
          ctx.moveTo(paint.last.x, paint.last.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else {
          ctx.strokeRect(paint.last.x, paint.last.y, p.x - paint.last.x, p.y - paint.last.y);
        }
      }
    });
    window.addEventListener("mouseup", () => { paint.drawing = false; });
    const neu = $("#paint-new");
    if (neu) neu.onclick = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
    };
    const sav = $("#paint-save");
    if (sav) sav.onclick = () => {
      try {
        localStorage.setItem("signed-in-paint", c.toDataURL("image/png"));
        toast("paint", "saved to the machine. untitled forever.");
      } catch (e) {
        toast("paint", "too big for this machine's memory.");
      }
    };
    try {
      const data = localStorage.getItem("signed-in-paint");
      if (data) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = data;
      }
    } catch (e) {}
  }
  function hexToRgb(hex) {
    const n = hex.replace("#", "");
    const v = parseInt(n.length === 3 ? n.split("").map((ch) => ch + ch).join("") : n, 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255, 255];
  }
  function paintFill(ctx, x, y, hex) {
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const i0 = (y * w + x) * 4;
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const tr = d[i0], tg = d[i0 + 1], tb = d[i0 + 2];
    const [fr, fg, fb] = hexToRgb(hex);
    if (tr === fr && tg === fg && tb === fb) return;
    const stack = [[x, y]];
    const seen = new Uint8Array(w * h);
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
      const idx = cy * w + cx;
      if (seen[idx]) continue;
      const p = idx * 4;
      if (Math.abs(d[p] - tr) > 12 || Math.abs(d[p + 1] - tg) > 12 || Math.abs(d[p + 2] - tb) > 12) continue;
      seen[idx] = 1;
      d[p] = fr; d[p + 1] = fg; d[p + 2] = fb; d[p + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(img, 0, 0);
  }
  function paintFit() {
    const c = $("#paint-c");
    const stage = $("#paint-stage");
    if (!c || !stage) return;
    const ctx = c.getContext("2d");
    const prev = document.createElement("canvas");
    prev.width = c.width;
    prev.height = c.height;
    prev.getContext("2d").drawImage(c, 0, 0);
    const w = Math.max(200, stage.clientWidth - 8);
    const h = Math.max(160, stage.clientHeight - 8);
    c.width = w;
    c.height = h;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(prev, 0, 0);
  }

  function bindChrome() {
    $$(".window").forEach(makeDraggable);
    $$("[data-open]").forEach((el) => el.addEventListener("dblclick", () => openApp(el.dataset.open)));
    $$("[data-open]").forEach((el) => el.addEventListener("click", () => {
      $$(".desk-icon").forEach((i) => i.classList.remove("selected"));
      el.classList.add("selected");
    }));
    $$("[data-act]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const win = btn.closest(".window");
        if (btn.dataset.act === "min") minimize(win.id);
        if (btn.dataset.act === "close") closeWin(win.id);
      });
    });
    $("#start-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      $("#start-menu").classList.toggle("show");
      $("#start-btn").classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#start-menu") && !e.target.closest("#start-btn")) {
        $("#start-menu").classList.remove("show");
        $("#start-btn").classList.remove("open");
      }
      $("#ctx").style.display = "none";
    });
    $("#desktop").addEventListener("contextmenu", (e) => {
      if (e.target.closest(".window")) return;
      e.preventDefault();
      const ctx = $("#ctx");
      ctx.style.display = "block";
      ctx.style.left = e.clientX + "px";
      ctx.style.top = e.clientY + "px";
    });
    $("#status-edit").addEventListener("change", (e) => {
      state.status = e.target.value;
      renderMessenger();
      save();
    });
    $("#vol").addEventListener("input", (e) => {
      state.volume = +e.target.value;
      if (master) master.gain.value = state.volume;
    });
    $("#wa-prev").onclick = () => playTrack((state.trackIndex + TRACKS.length - 1) % TRACKS.length);
    $("#wa-next").onclick = () => playTrack((state.trackIndex + 1) % TRACKS.length);
    $("#wa-play").onclick = () => {
      audio().resume();
      if (state.playing) stopSong();
      else playTrack(state.trackIndex);
      renderWinamp();
    };
    $("#reset").onclick = () => {
      if (confirm("sign out of the night?")) {
        localStorage.removeItem("signed-in");
        location.reload();
      }
    };
    const face = $("#mine-face");
    if (face) face.onclick = () => mineReset();
    const soliNew = $("#soli-new");
    if (soliNew) soliNew.onclick = () => soliDeal();
    const soliMode = $("#soli-drawmode");
    if (soliMode) soliMode.onclick = () => {
      soli.drawN = soli.drawN === 1 ? 3 : 1;
      soliMode.textContent = "Deal: " + soli.drawN + " card" + (soli.drawN > 1 ? "s" : "");
    };
    const qq = $("#quote-q");
    try {
      const savedQ = localStorage.getItem("signed-in-ticker");
      if (savedQ && qq) qq.value = savedQ;
    } catch (e) {}
    const doQuote = () => quoteSearch(($("#quote-q") && $("#quote-q").value) || quote.q);
    if ($("#quote-search")) $("#quote-search").onclick = doQuote;
    if ($("#quote-go")) $("#quote-go").onclick = doQuote;
    if ($("#quote-dex")) $("#quote-dex").onclick = openDex;
    if ($("#quote-eth")) $("#quote-eth").onclick = connectEth;
    if ($("#quote-sol")) $("#quote-sol").onclick = connectSol;
    if ($("#pit-watch")) $("#pit-watch").onclick = watchFocus;
    if ($("#pit-up")) $("#pit-up").onclick = () => conviction("up");
    if ($("#pit-dn")) $("#pit-dn").onclick = () => conviction("dn");
    if ($("#lic-check")) $("#lic-check").onclick = () => refreshLicense();
    if ($("#wiz-cancel")) $("#wiz-cancel").onclick = () => closeWin("wizard");
    if ($("#wiz-quote")) $("#wiz-quote").onclick = () => refreshWizardQuote();
    if ($("#wiz-go")) $("#wiz-go").onclick = () => wizardContinue();
    if ($("#wiz-amt")) $("#wiz-amt").addEventListener("change", refreshWizardQuote);
    const pitField = $("#pit-url");
    if (pitField) {
      pitField.value = pitUrl();
      pitField.addEventListener("change", () => {
        try { localStorage.setItem("signed-in-pit-url", pitField.value.trim()); } catch (e) {}
        quote.live = null;
        pingPitWorker();
        renderLive();
      });
    }
    if (qq) qq.addEventListener("keydown", (e) => { if (e.key === "Enter") doQuote(); });
    const sticky = $("#sticky-note");
    if (sticky) {
      try {
        const saved = localStorage.getItem("signed-in-sticky");
        if (saved) sticky.value = saved;
      } catch (e) {}
      sticky.addEventListener("input", () => {
        try { localStorage.setItem("signed-in-sticky", sticky.value); } catch (e) {}
      });
    }
    ["mousemove", "keydown", "mousedown", "click"].forEach((ev) =>
      document.addEventListener(ev, pokeIdle, { passive: true })
    );
    const saver = $("#saver");
    if (saver) saver.addEventListener("click", pokeIdle);
  }

  function boot() {
    load();
    loadPit();
    loadLicenseCfg();
    bindChrome();
    renderWallet();
    renderPit();
    renderLicense();
    refreshLicense();
    renderMessenger();
    renderWinamp();
    renderLedger();
    mineReset();
    soliDeal();
    paintInit();
    drawVis();
    requestAnimationFrame(tick);
    setTimeout(() => {
      $("#boot").classList.add("hide");
      state.bootDone = true;
      openApp("winamp");
      openApp("msn");
      setTimeout(() => {
        $("#hintbar").classList.add("show");
        setTimeout(() => $("#hintbar").classList.remove("show"), 7000);
      }, 400);
      setTimeout(() => {
        const desk = CONTACTS.find((c) => c.id === "tape");
        if (desk) npcSay(desk, "desk is open. I delete noise for a living.");
        scanTape();
      }, 2200);
      if (state.upgrades.goldSkin) {
        document.getElementById("winamp").style.boxShadow = "4px 6px 0 rgba(0,0,0,0.5), 0 0 24px rgba(232,195,106,0.45)";
      }
    }, 3600);
  }

  window.SignedIn = { openApp, minimize, closeWin, playTrack, state };
  document.addEventListener("DOMContentLoaded", boot);
})();
