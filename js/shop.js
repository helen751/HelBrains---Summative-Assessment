// Bookstore Controller
import { supabase } from "./supabase.js";
//send email api
import { sendReceiptEmail } from "./email.js";
//utils js
import { showLoader, hideLoader, truncateText, generateStars, formatPrice } from "./utils.js";


/* GLOBAL STATE */
let allBooks = [];             // Stores all fetched books for pagination
let currentPage = 1;           // Current page index
const booksPerPage = 9;        // 3×3 grid
let currentQuery = "";

/* DOM REFERENCES */
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const booksGrid = document.getElementById("books-grid");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageNumber = document.getElementById("page-number");

/* GET LOGGED-IN USER */
async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
}

/* BOOK FETCH FUNCTION */
async function fetchBooks(query) {
    const url =
        "https://www.googleapis.com/books/v1/volumes?q=" +
        encodeURIComponent(query) +
        "&maxResults=40";

    booksGrid.innerHTML = `<p class="loading-text">Loading books...</p>`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) return [];

    /* Clean, strict filtering */
    let books = data.items
        .filter(b =>
            b.volumeInfo &&
            b.volumeInfo.title &&
            b.volumeInfo.authors &&
            b.volumeInfo.imageLinks?.thumbnail
        )
        .map(b => {
            const info = b.volumeInfo;
            const year = info.publishedDate ? info.publishedDate.substring(0, 4) : null;
            const rating = info.averageRating || 0;
            const price = (5 + (rating * 10) * (year >= 2000 ? 500 : 200))

            return {
                id: b.id,
                title: info.title,
                author: info.authors.join(", "),
                thumbnail: info.imageLinks.thumbnail,
                description: info.description || "",
                rating,
                year,
                price
            };
        });

    /* Strict year filter */
    const yearQuery = query.match(/^\d{4}$/);
    if (yearQuery) {
        const yr = yearQuery[0];
        books = books.filter(b => b.year === yr);
    }

    /* Sort by rating first */
    books.sort((a, b) => b.rating - a.rating);

    return books;
}

/* RENDER BOOK CARDS */
function renderBooks() {
    booksGrid.innerHTML = "";

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;

    const booksToShow = allBooks.slice(start, end);

    if (booksToShow.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-results">
                <h3>No books found</h3>
                <p>Try another search keyword.</p>
            </div>`;
        return;
    }

    booksToShow.forEach(b => {
        booksGrid.innerHTML += `
            <div class="book-card">

                <img src="${b.thumbnail}" class="book-thumb">

                <div class="book-info">
                    <h3>${b.title}</h3>
                    <p><strong>Author:</strong> ${b.author}</p>
                    <p><strong>Year:</strong> ${b.year || "N/A"}</p>
                    <p class="book-price">RWF ${b.price}</p>
                </div>

                <button class="buy-btn"
                    onclick="buyBook(
                        '${b.id}',
                        '${b.title.replace(/'/g, "\\'")}',
                        '${b.author.replace(/'/g, "\\'")}',
                        '${b.thumbnail}',
                        '${b.description.replace(/'/g, "\\'")}',
                        ${b.price}
                    )">
                    Buy Now
                </button>

            </div>`;
    });

    pageNumber.textContent = `Page ${currentPage}`;
}

/* SEARCH HANDLER */
searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) {
        return Swal.fire("Missing Search", "Please enter a keyword.", "warning");
    }

    currentPage = 1;

    const results = await fetchBooks(query);
    allBooks = results;

    renderBooks();
});

/* PAGINATION */
prevBtn.addEventListener("click", () => {
    if (currentPage === 1) return;
    currentPage--;
    renderBooks();
});

nextBtn.addEventListener("click", () => {
    const maxPage = Math.ceil(allBooks.length / booksPerPage);
    if (currentPage >= maxPage) return;
    currentPage++;
    renderBooks();
});

/* BUY NOW LOGIC */
window.buyBook = async function (id, title, author, thumb, desc, price) {
    showLoader();
    const user = await getCurrentUser();

    if (!user) {
        hideLoader();
        return Swal.fire({
            icon: "info",
            title: "Login Required",
            text: "Please login to purchase.",
            confirmButtonText: "Login"
        }).then(() => {
            window.location.href = "login.html";
        });
    }

    let paymentSuccess = false; 
    let savedBook = null;

    FlutterwaveCheckout({
        public_key: window.ENV.FLW_PUBLIC_KEY,
        tx_ref: `HB-${Date.now()}`,
        amount: price,
        currency: "NGN",

        customer: {
            email: user.email,
            name: user.email
        },

        /* PAYMENT CALLBACK */
        callback: async function (response) {
            if (response.status === "successful") {

                paymentSuccess = true;  
                savedBook = { title, author, desc, thumb, price };

                /* Save purchase to Supabase */
                await supabase.from("helbrains_purchases").insert({
                    user_id: user.id,
                    book_title: title,
                    book_author: author,
                    thumbnail: thumb,
                    description: desc,
                    price: price,
                });

                /* Send email */
                sendReceiptEmail(
                    {
                        title,
                        author,
                        price,
                        description: desc,
                        thumbnail: thumb
                    },
                    user.email
                );
                console.log("Sending to email:", user.email);

            }
        },

        /* CLOSE EVENT — show SweetAlert AFTER Flutterwave finishes */
        onclose: function () {
            hideLoader();
            if (paymentSuccess && savedBook) {
                Swal.fire({
                    icon: "success",
                    title: "Payment Successful and Email sent!",
                    html: `
                        <p style="margin-top:8px;margin-bottom:14px;">
                            <strong>${savedBook.title}</strong> has been added to your library. A receipt has been sent to your email.
                        </p>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Go to Dashboard",
                    cancelButtonText: "Buy More Books",
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "dashboard.html";
                    } else {
                        window.location.href = "#";
                    }
                });
            }
            else{
                Swal.fire({
                    title: `FAILED`,
                    text: "Your payment was not completed.",
                    icon: "error",
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        },

        customizations: {
            title: "HelBrains Books",
            description: `Purchase: ${title}`,
            logo: "../images/logo.png"
        }
    });

};

/* AUTO-SEARCH FROM URL when clicked "Find Similar button" */
const params = new URLSearchParams(window.location.search);
const autoSearch = params.get("search");

document.addEventListener("DOMContentLoaded", async () => {
    if (autoSearch) {
        searchInput.value = autoSearch;
        currentQuery = autoSearch;
        currentPage = 1;

        const books = await fetchBooks(autoSearch, currentPage);
        allBooks = books;
        renderBooks();
        pageNumber.textContent = `Page ${currentPage}`;
        return;
    }

    // Load default if no auto-search
    const defaultBooks = await fetchBooks("technology books");
    allBooks = defaultBooks;
    renderBooks();
});

