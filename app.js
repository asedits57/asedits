const profileConfig = {
  username: "asedits57",
  displayName: "ABISHEK.M",
  brandName: "AS_Edits",
  profileUrl: "https://github.com/asedits57",
};

const featuredProjectNames = [
  "final project",
  "lingua mentor",
  "mec",
  "foody campus connect",
  "rutex",
  "liquid glass ai",
  "team project",
];

const statElements = {
  repos: document.getElementById("stat-repos"),
  followers: document.getElementById("stat-followers"),
  following: document.getElementById("stat-following"),
};

const terminalFeed = document.getElementById("terminal-feed");
const stackTerminalFeed = document.getElementById("stack-terminal-feed");
const contactTerminalFeed = document.getElementById("contact-terminal-feed");
const projectsGrid = document.getElementById("projects-grid");
const particleField = document.getElementById("particle-field");
const heroSection = document.querySelector(".hero");
const heroStage = document.querySelector(".hero-stage");
const typedCodeFeeds = [stackTerminalFeed, contactTerminalFeed].filter(Boolean);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
let terminalAnimationToken = 0;
const typedCodeAnimationTokens = new WeakMap();
const numberFormatter = new Intl.NumberFormat("en-US");

document.querySelectorAll("#current-year, .js-current-year").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

setupRevealObserver();
setupTeamSpotlightSlider();
setupImageLightbox();
setupTypedCodeTerminals();
scheduleNonCriticalStartup();

if (shouldLoadGitHub()) {
  loadGitHubShowcase();
}

function scheduleNonCriticalStartup() {
  const run = () => {
    setupInteractiveScene();
    setupCustomCursor();
  };

  const defer = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 700 });
      return;
    }

    window.setTimeout(run, 180);
  };

  if ("requestAnimationFrame" in window) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(defer);
    });
    return;
  }

  defer();
}

