// HelBrains Dashboard Controller
import { supabase } from "./supabase.js";
import { showLoader, hideLoader } from "./utils.js";

await new Promise(resolve => setTimeout(resolve, 100)); 

// Global profile storage
let user = {};

/* AUTO SYNC GOOGLE USER INTO helbrains_users table on supabase */
supabase.auth.onAuthStateChange(async (event, session) => {
    if (!session?.user) return;

    const authUser = session.user;

    // Get name fields
    const fullName = authUser.user_metadata?.full_name 
        || authUser.user_metadata?.name
        || authUser.user_metadata?.fullName
        || authUser.user_metadata?.display_name
        || authUser.user_metadata?.given_name + " " + authUser.user_metadata?.family_name
        || "";

    const firstname = fullName.split(" ")[0] || "User";
    const lastname  = fullName.split(" ").slice(1).join(" ") || "";

    // Check your custom table
    const { data: existing, error } = await supabase
        .from("helbrains_users")
        .select("id")
        .eq("id", authUser.id)
        .maybeSingle();

    // Insert if missing
    if (!existing) {
        await supabase.from("helbrains_users").insert({
            id: authUser.id,
            firstname,
            lastname,
            email: authUser.email
        });
        console.log("Google user inserted into helbrains_users");
    }
});




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

/* RESPONSIVE SIDEBAR TOGGLE */

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("dashboard-sidebar");
    const overlay = document.getElementById("dash-overlay");
    const menuToggle = document.getElementById("dash-menu-toggle");

    // Open sidebar
    menuToggle.addEventListener("click", () => {
        sidebar.classList.add("open");
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
    });

    // Close sidebar when clicking overlay
    overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    });

    // Close with Esc key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
            document.body.style.overflow = "";
        }
    });
});




