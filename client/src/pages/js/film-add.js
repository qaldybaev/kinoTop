import customAxios from "../../config/axios.config.js";

const filmForm = document.querySelector("#filmForm");
const filmMessage = document.querySelector("#filmMessage");
const filmCategorySelect = document.querySelector("#filmCategory");

async function loadCategories() {
  try {
    const res = await customAxios.get("/api/categorys");
    const categories = res.data.data;

    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat._id;
      option.textContent = cat.name;
      filmCategorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Kategoriya olishda xatolik:", error);
  }
}

filmForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.querySelector("#filmTitle").value.trim();
  const description = document.querySelector("#filmDescription").value.trim();
  const year = document.querySelector("#filmYear").value.trim();
  const categoryId = document.querySelector("#filmCategory").value;
  const image = document.querySelector("#filmImage").files[0];
  const video = document.querySelector("#filmVideo").files[0];

  if (!title || !description || !year || !categoryId || !image || !video) {
    filmMessage.textContent = "Iltimos, barcha maydonlarni to‘ldiring!";
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("year", year);
  formData.append("categoryId", categoryId);
  formData.append("imageUrl", image);
  formData.append("videoUrl", video);

  try {
    const res = await customAxios.post("/api/films", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data) {
      filmMessage.textContent = "Film muvaffaqiyatli qo‘shildi!";
      filmForm.reset();
    }
  } catch (error) {
    filmMessage.textContent = "Xatolik yuz berdi. Film qo‘shilmadi.";
    console.log(error.stack);
  }
});

loadCategories();