function setupRevealObserver() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupTeamSpotlightSlider() {
  const marquee = document.querySelector(".spotlight-strip__marquee");
  const track = document.querySelector(".js-team-slider-track");
  const row = track?.querySelector(".js-team-slider-row");

  if (!(marquee instanceof HTMLElement) || !(track instanceof HTMLElement) || !(row instanceof HTMLElement)) {
    return;
  }

  if (!track.querySelector(".spotlight-strip__grid--clone")) {
    const clone = row.cloneNode(true);
    clone.classList.add("spotlight-strip__grid--clone");
    clone.setAttribute("aria-hidden", "true");

    clone.querySelectorAll(".js-image-lightbox").forEach((card) => {
      card.removeAttribute("tabindex");
      card.removeAttribute("role");
      card.removeAttribute("aria-haspopup");
    });

    track.append(clone);
  }

  if (prefersReducedMotion) {
    return;
  }

  let loopWidth = 0;
  let currentOffset = 0;
  let dragPointerId = null;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let isDragging = false;
  let suppressClick = false;
  let isPointerOver = false;
  let isFocusWithin = false;
  let lastFrameTime = 0;
  const autoScrollSpeed = prefersReducedMotion ? 0 : 32;

  const normalizeOffset = (value) => {
    if (!loopWidth) {
      return 0;
    }

    let nextValue = value % loopWidth;

    if (nextValue < 0) {
      nextValue += loopWidth;
    }

    return nextValue;
  };

  const renderTrack = () => {
    currentOffset = normalizeOffset(currentOffset);
    track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
  };

  const syncLoopWidth = () => {
    const trackStyles = window.getComputedStyle(track);
    const trackGap = Number.parseFloat(trackStyles.gap || trackStyles.columnGap || "0") || 0;
    loopWidth = row.getBoundingClientRect().width + trackGap;
    renderTrack();
  };

  const animateSlider = (timestamp) => {
    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    const deltaSeconds = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    if (dragPointerId === null && !isDragging && !isPointerOver && !isFocusWithin && autoScrollSpeed > 0) {
      currentOffset += autoScrollSpeed * deltaSeconds;
      renderTrack();
    }

    window.requestAnimationFrame(animateSlider);
  };

  const handleDragEnd = (event) => {
    if (dragPointerId === null || event.pointerId !== dragPointerId) {
      return;
    }

    if (marquee.hasPointerCapture(event.pointerId)) {
      marquee.releasePointerCapture(event.pointerId);
    }

    marquee.classList.remove("is-dragging");
    dragPointerId = null;
    
    if (isDragging) {
      window.setTimeout(() => {
        suppressClick = false;
        isDragging = false;
      }, 0);
    } else {
      isDragging = false;
    }
  };

  syncLoopWidth();
  renderTrack();

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(() => {
      syncLoopWidth();
    });

    resizeObserver.observe(row);
    resizeObserver.observe(marquee);
  }

  marquee.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch" && event.button !== 0) {
      return;
    }

    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartOffset = currentOffset;
    isDragging = false;
    suppressClick = false;
  });

  marquee.addEventListener("pointermove", (event) => {
    if (dragPointerId === null || event.pointerId !== dragPointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartX;

    if (Math.abs(deltaX) > 6) {
      if (!isDragging) {
        marquee.classList.add("is-dragging");

        if (!marquee.hasPointerCapture(event.pointerId)) {
          marquee.setPointerCapture(event.pointerId);
        }
      }

      isDragging = true;
      suppressClick = true;
      event.preventDefault();
    }

    if (!isDragging) {
      return;
    }

    currentOffset = dragStartOffset - deltaX;
    renderTrack();
  });

  marquee.addEventListener("pointerup", handleDragEnd);
  marquee.addEventListener("pointercancel", handleDragEnd);

  marquee.addEventListener("pointerenter", () => {
    isPointerOver = true;
  });

  marquee.addEventListener("pointerleave", () => {
    isPointerOver = false;
  });

  marquee.addEventListener("focusin", () => {
    isFocusWithin = true;
  });

  marquee.addEventListener("focusout", (event) => {
    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !marquee.contains(nextTarget)) {
      isFocusWithin = false;
    }
  });

  marquee.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true
  );

  marquee.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  marquee.addEventListener(
    "wheel",
    (event) => {
      const dominantDelta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      if (!dominantDelta) {
        return;
      }

      const deltaMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? marquee.clientWidth : 1;

      event.preventDefault();
      currentOffset += dominantDelta * deltaMultiplier;
      renderTrack();
    },
    { passive: false }
  );

  window.addEventListener("load", syncLoopWidth, { once: true });
  window.requestAnimationFrame(animateSlider);
}

async function loadGitHubShowcase() {
  const profileEndpoint = `https://api.github.com/users/${profileConfig.username}`;
  const repoEndpoint = `https://api.github.com/users/${profileConfig.username}/repos?sort=updated&per_page=100`;

  try {
    const [profileResponse, repoResponse] = await Promise.all([
      fetch(profileEndpoint, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }),
      fetch(repoEndpoint, {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }),
    ]);

    if (!profileResponse.ok || !repoResponse.ok) {
      throw new Error("GitHub API request failed.");
    }

    const profile = await profileResponse.json();
    const repos = await repoResponse.json();
    const featuredRepos = selectFeaturedRepos(repos);

    hydrateStats(profile);
    renderTerminal(profile, repos);
    renderProjects(featuredRepos);
  } catch {
    setStatsUnavailable();
    renderTerminalFallback();
    renderProjectFallback();
  }
}

function selectFeaturedRepos(repos) {
  const normalizedRepos = repos.filter((repo) => !repo.fork && !repo.archived);
  const featuredByName = featuredProjectNames
    .map((projectName) =>
      normalizedRepos.find(
        (repo) => normalizeProjectName(repo.name) === normalizeProjectName(projectName)
      )
    )
    .filter(Boolean);

  if (featuredByName.length) {
    return featuredByName;
  }

  return normalizedRepos
    .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at))
    .slice(0, 6);
}

