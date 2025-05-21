import customAxios from "../../config/axios.config.js";

const urlParams = new URLSearchParams(window.location.search);
const filmId = urlParams.get("id");

const filmPoster = document.querySelector("#filmPoster");
const filmTitle = document.querySelector("#filmTitle");
const filmYear = document.querySelector("#filmYear");
const filmGenre = document.querySelector("#filmGenre");
const filmDescription = document.querySelector("#filmDescription");
const filmVideo = document.querySelector("#filmVideo");

const commentsList = document.querySelector("#commentsList");
const commentForm = document.querySelector("#commentForm");
const commentInput = document.querySelector("#commentInput");

// JWT tokenni base64 dan dekodlash uchun yordamchi funksiya
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1]; // Payload qismi
    const decodedPayload = atob(base64Payload); // Base64 dekodlash
    return JSON.parse(decodedPayload); // JSON formatida qaytarish
  } catch (error) {
    console.error("Tokenni dekodlashda xatolik:", error);
    return null;
  }
}

// Cookie'dan accessTokenni olish
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// Film ma'lumotlarini yuklash
async function loadFilm() {
  try {
    const res = await customAxios.get(`/films/${filmId}`);
    const film = res.data.data;

    filmPoster.src = `http://localhost:3000/api${film.imageUrl}`;
    filmTitle.textContent = film.title;
    filmYear.textContent = film.year;
    filmGenre.textContent = film.category;
    filmDescription.textContent = film.description;
    filmVideo.querySelector("source").src = `http://localhost:3000/api${film.videoUrl}`;
    filmVideo.load();
  } catch (err) {
    console.error("Film ma'lumotlarini olishda xatolik:", err);
    alert("Film ma'lumotlarini olishda xatolik yuz berdi!");
  }
}

// Izohlarni yuklash
// Izohlarni yuklash
async function loadComments() {
  try {
    const res = await customAxios.get(`/reviews?filmId=${filmId}`);
    commentsList.innerHTML = "";

    if (res.data.data.length === 0) {
      commentsList.innerHTML = "<p>Izohlar mavjud emas</p>";
    } else {
      res.data.data.forEach((comment) => {
        const div = document.createElement("div");
        console.log(comment)
        div.className = "comment";
        div.innerHTML = `
          <div class="comment-text">${comment.comment}</div>
          <div class="comment-rating">${"&#9733;".repeat(comment.rating)}</div>
          <div class="comment-author"> ${comment.userName}</div>
        `;
        commentsList.appendChild(div);
      });
    }
  } catch (err) {
    console.error("Izohlarni olishda xatolik:", err);
    alert("Izohlarni olishda xatolik yuz berdi!");
  }
}

// Ratingni tanlash
// Ratingni aniqlash uchun event listener
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('ratingInput'); // hidden input

stars.forEach(star => {
  star.addEventListener('click', (e) => {
    const rating = e.target.getAttribute('data-value');
    ratingInput.value = rating;  // Ratingni hidden inputga yozish

    stars.forEach(star => {
      if (star.getAttribute('data-value') <= rating) {
        star.classList.add('selected');
      } else {
        star.classList.remove('selected');
      }
    });
  });
});

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = commentInput.value.trim();
  if (!text) return;

  // Cookie'dan accessTokenni olish
  const token = getCookie('accessToken');
  console.log(token)
  if (!token) {
    alert("Iltimos, tizimga kirgan holda izoh qoldiring!");
    return;
  }

  // Tokenni dekodlash
  const decodedToken = parseJwt(token);
  const userId = decodedToken?.user;
  console.log(decodedToken)

  if (!userId) {
    alert("Foydalanuvchi ID topilmadi!");
    return;
  }

  // Ratingni olish
  const rating = ratingInput.value;

  if (!rating) {
    alert("Iltimos, ratingni tanlang!");
    return;
  }

  try {
    await customAxios.post(`/reviews`, { comment: text, rating, filmId, userId });
    commentInput.value = "";
    await loadComments(); 
  } catch (err) {
    alert("Izoh yuborishda xatolik");
    console.error(err);
  }
});

// Dastlabki ma'lumotlarni yuklash
loadFilm();
loadComments();
