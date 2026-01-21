
// utils.js — Core Utility Functions for HelBrains

export function truncateText(text, limit = 50) {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
}

//function to generate starts based on number of ratings
export function generateStars(rating = 0) {
    let stars = "";
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars += "★";
    if (half) stars += "☆";
    return stars || "No rating";
}

//function to format price based on rating and year
export function formatPrice(rating = 0, year = 0) {
    return ((5 + (rating > 0 ? rating * 10 : 50)) * (year >= 2000 ? 50 : 20)).toLocaleString("en-US");
}

//function to get query param from URL
export function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

export function safeGet(obj, path, fallback = null) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || fallback;
}

/* GLOBAL LOADER FUNCTIONS */
export function showLoader() {
    document.getElementById("loading-overlay").style.display = "flex";
}

export function hideLoader() {
    document.getElementById("loading-overlay").style.display = "none";
}

/* RESPONSIVE NAV TOGGLE for mobile */
const toggleBtn = document.getElementById("nav-toggle");
const navMenu   = document.getElementById("nav-menu");
const navOverlay = document.getElementById("nav-overlay");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        navMenu.classList.add("show");
        navOverlay.classList.add("show");
    });
}

if (navOverlay) {
    navOverlay.addEventListener("click", () => {
        navMenu.classList.remove("show");
        navOverlay.classList.remove("show");
    });
}