function hydrateStats(profile) {
  renderStatValue(statElements.repos, profile.public_repos, "Launching");
  renderStatValue(statElements.followers, profile.followers, "Growing");
  renderStatValue(statElements.following, profile.following, "Curated");
}

function setStatsUnavailable() {
  setStatText(statElements.repos, "Live");
  setStatText(statElements.followers, "Connected");
  setStatText(statElements.following, "Open");
}

function renderStatValue(element, endValue, zeroLabel) {
  if (!element) {
    return;
  }

  const safeValue = Number.isFinite(endValue) ? endValue : 0;

  if (safeValue > 0) {
    animateValue(element, safeValue);
    return;
  }

  setStatText(element, zeroLabel);
}

function setStatText(element, value) {
  if (!element) {
    return;
  }

  element.textContent = value;
}

function animateValue(element, endValue) {
  if (!element) {
    return;
  }

  const safeValue = Number.isFinite(endValue) ? endValue : 0;

  if (!window.requestAnimationFrame) {
    element.textContent = numberFormatter.format(safeValue);
    return;
  }

  const duration = 900;
  const startTime = performance.now();

  function frame(timestamp) {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(safeValue * eased);

    element.textContent = numberFormatter.format(currentValue);

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function renderTerminal(profile, repos) {
  if (!terminalFeed) {
    return;
  }

  const topLanguages = getTopLanguages(repos);
  const latestRepo = repos.find((repo) => !repo.fork);
  const latestRepoLanguages = latestRepo
    ? [latestRepo.language, ...(latestRepo.topics || [])].filter(Boolean).slice(0, 3)
    : [];
  const profileName = profile.name || profileConfig.displayName;
  const publicRepoCount = profile.public_repos || repos.filter((repo) => !repo.fork).length;
  const lines = [
    "$ whoami",
    `> ${profileName} (${profileConfig.username})`,
    "$ sync",
    "> live GitHub data connected",
    "$ focus",
    `> ${topLanguages.length ? topLanguages.join(" / ") : "fullstack shipping"}`,
    "$ latest",
    latestRepo
      ? `> ${latestRepo.name} updated ${formatDate(latestRepo.pushed_at)}`
      : "> next public release will appear here",
    "$ repos",
    `> ${publicRepoCount} public repositories ready to explore`,
    "$ stack",
    latestRepoLanguages.length
      ? `> ${latestRepoLanguages.join(" / ")} shaped the latest public build`
      : "> latest stack details will appear with the next update",
    "$ route",
    `> profile link stays live at ${profile.html_url || profileConfig.profileUrl}`,
    "$ pulse",
    latestRepo
      ? `> last public push landed ${formatRelativeDate(latestRepo.pushed_at)}`
      : "> next public push will light up here",
    "$ mode",
    "> portfolio mirrors GitHub activity in real time",
    "$ access",
    "> visitors can jump from this page straight into the GitHub profile",
  ];

  typeTerminal(lines);
}

function renderTerminalFallback() {
  if (!terminalFeed) {
    return;
  }

  const lines = [
    "$ whoami",
    `> ${profileConfig.displayName} (${profileConfig.username})`,
    "$ sync",
    "> live GitHub sync is taking a quick pause in this browser session",
    "$ route",
    "> portfolio still guides visitors straight to the GitHub profile",
    "$ status",
    "> direct profile access stays ready while live sync reconnects",
  ];

  typeTerminal(lines);
}

function renderProjects(repos) {
  if (!projectsGrid) {
    return;
  }

  if (!repos.length) {
    renderProjectFallback();
    return;
  }

  const limit = Number.parseInt(projectsGrid.dataset.repoLimit || "6", 10);
  const visibleRepos = Number.isFinite(limit) ? repos.slice(0, limit) : repos;

  projectsGrid.innerHTML = visibleRepos.map((repo) => createProjectCard(repo)).join("");
  mountProjectCards();
}

function renderProjectFallback() {
  if (!projectsGrid) {
    return;
  }

  projectsGrid.innerHTML = [
    `<article class="project-card project-card--mounted">`,
    `<div class="repo-preview" aria-hidden="true">`,
    `<span class="repo-preview__label">GitHub</span>`,
    `<span class="repo-preview__mesh"></span>`,
    `<span class="repo-preview__glow"></span>`,
    `<span class="repo-preview__pulse"></span>`,
    `<span class="repo-preview__signal"></span>`,
    `</div>`,
    `<div class="project-head">`,
    `<div class="repo-name-wrap"><div class="repo-name">Live GitHub sync</div><span class="repo-status">Profile link</span></div>`,
    `<span class="repo-status">DIRECT</span>`,
    `</div>`,
    `<p class="repo-description">`,
    `This portfolio is wired to fetch public repositories from @${escapeHtml(profileConfig.username)}. `,
    `Visitors can still jump straight to the GitHub profile whenever live repository sync is temporarily unavailable.`,
    `</p>`,
    `<div class="repo-meta"><span class="repo-pill">GitHub API</span><span class="repo-pill">Auto-updating</span></div>`,
    `<div class="repo-links">`,
    `<a href="${profileConfig.profileUrl}" target="_blank" rel="noopener noreferrer">Open GitHub Profile</a>`,
    `</div>`,
    `</article>`,
  ].join("");
  mountProjectCards();
}

function createProjectCard(repo) {
  const repoColor = getRepoColor(repo);
  const safeName = escapeHtml(repo.name);
  const safeDescription = escapeHtml(
    repo.description || "Code, experiments, and product thinking shipped through GitHub."
  );
  const safeLanguage = escapeHtml(repo.language || "Multi-stack");
  const safeRepoUrl = escapeAttribute(repo.html_url);
  const safeHomepage = normalizeUrl(repo.homepage);
  const safeUpdatedLabel = escapeHtml(formatRelativeDate(repo.pushed_at));
  const previewLabel = escapeHtml(repo.language || "Showcase");

  const repoMeta = [
    `<span class="repo-pill">${safeLanguage}</span>`,
    `<span class="repo-pill">${formatRepoSignal(repo.stargazers_count, "stars", "Fresh repo")}</span>`,
    `<span class="repo-pill">${formatRepoSignal(repo.forks_count, "forks", "Original repo")}</span>`,
  ].join("");

  const demoLink = safeHomepage
    ? `<a href="${safeHomepage}" target="_blank" rel="noopener noreferrer">Live Demo</a>`
    : "";

  return [
    `<article class="project-card" style="--repo-color:${repoColor};">`,
    `<div class="repo-preview" aria-hidden="true">`,
    `<span class="repo-preview__label">${previewLabel}</span>`,
    `<span class="repo-preview__mesh"></span>`,
    `<span class="repo-preview__glow"></span>`,
    `<span class="repo-preview__pulse"></span>`,
    `<span class="repo-preview__signal"></span>`,
    `</div>`,
    `<div class="project-head">`,
    `<div class="repo-name-wrap"><div class="repo-name">${safeName}</div><span class="repo-status">${previewLabel}</span></div>`,
    `<span class="repo-status">LIVE</span>`,
    `</div>`,
    `<p class="repo-description">${safeDescription}</p>`,
    `<div class="repo-meta">${repoMeta}</div>`,
    `<div class="repo-footer">`,
    `<span>Updated ${safeUpdatedLabel}</span>`,
    `<a href="${safeRepoUrl}" target="_blank" rel="noopener noreferrer">View Repo</a>`,
    `</div>`,
    demoLink ? `<div class="repo-links">${demoLink}</div>` : "",
    `</article>`,
  ].join("");
}

function formatRepoSignal(value, suffix, zeroLabel) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue > 0 ? `${numberFormatter.format(safeValue)} ${suffix}` : zeroLabel;
}

function getTopLanguages(repos) {
  const counts = repos.reduce((map, repo) => {
    if (!repo.language) {
      return map;
    }

    map.set(repo.language, (map.get(repo.language) || 0) + 1);
    return map;
  }, new Map());

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([language]) => language);
}

