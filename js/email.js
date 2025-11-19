emailjs.init({
    publicKey: "",
});
export async function sendReceiptEmail(book, email) {
    const templateParams = {
        to_email: email,
        book_title: book.title,
        book_author: book.author,
        book_price: book.price,
        book_description: book.description,
        book_thumbnail: book.thumbnail,
        purchase_date: new Date().toLocaleString(),
        html_content: `
        <div style="max-width:600px;margin:auto;background:#ffffff;padding:20px;border-radius:10px;
        box-shadow:0 4px 12px rgba(0,0,0,0.1);font-family:Inter,Arial;">
            <h2 style="color:#1D4ED8;text-align:center;margin-bottom:20px;">HelBrains Purchase Receipt</h2>

            <img src="${book.thumbnail}" style="width:100%;border-radius:8px;margin-bottom:20px;">

            <h3 style="color:#000;margin-bottom:5px;">${book.title}</h3>
            <p style="color:#555;margin:5px 0;"><strong>Author:</strong> ${book.author}</p>
            <p style="color:#555;margin:5px 0;"><strong>Price:</strong> RWF ${book.price}</p>
            <p style="color:#777;margin-top:15px;line-height:1.6;">${book.description}</p>

            <hr style="margin:20px 0;border:0;border-top:1px solid #ddd;">

            <p style="color:#555;font-size:14px;"><strong>Purchase Date:</strong> ${new Date().toLocaleString()}</p>

            <p style="color:#1D4ED8;text-align:center;margin-top:25px;font-weight:600;">
                Thank you for purchasing from HelBrains Books!
            </p>
        </div>
        `
    };

    emailjs.send("", "", templateParams);
}
