import customAxios from "../../config/axios.config.js";

const categoryForm = document.querySelector("#categoryForm");
const categoryMessage = document.querySelector("#categoryMessage");

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#categoryName").value.trim();

  if (!name) {
    categoryMessage.textContent = "Kategoriya nomi kiritilmagan!";
    return;
  }

  try {
    const res = await customAxios.post("/categorys", { name });

    if (res.data) {
      categoryMessage.textContent = "Kategoriya muvaffaqiyatli qo‘shildi!";
      categoryForm.reset();
    }
  } catch (error) {
    categoryMessage.textContent = "Xatolik yuz berdi. Kategoriya qo‘shilmadi.";
    console.log(error);

  }
});