function normalizeProjectName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

function formatRelativeDate(dateString) {
  const deltaMs = new Date(dateString).getTime() - Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const deltaDays = Math.round(deltaMs / dayMs);
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (Math.abs(deltaDays) < 30) {
    return formatter.format(deltaDays, "day");
  }

  const deltaMonths = Math.round(deltaDays / 30);

  if (Math.abs(deltaMonths) < 12) {
    return formatter.format(deltaMonths, "month");
  }

  const deltaYears = Math.round(deltaMonths / 12);
  return formatter.format(deltaYears, "year");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#96;");
}

function normalizeUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return "";
  }

  return escapeAttribute(value);
}

function getRepoColor(repo) {
  const seed = repo.language || repo.name || "repo";
  const palette = [
    "rgba(255, 122, 89, 0.34)",
    "rgba(77, 214, 198, 0.34)",
    "rgba(255, 200, 110, 0.32)",
    "rgba(112, 160, 255, 0.32)",
    "rgba(255, 96, 170, 0.3)",
  ];
  const index = [...seed].reduce((total, character) => total + character.charCodeAt(0), 0) % palette.length;

  return palette[index];
}

async function typeTerminal(lines) {
  if (!terminalFeed) {
    return;
  }

  const token = ++terminalAnimationToken;

  if (prefersReducedMotion) {
    terminalFeed.textContent = lines.join("\n");
    return;
  }

  terminalFeed.textContent = "";

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
      if (token !== terminalAnimationToken) {
        return;
      }

      terminalFeed.textContent += line[charIndex];
      await wait(14);
    }

    if (lineIndex < lines.length - 1) {
      terminalFeed.textContent += "\n";
      await wait(90);
    }
  }
}

