# 🎓 College Competition Platform

A modern Angular web application for managing college competitions,
students, and projects.\
The platform allows users to register, submit projects, participate in
competitions, and view results.

------------------------------------------------------------------------

## 🚀 Features

-   🔐 Authentication system (Login / Register)
-   👤 User profile management
-   🏆 Competitions listing and participation
-   📤 Submit competition projects
-   👨‍🎓 Students management
-   📁 Projects showcase
-   🥇 Winners page
-   📊 Dashboard overview
-   🧭 Responsive navigation with reusable components

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend:** Angular
-   **Styling:** SCSS
-   **Routing:** Angular Router
-   **State & Services:** Angular Services
-   **Notifications:** ngx-toastr

------------------------------------------------------------------------

## 📂 Project Structure

    src/
    │
    ├── app/
    │   ├── core/guards/        # Route guards (auth)
    │   ├── pages/              # Main pages (home, login, dashboard, etc.)
    │   ├── shared/
    │   │   ├── components/     # Reusable UI components
    │   │   └── services/       # API & auth services
    │
    ├── assets/                 # Images & static files

------------------------------------------------------------------------

## ⚙️ Installation

``` bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
ng serve
```

Open: http://localhost:4200

------------------------------------------------------------------------

## 🔑 Environment Setup

Configure API endpoints in:

`src/app/shared/services/generalApis.service.ts`

------------------------------------------------------------------------

## 🧪 Available Scripts

-   ng serve
-   ng build
-   ng test

------------------------------------------------------------------------

## 📌 Future Improvements

-   Admin panel
-   Real-time notifications
-   File upload enhancements
-   Backend integration improvements

------------------------------------------------------------------------

## 👨‍💻 Author

Abdelrhman Khaled

------------------------------------------------------------------------

## 📄 License

MIT License
