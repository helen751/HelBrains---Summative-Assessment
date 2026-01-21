// Featured Books logic
import { truncateText, generateStars, formatPrice } from './utils.js';
import { showLoader, hideLoader } from './utils.js';

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export async function fetchFeaturedBooks() {
    showLoader();
    const queries = [
        "bestseller books",
        "top rated books",
        "award winning books"
    ];

    let all = [];

    // Fetch from three reliable queries
    for (let q of queries) {
        const url = `${BASE_URL}?q=${encodeURIComponent(q)}&maxResults=20`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items) {
            all.push(...data.items);
        }
    }

    // Filter strictly for books with complete data
    let books = all
        .map(item => item.volumeInfo)
        .filter(info =>
            info &&
            info.title &&
            info.authors &&
            info.imageLinks?.thumbnail
        )
        .map(info => ({
            title: info.title,
            author: info.authors.join(", "),
            thumbnail: info.imageLinks.thumbnail,
            description: info.description || "No description available.",
            rating: info.averageRating || 0,
            category: info.categories ? info.categories[0] : "N/A",
            year: info.publishedDate ? info.publishedDate.substring(0, 4) : "N/A"
        }));

    // Sort by rating
    books.sort((a, b) => b.rating - a.rating);

    // Get top 6 books
    const top6 = books.slice(0, 6);

    // Final output
    return top6.map(b => ({
        title: b.title,
        author: b.author,
        thumbnail: b.thumbnail,
        description: truncateText(b.description, 30),
        rating: b.rating,
        stars: generateStars(b.rating),
        price: formatPrice(b.rating, b.year),
        category: b.category,
        year: b.year
    }), hideLoader());
    
}
