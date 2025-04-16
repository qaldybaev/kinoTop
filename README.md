# 🎬 KinoTop

**KinoTop** — bu kino va seriallarni ko‘rish,
 foydalanuvchilar ro‘yxatdan o‘tib fikr bildirishlari mumkin bo‘lgan web ilova. 



## 1. Funktsional talablar

 - 🔐 Foydalanuvchi funksiyalari:
 - Foydalanuvchi ro'yxatdan o'tishi va tizimga kirishi (Login/Register)
 - Foydalanuvchi parolini unutsa, uni tiklash imkoniyati
 - Foydalanuvchi filmlarni ko‘rishi
 - Foydalanuvchi filmlarni qidirishi 
 - Foydalanuvchi izoh yozishi va reyting qo‘yishi

## Film sahifasi:
 - Film haqida batafsil ma’lumot: nomi, yili, janri, tavsifi, rasm, video havolasi
 - Izohlar (commentlar) ro‘yxati

## Admin panel:
 - Admin tizimga kiradi
 - Film qo‘shadi, tahrirlaydi, o‘chiradi
 - Foydalanuvchilar va izohlarni boshqaradi

## 2. Nofunktsional talablar
 - Sayt tez ishlashi kerak (performance)
 - Responsive dizayn (mobil, planshet, kompyuterda yaxshi ko‘rinsin)
 - Xavfsizlik: JWT token orqali autentifikatsiya, admin va oddiy foydalanuvchi rollari
 - Ma’lumotlar xavfsiz saqlanishi kerak (parollar hashlangan bo‘lishi kerak)

## Database

1. 🎭 Category (janrlar: komediya, triller, drama...)

 - id	
 - name	
 - createdAt	
 - updatedAt

2. 🎬 Film

 - id	
 - title	
 - description
 - year	
 - imageUrl	
 - videoUrl	
 - categoryId
 - createdAt	
 - updatedAt

3. 👤 User

 - id
 - name	
 - email	
 - password	
 - role	
 - phoneNumber	
 - createdAt	
 - updatedAt

4. ⭐ Review (Izoh va baho)

 - id	
 - comment	
 - rating	
 - filmId FK 
 - userId FK 
 - createdAt	
 - updatedAt	

5. 📺 Save (Saqlangan filmlar / ko‘rmoqchi bo‘lganlar ro‘yxati)

 - id	
 - userId FK 
 - filmId FK 
 - addedAt
