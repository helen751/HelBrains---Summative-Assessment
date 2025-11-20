// HelBrains Dashboard Controller
import { supabase } from "./supabase.js";
import { showLoader, hideLoader } from "./utils.js";

// Global profile storage
let user = {};

/* AUTO SYNC GOOGLE USER INTO helbrains_users */
async function syncGoogleUser() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    // Get name pieces safely
    const fullname = user.user_metadata.full_name || "";
    const firstname = fullname.split(" ")[0] || "User";
    const lastname = fullname.split(" ")[1] || "";

    // Check if user exists
    const { data: exists } = await supabase
        .from("helbrains_users")
        .select("id")
        .eq("id", user.id)
        .single();

    // If not exist → create
    if (!exists) {
        await supabase.from("helbrains_users").insert({
            id: user.id,
            firstname,
            lastname,
            email: user.email
        });
    }
}

syncGoogleUser();


/* GET CURRENT AUTH USER */
export async function getCurrentUser() {
    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const authUser = session.user;

    // Get profile from your custom table
    const { data: profile } = await supabase
        .from("helbrains_users")
        .select("firstname, lastname, email")
        .eq("id", authUser.id)
        .single();

    return {
        ...authUser,
        firstname: profile?.firstname,
        lastname: profile?.lastname,
        email: profile?.email,
        id: authUser.id,
        last_login: authUser.last_sign_in_at || null,
    };
}


/* 
   INITIAL LOAD — After DOM Ready
 */
document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    user = await getCurrentUser()

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Load HOME dashboard first
    loadDashboardHome(user.id);

    // Sidebar button triggers
    document.getElementById("sidebar-profile").addEventListener("click", (e) => {
        e.preventDefault();
        loadProfile();
        setActiveSidebar("sidebar-profile");
    });

    document.getElementById("sidebar-dashboard").addEventListener("click", (e) => {
        e.preventDefault();
        loadDashboardHome(user.id);
        setActiveSidebar("sidebar-dashboard");
    });
});

/* 
   SET ACTIVE SIDEBAR LINK
 */
function setActiveSidebar(activeId) {
    document.querySelectorAll(".nav-link").forEach(item => {
        item.classList.remove("active");
    });

    const el = document.getElementById(activeId);
    if (el) el.classList.add("active");
}

/* 
   LOAD DASHBOARD HOME (METRICS + PURCHASES)
 */
export async function loadDashboardHome(user_id) {
    const title = document.getElementById("dashboard-title");
    const content = document.getElementById("dashboard-content");

    title.textContent = `Welcome Back ${user.firstname}!`;

    // Dashboard Home Template ----------------------------
    content.innerHTML = `
        <div class="metrics">
            <div class="metric-card">
                <h3>Total Spent</h3>
                <p id="total-spent">RWF 0</p>
            </div>
            <div class="metric-card">
                <h3>Total Books</h3>
                <p id="total-books">0 Books</p>
            </div>

            <div class="metric-card">
                <h3>Last Logged in</h3>
                <p id="last-logged-in">${user.last_login ? new Date(user.last_login).toLocaleString() : "N/A"}</p>
            </div>
        </div>

        <h2 class="section-title">Purchased Books</h2>
        <div id="purchase-list" class="purchase-list"></div>
    `;

    // Load Purchase Data
    await loadPurchases(user_id);
    hideLoader();
}

/* FETCH & RENDER PURCHASES */
async function loadPurchases(user_id) {
    const list = document.getElementById("purchase-list");
    const spentEl = document.getElementById("total-spent");
    const booksEl = document.getElementById("total-books");

    const { data, error } = await supabase
        .from("helbrains_purchases")
        .select("*")
        .eq("user_id", user_id)
        .order("purchased_at", { ascending: false });

    if (error) {
        console.error(error);
        return Swal.fire("Error", "Unable to load purchases.", "error");
    }

    let totalSpent = 0;
    list.innerHTML = "";

    /* If NO PURCHASES — show empty state */
    if (data.length === 0) {
        spentEl.textContent = "RWF 0";
        booksEl.textContent = "0 Books";

        list.innerHTML = `
            <div class="empty-state">
                <img src="images/empty.jpg" class="empty-icon">
                <h3>No Books Purchased Yet</h3>
                <p>Your purchased books will appear here once you buy something.</p>
                <a href="shop.html" class="empty-btn">Browse Books</a>
            </div>
        `;
        return;
    }

    /* If purchases exist — render normally */
    data.forEach(book => {
        totalSpent += Number(book.price);

        list.innerHTML += `
            <div class="purchase-card">
                <img src="${book.thumbnail}" class="purchase-thumb">
                <div class="purchase-info">
                    <h3>${book.book_title}</h3>
                    <p><strong>Author:</strong> ${book.book_author}</p>
                    <p><strong>Price:</strong> RWF ${book.price}</p>
                    <p><strong>Date:</strong> ${new Date(book.purchased_at).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    });

    spentEl.textContent = `RWF ${totalSpent.toLocaleString("en-US")}`;
    booksEl.textContent = `${data.length} Books`;
}


/* 
   PROFILE VIEW (Loaded via DOM on the sidebar)
 */
async function loadProfile() {
    const content = document.getElementById("dashboard-content");
    const title = document.getElementById("dashboard-title");

    title.textContent = "Profile";

    // Insert Profile Card -------------------------------------
    content.innerHTML = `
        <div class="profile-card">
            <h2>My Profile</h2>

            <form id="profile-form">
                <div class="input-group">
                    <label>First Name</label>
                    <input type="text" id="profile-firstname" required>
                </div>

                <div class="input-group">
                    <label>Last Name</label>
                    <input type="text" id="profile-lastname" required>
                </div>

                <div class="input-group">
                    <label>Email (cannot be changed)</label>
                    <input type="email" id="profile-email" disabled>
                </div>

                <button type="submit" class="btn-primary full-btn">
                    Save Changes
                </button>
            </form>
        </div>
    `;

    /* Load and set user data */
    // const user = await getCurrentUser();
    // const { data } = await supabase
    //     .from("helbrains_users")
    //     .select("*")
    //     .eq("id", user.id)
    //     .single();

    document.getElementById("profile-firstname").value = user.firstname;
    document.getElementById("profile-lastname").value  = user.lastname;
    document.getElementById("profile-email").value     = user.email;

    /* Profile Save Handler */
    document.getElementById("profile-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstname = document.getElementById("profile-firstname").value.trim();
        const lastname  = document.getElementById("profile-lastname").value.trim();

        const { error } = await supabase
            .from("helbrains_users")
            .update({
                firstname,
                lastname,
                updated_at: new Date(),
            })
            .eq("id", user.id);

        if (error) {
            return Swal.fire("Error", "Could not update profile.", "error");
        }

        Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your details have been successfully updated!",
        });

    });
}

/* DASHBOARD RESPONSIVE SIDEBAR */
const dashToggle = document.getElementById("dash-menu-toggle");
const sidebar = document.getElementById("dashboard-sidebar");
const dashOverlay = document.getElementById("dash-overlay");

if (dashToggle) {
    dashToggle.addEventListener("click", () => {
        sidebar.classList.add("show");
        dashOverlay.classList.add("show");
    });
}

if (dashOverlay) {
    dashOverlay.addEventListener("click", () => {
        sidebar.classList.remove("show");
        dashOverlay.classList.remove("show");
    });
}




