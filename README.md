# CatMeals Frontend

Welcome to the CatMeals frontend repository! MeowMeals is a web application designed to help cat owners transition to feeding their pets raw food by providing a user-friendly platform for managing cat profiles, selecting recipes, and generating precise meal plans based on individual cat needs.

## Features

### 1. **User Authentication and Secure Login**
- **JWT Authentication**: Secure login using JSON Web Tokens (JWT) for enhanced security.
- **Show/Hide Password**: Toggle to show or hide the password during login for better usability.
- **Error Handling**: Clear error messages for login failures (e.g., incorrect username or password).
<img width="1710" alt="SuccessLogin" src="https://github.com/user-attachments/assets/298d8efa-ace4-46d5-ba77-1819ecf78b7d" />


### 2. **User Sign-Up**
- **Validation Checks**: Ensures unique usernames, valid email addresses, and password complexity.
- **Error Messages**: Provides clear feedback for sign-up issues (e.g., existing username or email).
<img width="845" alt="Signup" src="https://github.com/user-attachments/assets/d519f52f-0bdf-4716-aad5-e2a895d71f99" />

### 3. **Profile Page with Cat Information**
- **Dynamic Data Fetching**: Automatically fetches and displays cat information (name, age, weight, etc.) for logged-in users.
- **CRUD Operations**: Users can add, update, or delete cat profiles.
![Dashboard](https://github.com/user-attachments/assets/ab128033-5eed-4ce1-b3c2-0410d5f36163)

### 4. **Recipe Display and Dynamic Fetching**
- **Recipe Browsing**: Users can browse all available recipes, even without logging in.
- **Detailed Recipe Information**: Includes ingredients and reference URLs for further information.
<img width="1280" alt="f4-login" src="https://github.com/user-attachments/assets/daabcb8c-9154-48b9-998b-bc08221e34ee" />

### 5. **Recipe Customized Calculation**
- **Custom Meal Plans**: Generates precise ingredient amounts based on the cat's weight, age, and the number of days the meal is prepared for.
- **Multi-Cat Support**: Allows users to select multiple cats for meal planning.
- **Summary Display**: Shows total food needed per day and for the specified duration.
<img width="1280" alt="CalculatorPage_LoginUser" src="https://github.com/user-attachments/assets/5a95b2e8-40b3-4c26-b411-d5ce7ab49968" />

## Technologies

### Frontend
- **Vue.js**: A progressive JavaScript framework for building user interfaces.
- **Vue Router**: Handles client-side routing for seamless navigation.
- **Pinia**: State management library for managing shared application state.
- **Axios**: HTTP client for making API requests to the backend.
- **Element Plus**: UI library for pre-built components like buttons, forms, and tables.
- **Tailwind CSS**: Utility-first CSS framework for responsive designs.

### Development Tools
- **Vite**: Modern build tool for fast and efficient development.
- **ESLint**: Linting tool for enforcing code style and preventing errors.
- **PostCSS**: Tool for automatically adding vendor prefixes to CSS.