function setupTypedCodeTerminals() {
  if (!typedCodeFeeds.length) {
    return;
  }

  typedCodeFeeds.forEach((feed, index) => {
    setupTypedCodeTerminal(feed, 260 + index * 120);
  });
}

function setupTypedCodeTerminal(feed, initialDelay = 260) {
  if (!feed) {
    return;
  }

  const lines = feed.textContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (prefersReducedMotion) {
    feed.textContent = lines.join("\n");
    feed.classList.remove("is-typing");
    return;
  }

  feed.textContent = "";
  feed.classList.add("is-typing");

  window.setTimeout(() => {
    typeCodeTerminal(feed, lines);
  }, initialDelay);
}

async function typeCodeTerminal(feed, lines) {
  if (!feed) {
    return;
  }

  const token = (typedCodeAnimationTokens.get(feed) || 0) + 1;
  typedCodeAnimationTokens.set(feed, token);
  feed.textContent = "";
  feed.classList.add("is-typing");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
      if (token !== typedCodeAnimationTokens.get(feed)) {
        return;
      }

      feed.textContent += line[charIndex];
      await wait(12);
    }

    if (lineIndex < lines.length - 1) {
      feed.textContent += "\n";
      await wait(90);
    }
  }

  feed.classList.remove("is-typing");
}

function mountProjectCards() {
  if (!projectsGrid) {
    return;
  }

  const cards = [...projectsGrid.querySelectorAll(".project-card")];

  if (prefersReducedMotion) {
    cards.forEach((card) => card.classList.add("project-card--mounted"));
    return;
  }

  cards.forEach((card, index) => {
    window.setTimeout(() => {
      card.classList.add("project-card--mounted");
    }, 120 * index);
  });
}

function setupInteractiveScene() {
  if (prefersReducedMotion) {
    return;
  }

  createParticles(28);
  setupHeroParallax();
}

function createParticles(count) {
  if (!particleField) {
    return;
  }

  const markup = Array.from({ length: count }, (_, index) => {
    const x = `${Math.round(Math.random() * 100)}%`;
    const y = `${Math.round(Math.random() * 100)}%`;
    const size = `${4 + Math.round(Math.random() * 8)}px`;
    const duration = `${10 + Math.random() * 10}s`;
    const delay = `${Math.random() * -18}s`;
    const driftX = `${-30 + Math.round(Math.random() * 60)}px`;
    const travel = `${90 + Math.round(Math.random() * 180)}px`;

    return [
      `<span class="particle" style="--x:${x};--y:${y};--size:${size};--duration:${duration};--delay:${delay};--drift-x:${driftX};--travel:${travel};"></span>`,
    ].join("");
  }).join("");

  particleField.innerHTML = markup;
}

