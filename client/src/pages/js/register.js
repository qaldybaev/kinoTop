import customAxios from "../../config/axios.config.js";

const form = document.querySelector("#registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const phoneNumber = e.target.phoneNumber.value;
  const password = e.target.password.value;

  try {
    const res = await customAxios.post("/api/users/register", {
      name,
      email,
      phoneNumber,
      password,
    });

    form.reset();
    window.location.href = "/pages/login";
  } catch (err) {
    alert(err.response?.data?.message || "Xatolik yuz berdi ❌");
  }
});
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.classList.replace('bx-low-vision', 'bx-show');
    } else {
        passwordInput.type = 'password';
        togglePassword.classList.replace('bx-show', 'bx-low-vision');
    }
});
