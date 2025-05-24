import customAxios from "../../config/axios.config.js";

const form = document.querySelector("#forgotForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;

  try {
    const res = await customAxios.post("/api/forgot-password", { email });
    console.log(res)
    alert(res?.data?.message);
    form.reset();
  } catch (err) {
    alert(err.response?.data?.message || "Xatolik yuz berdi ❌");
  }
});
