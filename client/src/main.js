import customAxios from "./config/axios.config.js";

// Vite muhiti uchun to'g'ri URL olish
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || "";

// DOM elementlarni olish
const categorySelect = document.querySelector("#categorySelect");
const searchInput = document.querySelector("#searchInput");
const movieList = document.querySelector("#movieList");
const slider = document.querySelector("#slider");
const pageButtonsContainer = document.querySelector("#pageButtons");
const sortSelect = document.querySelector("#sortSelect");

// Global o'zgaruvchilar
let accessToken = null;
let payload = null;

// Cookie'dan qiymat olish funksiyasi
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// JWT tokenni decode qilish funksiyasi
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payloadString = atob(base64Payload);
    return JSON.parse(payloadString);
  } catch (error) {
    return null;
  }
}

// Sahifa yuklanganda tokenni olib, admin bo'lsa panelni ko'rsatish
window.onload = () => {
  accessToken = getCookie("accessToken");
  payload = parseJwt(accessToken);

  if (payload?.role === "admin") {
    document.getElementById("adminControls").style.display = "block";
  }

  // Kategoriyalarni yuklash va filmlarni ko'rsatishni boshlash
  getCategories();
  loadFilms();
};

// Kategoriyalarni serverdan olish va selectga qo'shish
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

// Filmlar ro'yxatini yuklash
async function loadFilms(category = "", query = "", page = 1, sort = "title") {
  try {
    const res = await customAxios.get("/films", {
      params: { category, query, page, sort },
    });

    movieList.innerHTML = "";
    slider.innerHTML = "";

    const films = res.data.data || [];
    const totalFilms = res.data.total || 0;
    const totalPages = Math.ceil(totalFilms / 8);

    if (films.length === 1) {
      // Agar faqat bitta film bo'lsa
      const film = films[0];
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
      // Oxirgi 3 ta film uchun slider yaratish
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

      // Barcha filmlarni ro'yxatda ko'rsatish
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

// Filmni "Saqlash" funksiyasi
async function toggleSave(filmId) {
  if (!payload) {
    alert("Iltimos, avval tizimga kiring!");
    return;
  }

  try {
    const res = await customAxios.post(`/films/${filmId}/save`, {
      userId: payload.id,
    });

    const film = document.querySelector(`.movie[data-film-id="${filmId}"]`);
    if (!film) return;

    const saveBtnIcon = film.querySelector(".save-btn i");
    if (res.data.saved) {
      saveBtnIcon.classList.add("fa-bookmark");
      saveBtnIcon.classList.remove("fa-bookmark-o"); // Sizning FontAwesome versiyangizga qarab o'zgartiring
    } else {
      saveBtnIcon.classList.remove("fa-bookmark");
      saveBtnIcon.classList.add("fa-bookmark-o");
    }
  } catch (error) {
    console.error("Save qilishda xatolik:", error);
  }
}

// Filmni "Like" qilish funksiyasi
async function toggleLike(filmId) {
  if (!payload) {
    alert("Iltimos, avval tizimga kiring!");
    return;
  }

  try {
    const res = await customAxios.post(`/like`, {
      userId: payload.id,
      filmId,
    });

    const film = document.querySelector(`.movie[data-film-id="${filmId}"]`);
    if (!film) return;

    const likeBtnIcon = film.querySelector(".like-btn i");
    if (res.data.liked) {
      likeBtnIcon.classList.add("fa-thumbs-up");
      likeBtnIcon.classList.remove("fa-thumbs-o-up"); // Sizning FontAwesome versiyangizga qarab o'zgartiring
    } else {
      likeBtnIcon.classList.remove("fa-thumbs-up");
      likeBtnIcon.classList.add("fa-thumbs-o-up");
    }
  } catch (error) {
    console.error("Like qilishda xatolik:", error);
  }
}

// Sahifalash tugmalarini yangilash
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

// Event listenerlar
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

sortSelect
