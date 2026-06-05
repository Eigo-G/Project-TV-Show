//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function getEpisodeCode(episode) {
  const seasonNumber = String(episode.season).padStart(2, "0");
  const episodeNumber = String(episode.number).padStart(2, "0");

  return `S${seasonNumber}E${episodeNumber}`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = `<p>Got ${episodeList.length} episode(s)</p>`;

  episodeList.forEach((episode) => {
    const episodeElem = document.createElement("section");
    const episodeCode = getEpisodeCode(episode);

    episodeElem.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
      <p>Season ${episode.season}, Episode ${episode.number}</p>
      <img src="${episode.image.medium}" alt="${episode.name}" />
      <div>${episode.summary}</div>
      <p><a href="${episode.url}" target="_blank">Watch on TVMaze</a></p>
    `;

    rootElem.appendChild(episodeElem);
  });

  const creditElem = document.createElement("p");
  creditElem.innerHTML = `Data originally from <a href="https://tvmaze.com/" target="_blank">TVMaze.com</a>`;
  rootElem.appendChild(creditElem);
}

window.onload = setup;
