# HelBrains — Summative Assessment Project  
A complete full‑stack bookstore web application built for ALU’s Summative Assessment.  
This project demonstrates **Use of Multiple APIs, User authentication, payment processing, database CRUD, CI/CD deployment, and responsive UI development**.

## <a href="https://youtu.be/qklAhbgncY8">Watch Demo Video</a>
## <a href="https://helenbot.tech">Visit website via the Load balancer</a>
---

## 🚀 Project Overview  
HelBrains is an online bookstore where users can:

### ✅ Search Books  
- Books are fetched via **Google Books API**.  
- Real‑time search, pagination, filtering (title, year), and computed pricing (based on my logic).

### ✅ User Authentication  
Implemented using **Supabase Auth**  
- Email/password login & registration  
- Google OAuth login  
- Automatic profile sync into custom table `helbrains_users`  
  - Extracts Google full name → firstname/lastname  
  - Inserts new Google users into your custom table

### ✅ Book Purchasing  
- Payments powered by **Flutterwave API** (Test Mode).  
- Successful purchase triggers:
  - Database insert into `helbrains_purchases`
  - Automatic email receipt via **HelBrains Email API (EMAIL.JS)**
  - Dashboard purchase update

### ✅ Dashboard  
A fully responsive UI that shows:
- Total spent  
- Total number of books purchased  
- Last login  
- Complete purchase history  
- Editable profile section  

### ✅ CI/CD Deployment  
Deployment pipeline automatically pulls updates on:  
- **web01**  
- **web02**  

Using:  
- GitHub Webhooks  
- `webhook` service on each server  
- Auto‑sync into `/var/www/helbrains`  
- Nginx serving production build  

---

## 🗂 Folder Structure
```
HelBrains---Summative-Assessment
│
├── config/
│   └── env.js
│
├── css/
│   ├── auth.css
│   ├── components.css
│   ├── dashboard.css
│   ├── global.css
│   ├── responsive.css
│   └── shop.css
│
├── images/
│
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── email.js
│   ├── session.js
│   ├── shop.js
│   ├── supabase.js
│   └── utils.js
│
├── dashboard.html
├── index.html
├── login.html
├── register.html
└── shop.html
```

---

## 🔧 Technologies Used

### **Frontend**
- HTML5  
- CSS3 (Responsive Design)  
- Vanilla JavaScript (ES6 Modules)
- Caching: Caches API repsonse from Google books locally in an array, so next, does not make a new request.

### **Backend / Services**
- **Supabase Auth API** – User authentication  
- **Supabase Database** – `helbrains_users`, `helbrains_purchases`  
- **Google Auth API** – Allows the user `Login/Signup with google` and return their details. 
- **Google Books API** – Book fetching  
- **Flutterwave API** – Payment gateway  
- **EmailJS API** – Sends order receipts  
- **Webhook CI/CD** – Auto deploy to servers  

### **Infrastructure**
- Nginx  
- Ubuntu 22.04  
- GitHub Webhooks  
- Systemd Webhook Service  
- Load‑balanced multi‑server setup (Load balance between web serve 1 and 2) 

---

## 🧩 API Endpoints Used

### **Google Books API**
```
GET https://www.googleapis.com/books/v1/volumes?q=<query>&maxResults=40
```

### **Supabase REST Queries**
#### Users
- Insert:
```
POST /rest/v1/helbrains_users
```
- Fetch:
```
GET /rest/v1/helbrains_users?id=eq.<user_id>
```

#### Purchases
- Insert:
```
POST /rest/v1/helbrains_purchases
```
- Fetch:
```
GET /rest/v1/helbrains_purchases?user_id=eq.<user_id>
```

### **Email API**
```
URL https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js
```

### **Flutterwave Checkout**
```
FlutterwaveCheckout({...})
```

---

## 💳 How to Make a Test Payment

HelBrains uses **Flutterwave Test Mode**.

### **Option 1: Pay with USSD (Recommended)**
1. Select **USSD**  
2. Choose any bank (e.g., GTBank, Access Bank)  
3. A code will be shown  
4. Click **"I have paid"**  
5. Payment will be marked *successful*  

### **Option 2: Use Test Card**
Use Flutterwave default test card:

| Field | Value |
|-------|-------|
| Card Number | **5531 8866 5214 2950** |
| CVV | **564** |
| Expiry | **09/32** |
| PIN | **3310** |
| OTP | **12345** |

---

## 🛠 CI/CD Deployment Setup

### **GitHub → Web01 & Web02 (Auto Deploy)**

#### 1. Webhook URL on GitHub
```
http://<server-ip>:9000/hooks/deploy-helbrains
```

#### 2. `hooks.json`
Located at:
```
/var/www/helbrains/deploy/hooks.json
```

Runs:
```bash
cd /var/www/helbrains &&
git pull &&
echo "Deployment complete"
```

#### 3. systemd service `/etc/systemd/system/webhook.service`
Starts webhook listener at port **9000**.

#### 4. Nginx serving the app:
```
root /var/www/helbrains;
```

---

## 🏗 How to Run Locally

### 1. Clone Repo
```bash
git clone https://github.com/helen751/HelBrains---Summative-Assessment
cd HelBrains---Summative-Assessment
```

### 2. Create `config/env.js (included on my submisison comment)`
```
export const ENV = {
    SUPABASE_URL: "",
    SUPABASE_KEY: "",
    FLW_PUBLIC_KEY: "",
    EMAIL_API_URL: ""
};
```

### 3. Open `index.html` in any static web server:
```bash
npx serve .
```

---

## 🙋‍♀️ Developer  
**Helen Ugoeze Okereke**  
Software Engineer · Educator · IoT & Robotics Builder  (Student at ALU Rwanda) 


## 🙏 Credits & Acknowledgements

### 📚 Google Books API
Used to fetch live book data, thumbnails, authors, and metadata.  
**Documentation:** https://developers.google.com/books/docs/v1/using  
**Credits:** Google Developers Team

---

### 🔐 Supabase Authentication & Database
Used for user authentication (Email/Password + Google OAuth), and for storing users and purchase history.  
**Documentation:** https://supabase.com/docs  
**Credits:** Supabase Team

---

### 💳 Flutterwave Payment Gateway
Used to process secure test-mode payments for digital book purchases.  
**Documentation:** https://developer.flutterwave.com  
**Credits:** Flutterwave Inc.


---

### 📧 EmailJS API
Used for sending order confirmation and receipt emails directly from a configured template.  
**Documentation:** https://www.emailjs.com/docs/  
**Credits:** EmailJS Engineering Team


---

### ⚙️ GitHub Webhooks (CI/CD Automation)
Used to automate deployments to multiple servers on each Git push event.  
**Documentation:** https://docs.github.com/en/webhooks  
**Credits:** GitHub, Inc.


