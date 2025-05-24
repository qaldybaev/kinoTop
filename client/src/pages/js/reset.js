import customAxios from "../../config/axios.config.js";

const form = document.querySelector("#resetForm");
const passwordInput = document.querySelector("#password");
const toggleIcon = document.querySelector("#togglePassword");


toggleIcon.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  toggleIcon.classList.toggle("bx-low-vision");
  toggleIcon.classList.toggle("bx-show");
});

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
console.log(token)

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = passwordInput.value;

  if (!token) {
    return alert("Token mavjud emas yoki noto'g'ri link!");
  }

  try {
    const res = await customAxios.post("/api/reset-password", {
      token,
      newPassword: password,
    });

    alert(res.data.message || "Parol muvaffaqiyatli yangilandi!");
    window.location.href = "/pages/login";
  } catch (err) {
    alert(err.response?.data?.message || "Xatolik yuz berdi ❌");
  }
});
