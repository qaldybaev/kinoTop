import customAxios from "./config/axios.config.js";

const SERVER_BASE_URL = process.env.VITE_SERVER_BASE_URL

const categorySelect = document.querySelector("#categorySelect");
const searchInput = document.querySelector("#searchInput");
const movieList = document.querySelector("#movieList");
const slider = document.querySelector("#slider");
const pageButtonsContainer = document.querySelector("#pageButtons");
const sortSelect = document.querySelector("#sortSelect");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) {
    console.log("Token topilmadi");
    return;
  }

  const payload = parseJwt(accessToken);
  console.log("Payload:", payload);

  if (payload?.role === "admin") {
    const adminControls = document.getElementById("adminControls");
    if (adminControls) {
      adminControls.style.display = "block";
    }
  }
});


async function getCategories() {
  try {
    const res = await customAxios.get("/categorys");
    const categories = res.data.data;
    console.log(categories)
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Kategoriya olishda xatolik:", err);
  }
}

async function loadFilms(category = "", query = "", page = 1, sort = "title") {
  try {
    const res = await customAxios.get("/films", {
      params: { category, query, page, sort },
    });

    movieList.innerHTML = "";
    slider.innerHTML = "";

    const films = res.data.data || [];
    const totalFilms = res.data.total;
    const totalPages = Math.ceil(totalFilms / 8);

    if (films.length === 1) {
      const film = films[0];
      console.log("photo",film.imageUrl)
      const div = document.createElement("div");
      div.className = "movie";
      div.setAttribute("data-film-id", film._id);
      div.innerHTML = `
        <a href="/pages/film.html?id=${film._id}">
          <img src="${SERVER_BASE_URL}${film.imageUrl}" alt="${film.title}" />
          <h3>${film.title}</h3>
        </a>
        <div class="movie-actions">
          <div class="icon-container">
            <button class="save-btn" onclick="toggleSave('${film._id}')">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="like-btn" onclick="toggleLike('${film._id}')">
              <i class="fas fa-thumbs-up"></i>
            </button>
          </div>
        </div>
      `;
      movieList.appendChild(div);
    } else {
      const lastThree = films.slice(-3);
      lastThree.forEach((film) => {
        const div = document.createElement("div");
        div.className = "slide";
        div.innerHTML = `
          <img src="${SERVER_BASE_URL}${film.imageUrl}" alt="${film.title}" />
        `;
        slider.appendChild(div);
      });

      let currentIndex = 0;
      function showSlide(index) {
        slider.style.transform = `translateX(-${index * 100}%)`;
      }

      if (lastThree.length > 0) {
        setInterval(() => {
          currentIndex = (currentIndex + 1) % lastThree.length;
          showSlide(currentIndex);
        }, 4000);
      }

      films.forEach((film) => {
        const div = document.createElement("div");
        div.className = "movie";
        div.setAttribute("data-film-id", film._id);
        div.innerHTML = `
          <a href="/pages/film.html?id=${film._id}">
            <img src="${SERVER_BASE_URL}${film.imageUrl}" alt="${film.title}" />
            <h3>${film.title}</h3>
          </a>
          <div class="movie-actions">
            <div class="icon-container">
              <button class="save-btn" onclick="toggleSave('${film._id}')">
                <i class="fas fa-bookmark"></i>
              </button>
              <button class="like-btn" onclick="toggleLike('${film._id}')">
                <i class="fas fa-thumbs-up"></i>
              </button>
            </div>
          </div>
        `;
        movieList.appendChild(div);
      });
    }

    updatePagination(totalPages, page, category, query, sort);
  } catch (err) {
    movieList.innerHTML = "<p>Xatolik yuz berdi. Filmlar olinmadi.</p>";
    console.error(err);
  }
}

async function toggleSave(filmId) {
  try {
    const res = await customAxios.post(`/films/${filmId}/save`, {
      userId: payload.id,
    });
    console.log(`Save qilindi: ${filmId}`, res.data);

    const film = document.querySelector(`.movie[data-film-id="${filmId}"]`);
    const saveBtn = film.querySelector(".save-btn i");
    if (res.data.saved) {
      saveBtn.classList.add("fa-bookmark");
      saveBtn.classList.remove("fa-bookmark-o");
    } else {
      saveBtn.classList.remove("fa-bookmark");
      saveBtn.classList.add("fa-bookmark-o");
    }
  } catch (error) {
    console.error("Save qilishda xatolik:", error);
  }
}

async function toggleLike(filmId) {
  try {
    const res = await customAxios.post(`/like`, {
      userId: payload.id,
      filmId,
    });
    console.log(`Like qilindi: ${filmId}`, res.data);

    const film = document.querySelector(`.movie[data-film-id="${filmId}"]`);
    const likeBtn = film.querySelector(".like-btn i");
    if (res.data.liked) {
      likeBtn.classList.add("fa-thumbs-up");
      likeBtn.classList.remove("fa-thumbs-o-up");
    } else {
      likeBtn.classList.remove("fa-thumbs-up");
      likeBtn.classList.add("fa-thumbs-o-up");
    }
  } catch (error) {
    console.error("Like qilishda xatolik:", error);
  }
}

function updatePagination(totalPages, currentPage, category, query, sort) {
  pageButtonsContainer.innerHTML = "";

  if (totalPages <= 1) return;

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "<<<";
    prevBtn.addEventListener("click", () => {
      loadFilms(category, query, currentPage - 1, sort);
    });
    pageButtonsContainer.appendChild(prevBtn);
  }

  const currentPageBtn = document.createElement("button");
  currentPageBtn.textContent = currentPage;
  pageButtonsContainer.appendChild(currentPageBtn);

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = ">>>";
    nextBtn.addEventListener("click", () => {
      loadFilms(category, query, currentPage + 1, sort);
    });
    pageButtonsContainer.appendChild(nextBtn);
  }
}

categorySelect.addEventListener("change", (event) => {
  const category = event.target.value;
  loadFilms(category, searchInput.value.trim(), 1, sortSelect.value);
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  if (query === "") {
    document.getElementById("primerya").classList.remove("hidden");
    loadFilms(categorySelect.value, query, 1, sortSelect.value);
  } else {
    document.getElementById("primerya").classList.add("hidden");
    loadFilms(categorySelect.value, query, 1, sortSelect.value);
  }
});

sortSelect.addEventListener("change", () => {
  loadFilms(categorySelect.value, searchInput.value.trim(), 1, sortSelect.value);
});

getCategories();
loadFilms();
