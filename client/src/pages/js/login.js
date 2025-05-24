import customAxios from "../../config/axios.config.js";

const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await customAxios.post("/users/login", {
      email,
      password,
    });
    
    window.location.href = "/"; 
  } catch (err) {
    alert(err.response?.data?.message || "Login xatoligi ❌");
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
