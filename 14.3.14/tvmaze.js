const MISSING_IMG_URL = "http://tinyurl.com/tv-missing";

/** Given a query string, return array of matching shows:
 *     { id, name, summary, image }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);

  return res.data.map(searchResult => {
    const show = searchResult.show;

    // either grab the image or use the placeholder if there isn't one
    let imgURL = MISSING_IMG_URL;
    if(show.image !== null) {
      imgURL = show.image.medium;
    }

    // catch shows with no summary data
    let summary = show.summary;
    if(summary === null) {
      summary = "No summary available.";
    }

    return {
      id: show.id,
      name: show.name,
      summary: summary,
      image: imgURL
    };
  });
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary episodes-button">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$("#shows-list").on("click", ".episodes-button", async function episodeButtonClick(e) {
  let id = $(e.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(id);
  populateEpisodes(episodes);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  return res.data.map(ep => {
    return {
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number
    };
  });
}

function populateEpisodes(episodes) {
  const episodeList = document.getElementById("episodes-list");

  if(episodes.length === 0) {
    episodeList.innerHTML = "No episodes found.";
  } else {
    episodeList.innerHTML = "";
    for(let episode of episodes) {
      const newLi = document.createElement("li");
      newLi.innerText = `${episode.name} (season ${episode.season}, number ${episode.number})`;
      episodeList.append(newLi);
    }
  }

  $("#episodes-area").show();
}