function setupHeroParallax() {
  if (!heroSection || !heroStage) {
    return;
  }

  heroSection.addEventListener("pointermove", (event) => {
    const bounds = heroSection.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroStage.style.setProperty("--parallax-x", `${offsetX * 20}px`);
    heroStage.style.setProperty("--parallax-y", `${offsetY * 20}px`);
  });

  heroSection.addEventListener("pointerleave", () => {
    heroStage.style.setProperty("--parallax-x", "0px");
    heroStage.style.setProperty("--parallax-y", "0px");
  });
}

function setupCustomCursor() {
  if (prefersReducedMotion || !supportsFinePointer || !document.body) {
    return;
  }

  const ring = document.createElement("div");
  const dot = document.createElement("div");
  let targetX = -100;
  let targetY = -100;
  let auraX = -100;
  let auraY = -100;
  let movementTimeoutId;

  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  document.body.append(ring, dot);
  document.body.classList.add("cursor-active");

  const animateAura = () => {
    auraX += (targetX - auraX) * 0.3;
    auraY += (targetY - auraY) * 0.3;
    dot.style.transform = `translate(${auraX}px, ${auraY}px)`;
    window.requestAnimationFrame(animateAura);
  };

  const setPosition = (event) => {
    const { clientX, clientY } = event;

    targetX = clientX;
    targetY = clientY;
    ring.style.transform = `translate(${clientX}px, ${clientY}px)`;
    ring.classList.add("is-moving");
    dot.classList.add("is-moving");
    window.clearTimeout(movementTimeoutId);
    movementTimeoutId = window.setTimeout(() => {
      ring.classList.remove("is-moving");
      dot.classList.remove("is-moving");
    }, 70);
  };

  animateAura();
  document.addEventListener("pointermove", setPosition, { passive: true });

  document.addEventListener("pointerdown", () => {
    ring.classList.add("is-pressed");
    dot.classList.add("is-pressed");
  });

  document.addEventListener("pointerup", () => {
    ring.classList.remove("is-pressed");
    dot.classList.remove("is-pressed");
  });

  document.addEventListener("pointerleave", () => {
    ring.classList.remove("is-moving");
    dot.classList.remove("is-moving");
  });

  document.addEventListener("pointerover", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const interactiveTarget = target.closest(
      "a, button, .hero-photo-card, .profile-spotlight, .project-card, .impact-card, .stack-card, .info-card, .process-card, .showcase-panel, .portal-card, .contact-card, .image-lightbox, .image-lightbox__dialog, .image-lightbox__close, .image-lightbox__frame, .image-lightbox__copy"
    );
    const profileCardTarget = target.closest(".profile-spotlight");

    ring.classList.toggle("is-hover", Boolean(interactiveTarget));
    dot.classList.toggle("is-hover", Boolean(interactiveTarget));
    ring.classList.toggle("is-profile-hover", Boolean(profileCardTarget));
    dot.classList.toggle("is-profile-hover", Boolean(profileCardTarget));
  });
}

