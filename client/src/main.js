import customAxios from "./config/axios.config.js";

const SERVER_BASE_URL = process.env.VITE_SERVER_BASE_URL;

const categorySelect = document.querySelector("#categorySelect");
const searchInput = document.querySelector("#searchInput");
const movieList = document.querySelector("#movieList");
const slider = document.querySelector("#slider");
const pageButtonsContainer = document.querySelector("#pageButtons");
const sortSelect = document.querySelector("#sortSelect");

let payload = null;

// Cookie dan accessToken ni olish
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// JWT tokenni dekodlash
function parseJwt(token) {
  try {
    console.log("token",token)
    const base64Payload = token.split(".")[1];
    payload = atob(base64Payload);
    console.log("payload",payload)
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

// Sahifa yuklanganda ishlaydi
window.onload = () => {
  const accessToken = getCookie("accessToken");
  payload = parseJwt(accessToken);
  console.log(payload)
  if (payload?.role === "admin") {
    document.getElementById("adminControls").style.display = "block";
  }
};

// Kategoriyalarni olish
async function getCategories() {
  try {
    const res = await customAxios.get("/categorys");
    const categories = res.data.data;
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

// Filmlarni yuklash
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
      const div = document.createElement("div");
      div.className = "movie";
      div.setAttribute("data-film-id", film._id);
      div.innerHTML = createFilmCard(film);
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
        div.innerHTML = createFilmCard(film);
        movieList.appendChild(div);
      });
    }

    updatePagination(totalPages, page, category, query, sort);
  } catch (err) {
    movieList.innerHTML = "<p>Xatolik yuz berdi. Filmlar olinmadi.</p>";
    console.error(err);
  }
}

// Film kartasini HTML shaklida qaytarish
function createFilmCard(film) {
  return `
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
}

// Save funksiyasi
async function toggleSave(filmId) {
  try {
    const res = await customAxios.post(`/films/${filmId}/save`, {
      userId: payload.id,
    });

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

// Like funksiyasi
async function toggleLike(filmId) {
  try {
    const res = await customAxios.post(`/like`, {
      userId: payload.id,
      filmId,
    });

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

// Pagination tugmalarini yaratish
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

// Kategoriya o‘zgarganda
categorySelect.addEventListener("change", (event) => {
  const category = event.target.value;
  loadFilms(category, searchInput.value.trim(), 1, sortSelect.value);
});

// Qidiruv inputi
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  if (query === "") {
    document.getElementById("primerya").classList.remove("hidden");
  } else {
    document.getElementById("primerya").classList.add("hidden");
  }

  loadFilms(categorySelect.value, query, 1, sortSelect.value);
});

// Saralash tanlanganda
sortSelect.addEventListener("change", () => {
  loadFilms(categorySelect.value, searchInput.value.trim(), 1, sortSelect.value);
});

// Boshlang‘ich yuklash
getCategories();
loadFilms();
