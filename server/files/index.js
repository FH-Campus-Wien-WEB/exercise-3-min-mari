function appendMovie(movie, mainElement) {
  const articleElement = document.createElement("article");
  articleElement.id = movie.imdbID;

  const contentElement = document.createElement("div");
  contentElement.className = "movie-content";

  const detailsElement = document.createElement("div");
  detailsElement.className = "movie-details";

  const posterWrapperElement = document.createElement("div");
  posterWrapperElement.className = "movie-poster";

  const titleElement = document.createElement("h1");
  titleElement.textContent = movie.Title;

  const infoElement = document.createElement("p");
  infoElement.innerHTML =
    "<strong>Released:</strong> " +
    movie.Released +
    " | <strong>Runtime:</strong> " +
    movie.Runtime +
    " min | <strong>Metascore:</strong> " +
    movie.Metascore +
    " | <strong>IMDb:</strong> " +
    movie.imdbRating;

  const plotElement = document.createElement("p");
  plotElement.className = "movie-synopsis";
  plotElement.textContent = movie.Plot;

  const genresElement = document.createElement("p");
  genresElement.append("Genres: ");
  for (const genre of movie.Genres) {
    const genreSpan = document.createElement("span");
    genreSpan.className = "genre";
    genreSpan.textContent = genre;
    genresElement.append(genreSpan);
  }

  const directorsElement = document.createElement("p");
  directorsElement.innerHTML =
    "<strong>Directors:</strong> " + movie.Directors.join(", ");

  const writersElement = document.createElement("p");
  writersElement.innerHTML =
    "<strong>Writers:</strong> " + movie.Writers.join(", ");

  const actorsElement = document.createElement("p");
  actorsElement.innerHTML =
    "<strong>Actors:</strong> " + movie.Actors.join(", ");

  const posterElement = document.createElement("img");
  posterElement.src = movie.Poster;
  posterElement.alt = movie.Title + " Poster";

  const buttonElement = document.createElement("button");
  buttonElement.textContent = "Edit";
  buttonElement.onclick = function () {
    location.href = "edit.html?imdbID=" + movie.imdbID;
  };

  detailsElement.append(titleElement);
  detailsElement.append(infoElement);
  detailsElement.append(plotElement);
  detailsElement.append(genresElement);
  detailsElement.append(directorsElement);
  detailsElement.append(writersElement);
  detailsElement.append(actorsElement);

  posterWrapperElement.append(posterElement);
  posterWrapperElement.append(buttonElement);

  contentElement.append(detailsElement);
  contentElement.append(posterWrapperElement);

  articleElement.append(contentElement);
  mainElement.append(articleElement);
}

function loadMovies(genre) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");
    mainElement.replaceChildren();

    if (xhr.status == 200) {
      const movies = JSON.parse(xhr.responseText);

      for (const movie of movies) {
        appendMovie(movie, mainElement);
      }
    } else {
      mainElement.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText,
      );
    }
  };

  const url = new URL("/movies", location.href);
  if (genre) {
    url.searchParams.set("genre", genre);
  }

  xhr.open("GET", url);
  xhr.send();
}

function addGenreButton(listElement, label, genre) {
  const listItemElement = document.createElement("li");
  const buttonElement = document.createElement("button");

  buttonElement.textContent = label;
  buttonElement.onclick = function () {
    loadMovies(genre);
  };

  listItemElement.append(buttonElement);
  listElement.append(listItemElement);
}

function setupGenreMenu(navElement, listElement) {
  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "genre-toggle";
  toggleButton.textContent = "Genres ▼";
  toggleButton.setAttribute("aria-expanded", "false");

  listElement.classList.add("genre-list");
  listElement.hidden = true;

  toggleButton.onclick = function () {
    const isOpen = !listElement.hidden;
    listElement.hidden = isOpen;
    navElement.classList.toggle("open", !isOpen);
    toggleButton.setAttribute("aria-expanded", String(!isOpen));
    toggleButton.textContent = !isOpen ? "Genres ▲" : "Genres ▼";
  };

  navElement.append(toggleButton);
  navElement.append(listElement);
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const navElement = document.querySelector("nav");

    if (xhr.status == 200) {
      const genres = JSON.parse(xhr.responseText);
      const listElement = document.createElement("ul");

      addGenreButton(listElement, "All", undefined);

      for (const genre of genres) {
        addGenreButton(listElement, genre, genre);
      }

      setupGenreMenu(navElement, listElement);

      const firstButton = navElement.querySelector("button");
      if (firstButton) {
        listElement.querySelector("button").click();
      }
    } else {
      navElement.append(
        "Daten konnten nicht geladen werden, Status " +
          xhr.status +
          " - " +
          xhr.statusText,
      );
    }
  };

  xhr.open("GET", "/genres");
  xhr.send();
};