function setupImageLightbox() {
  if (!document.body) {
    return;
  }

  if (document.querySelector(".image-lightbox")) {
    return;
  }

  const triggers = [...document.querySelectorAll(".js-image-lightbox")];

  if (!triggers.length) {
    return;
  }

  const lightbox = document.createElement("div");
  const dialog = document.createElement("div");
  const closeButton = document.createElement("button");
  const frame = document.createElement("div");
  const image = document.createElement("img");
  const copy = document.createElement("div");
  const eyebrow = document.createElement("span");
  const title = document.createElement("h3");
  const role = document.createElement("p");
  const description = document.createElement("p");
  const titleId = "image-lightbox-title";
  const descriptionId = "image-lightbox-description";
  let lastTrigger = null;
  let lightboxTypingToken = 0;
  const waitForLightboxLayout = () =>
    new Promise((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(resolve);
      });
    });

  lightbox.className = "image-lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  dialog.className = "image-lightbox__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", titleId);
  dialog.setAttribute("aria-describedby", descriptionId);
  closeButton.className = "image-lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close portrait");
  closeButton.textContent = "x";
  frame.className = "image-lightbox__frame";
  image.className = "image-lightbox__image";
  image.alt = "";
  copy.className = "image-lightbox__copy";
  eyebrow.className = "image-lightbox__eyebrow";
  title.className = "image-lightbox__title";
  title.id = titleId;
  role.className = "image-lightbox__role";
  description.className = "image-lightbox__description";
  description.id = descriptionId;

  frame.append(image);
  copy.append(title, eyebrow, role, description);
  dialog.append(closeButton, frame, copy);
  lightbox.append(dialog);
  document.body.append(lightbox);

  const closeLightbox = () => {
    lightboxTypingToken += 1;
    description.classList.remove("is-typing");
    title.classList.remove("image-lightbox__title--compact");
    description.style.removeProperty("font-size");
    description.style.removeProperty("line-height");
    description.style.removeProperty("visibility");
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lastTrigger instanceof HTMLElement) {
      lastTrigger.focus();
    }
  };

  const openLightbox = (trigger) => {
    if (!(trigger instanceof HTMLElement)) {
      return;
    }

    const source = trigger.dataset.lightboxSrc;
    const alt = trigger.dataset.lightboxAlt || "Expanded portrait";
    const profileLabel = trigger.dataset.profileLabel || "";
    const profileName = trigger.dataset.profileName || "Profile";
    const profileRole = trigger.dataset.profileRole || "Project Contributor";
    const profileBio =
      trigger.dataset.profileBio ||
      `${profileName} contributes to the project with consistency, collaboration, and practical problem solving.`;

    if (!source) {
      return;
    }

    lastTrigger = trigger;
    lightboxTypingToken += 1;
    image.src = source;
    image.alt = alt;
    eyebrow.textContent = profileLabel;
    eyebrow.hidden = !profileLabel;
    title.textContent = profileName;
    title.classList.toggle("image-lightbox__title--compact", profileName.length > 14);
    role.textContent = profileRole;
    description.textContent = "";
    description.classList.remove("is-typing");
    description.style.removeProperty("font-size");
    description.style.removeProperty("line-height");
    description.style.removeProperty("visibility");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();

    void typeLightboxCopy({
      eyebrowText: profileLabel,
      titleText: profileName,
      roleText: profileRole,
      descriptionText: profileBio,
    });
  };

  document.body.__openProfileLightbox = openLightbox;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openLightbox(trigger);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  image.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  async function typeLightboxCopy({ eyebrowText, titleText, roleText, descriptionText }) {
    const token = ++lightboxTypingToken;

    if (prefersReducedMotion) {
      if (!(await fitLightboxDescription(descriptionText, token))) {
        return;
      }

      eyebrow.textContent = eyebrowText;
      eyebrow.hidden = !eyebrowText;
      title.textContent = titleText;
      role.textContent = roleText;
      description.textContent = descriptionText;
      description.classList.remove("is-typing");
      return;
    }

    eyebrow.textContent = eyebrowText;
    eyebrow.hidden = !eyebrowText;
    title.textContent = titleText;
    role.textContent = roleText;

    if (!(description instanceof HTMLElement)) {
      return;
    }

    if (!(await fitLightboxDescription(descriptionText, token))) {
      return;
    }

    description.textContent = "";
    description.classList.add("is-typing");

    for (let charIndex = 0; charIndex < descriptionText.length; charIndex += 1) {
      if (token !== lightboxTypingToken || !lightbox.classList.contains("is-open")) {
        return;
      }

      description.textContent += descriptionText[charIndex];
      await wait(9);
    }

    description.classList.remove("is-typing");
  }

  async function fitLightboxDescription(descriptionText, token) {
    if (!(description instanceof HTMLElement)) {
      return false;
    }

    description.style.removeProperty("font-size");
    description.style.removeProperty("line-height");
    description.style.removeProperty("visibility");

    if (!descriptionText) {
      return true;
    }

    await waitForLightboxLayout();

    if (token !== lightboxTypingToken || !lightbox.classList.contains("is-open")) {
      return false;
    }

    const computed = window.getComputedStyle(description);
    const baseFontSize = Number.parseFloat(computed.fontSize) || 16;
    const resolvedLineHeight = Number.parseFloat(computed.lineHeight);
    const baseLineHeight = Number.isFinite(resolvedLineHeight)
      ? resolvedLineHeight
      : baseFontSize * 1.75;
    const baseLineHeightRatio = baseLineHeight / baseFontSize;
    const minFontSize = Math.max(baseFontSize * 0.82, 13);
    const maxFontSize = Math.min(baseFontSize * 1.08, baseFontSize + 1.4);
    const minLineHeightRatio = 1.48;
    const maxLineHeightRatio = baseLineHeightRatio + 0.08;
    const targetMinLines = window.innerWidth <= 560 ? 8.4 : window.innerWidth <= 880 ? 9.2 : 10;
    const targetMaxLines = window.innerWidth <= 560 ? 9.4 : window.innerWidth <= 880 ? 10.2 : 11;
    let fontSize = baseFontSize;
    let lineHeightRatio = baseLineHeightRatio;
    let metrics = null;

    const applyDescriptionMetrics = () => {
      description.style.fontSize = `${fontSize}px`;
      description.style.lineHeight = `${fontSize * lineHeightRatio}px`;
    };

    const readDescriptionMetrics = () => {
      const appliedStyles = window.getComputedStyle(description);
      const appliedLineHeight = Number.parseFloat(appliedStyles.lineHeight) || fontSize * lineHeightRatio;
      const lineCount = description.scrollHeight / Math.max(appliedLineHeight, 1);

      return {
        fits: description.scrollHeight <= description.clientHeight + 1,
        lineCount,
      };
    };

    description.style.visibility = "hidden";
    description.textContent = descriptionText;
    applyDescriptionMetrics();
    metrics = readDescriptionMetrics();

    while (!metrics.fits && fontSize > minFontSize) {
      fontSize = Math.max(minFontSize, fontSize - 0.35);
      lineHeightRatio = Math.max(minLineHeightRatio, lineHeightRatio - 0.012);
      applyDescriptionMetrics();
      metrics = readDescriptionMetrics();
    }

    while (metrics.lineCount > targetMaxLines && fontSize > minFontSize) {
      fontSize = Math.max(minFontSize, fontSize - 0.18);
      lineHeightRatio = Math.max(minLineHeightRatio, lineHeightRatio - 0.006);
      applyDescriptionMetrics();
      metrics = readDescriptionMetrics();
    }

    while (metrics.lineCount < targetMinLines && fontSize < maxFontSize) {
      const previousFontSize = fontSize;
      const previousLineHeightRatio = lineHeightRatio;

      fontSize = Math.min(maxFontSize, fontSize + 0.12);
      lineHeightRatio = Math.min(maxLineHeightRatio, lineHeightRatio + 0.006);
      applyDescriptionMetrics();
      metrics = readDescriptionMetrics();

      if (!metrics.fits || metrics.lineCount > targetMaxLines + 0.25) {
        fontSize = previousFontSize;
        lineHeightRatio = previousLineHeightRatio;
        applyDescriptionMetrics();
        metrics = readDescriptionMetrics();
        break;
      }
    }

    description.textContent = "";
    description.style.visibility = "";

    return token === lightboxTypingToken && lightbox.classList.contains("is-open");
  }
}

function shouldLoadGitHub() {
  return Boolean(
    projectsGrid ||
      terminalFeed ||
      statElements.repos ||
      statElements.followers ||
      statElements.following
  );
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
