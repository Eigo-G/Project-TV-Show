//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeElem = document.createElement("section");

    episodeElem.innerHTML = `
      <h2>${episode.name}</h2>
      <p>Season ${episode.season}, Episode ${episode.number}</p>
      <img src="${episode.image.medium}" alt="${episode.name}" />
      <div>${episode.summary}</div>
    `;

    rootElem.appendChild(episodeElem);
  });

}

window.onload = setup;


