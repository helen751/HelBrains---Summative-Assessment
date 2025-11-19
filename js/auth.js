// auth.js: File to process the Registration, Login and Logout

// importing the database client
import { supabase } from "./supabase.js";
//utils js
import { showLoader, hideLoader } from "./utils.js";

/* HANDLE REGISTRATION */
const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstname = document.getElementById("firstname").value.trim();
        const lastname  = document.getElementById("lastname").value.trim();
        const email     = document.getElementById("email").value.trim();
        const password  = document.getElementById("password").value.trim();

        const submitBtn = registerForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;

        // Disable & show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Processing...";

        if (!firstname || !lastname || !email || !password) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            return Swal.fire("Missing Fields", "Please fill all fields.", "warning");
        }

        // Create Supabase Auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    firstname: firstname,
                    lastname: lastname
                }
            }
        });

        if (authError) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            let msg = authError.message.includes("already registered")
                ? "This email is already in use."
                : "Registration failed.";

            return Swal.fire("Error", msg, "error");
        }

        if (authData?.user?.identities?.length === 0) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            return Swal.fire("Email In Use", "This email is already registered.", "error");
        }

        const user_id = authData.user.id;

        // Insert into helbrains_users table on supabase
        const { error: dbError } = await supabase
            .from("helbrains_users")
            .insert({
                id: user_id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            });

        if (dbError) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            return Swal.fire("Database Error", "Could not save your profile.", "error");
        }

        // Success
        Swal.fire({
            title: "Account Created!",
            text: "Your HelBrains account is ready.",
            icon: "success",
            confirmButtonText: "Login Now"
        }).then(() => {
            window.location.href = "login.html";
        });
    });
}


/* HANDLE LOGIN */
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const submitBtn = loginForm.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;

        // Disable button & show loader
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Processing...";

        // 1️⃣ Login using Supabase Auth
        const { data: loginData, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            return Swal.fire("Login Failed", "Incorrect email or password.", "error");
        }

        // 2️⃣ Get user's firstname from helbrains_users
        const user_id = loginData.user.id;

        const { data: userRow, error: fetchError } = await supabase
            .from("helbrains_users")
            .select("firstname")
            .eq("id", user_id)
            .single();

        let firstname = "back";

        if (!fetchError && userRow && userRow.firstname) {
            firstname = userRow.firstname;
        }

        // 3️⃣ Success message with firstname
        Swal.fire({
            title: `Welcome back, ${firstname}!`,
            text: "You will be redirected to your dashboard shortly.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1600);
    });
}

/* GOOGLE AUTH */
const googleBtn = document.getElementById("google-login") || document.getElementById("google-signup");

if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        showLoader();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/dashboard.html"
            }
        });

        if (error) {
            hideLoader();
            Swal.fire("Error", error.message, "error");
        }
    });
}


/* HANDLE LOGOUT */
export async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}
window.logout = logout;
