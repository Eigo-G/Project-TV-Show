const episodeCache = {};

function getEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

function renderEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("section");
    const code = getEpisodeCode(episode);
    card.id = `episode-${code}`;
    card.innerHTML = `
      <h2>${episode.name} - ${code}</h2>
      <img src="${episode.image.medium}" alt="${episode.name}" />
      <div>${episode.summary}</div>
      <p><a href="${episode.url}" target="_blank">Watch on TVMaze</a></p>
    `;
    rootElem.appendChild(card);
  });

  const credit = document.createElement("p");
  credit.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  rootElem.appendChild(credit);
}

function filterEpisodes(allEpisodes, searchTerm) {
  const term = searchTerm.toLowerCase();
  return allEpisodes.filter((episode) => {
    const inName = episode.name.toLowerCase().includes(term);
    const inSummary = episode.summary.toLowerCase().includes(term);
    return inName || inSummary;
  });
}

function createSearchUI(allEpisodes) {
  const controls = document.getElementById("controls");
  controls.innerHTML = "";

  const searchLabel = document.createElement("label");
  searchLabel.setAttribute("for", "search-input");
  searchLabel.textContent = "Search episodes: ";

  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.id = "search-input";
  searchInput.placeholder = "e.g. winter";
  searchInput.setAttribute("aria-label", "Search episodes by name or summary");

  const countDisplay = document.createElement("p");
  countDisplay.id = "episode-count";
  countDisplay.setAttribute("aria-live", "polite");
  countDisplay.textContent = `Showing ${allEpisodes.length} of ${allEpisodes.length} episode(s)`;

  controls.appendChild(searchLabel);
  controls.appendChild(searchInput);
  controls.appendChild(countDisplay);

  searchInput.addEventListener("input", () => {
    const term = searchInput.value;
    const matched = term ? filterEpisodes(allEpisodes, term) : allEpisodes;
    renderEpisodes(matched);
    countDisplay.textContent = `Showing ${matched.length} of ${allEpisodes.length} episode(s)`;
  });
}

function createEpisodeSelector(allEpisodes) {
  const controls = document.getElementById("controls");

  const selectLabel = document.createElement("label");
  selectLabel.setAttribute("for", "episode-select");
  selectLabel.textContent = "Jump to episode: ";

  const select = document.createElement("select");
  select.id = "episode-select";
  select.setAttribute("aria-label", "Jump to a specific episode");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select an episode --";
  select.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const code = getEpisodeCode(episode);
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${code} - ${episode.name}`;
    select.appendChild(option);
  });

  controls.appendChild(selectLabel);
  controls.appendChild(select);

  select.addEventListener("change", () => {
    const selectedCode = select.value;
    if (!selectedCode) return;
    const target = document.getElementById(`episode-${selectedCode}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function showLoadingMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading episodes, please wait...</p>";
}

function showErrorMessage() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Something went wrong loading the episodes. Please try refreshing the page.</p>";
}

async function fetchEpisodes(showId) {
  if (episodeCache[showId]) {
    return episodeCache[showId];
  }
  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }
  const episodes = await response.json();
  episodeCache[showId] = episodes;
  return episodes;
}

async function fetchShows() {
  const response = await fetch("https://api.tvmaze.com/shows");
  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }
  return response.json();
}

function createShowSelector(shows) {
  const header = document.querySelector("header");

  const showSelectLabel = document.createElement("label");
  showSelectLabel.setAttribute("for", "show-select");
  showSelectLabel.textContent = "Select a show: ";

  const showSelect = document.createElement("select");
  showSelect.id = "show-select";
  showSelect.setAttribute("aria-label", "Select a TV show");

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "-- Select a show --";
  showSelect.appendChild(defaultOption);

  const sortedShows = [...shows].sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

  header.appendChild(showSelectLabel);
  header.appendChild(showSelect);

  showSelect.addEventListener("change", async () => {
    const showId = showSelect.value;
    if (!showId) return;
    showLoadingMessage();
    try {
      const episodes = await fetchEpisodes(showId);
      renderEpisodes(episodes);
      createSearchUI(episodes);
      createEpisodeSelector(episodes);
    } catch (error) {
      showErrorMessage();
    }
  });
}

async function setup() {
  showLoadingMessage();
  try {
    const shows = await fetchShows();
    createShowSelector(shows);
    document.getElementById("root").innerHTML = "<p>Please select a show to get started.</p>";
  } catch (error) {
    showErrorMessage();
  }
}

window.onload = setup;