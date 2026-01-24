<?php include 'header.php'; ?>


 <section class="projects_breadcrumb banner" style="background: url(images/trainings/devfest2.webp)">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="projects_breadcrum_text">
              <h1>Reach out to me!</h1>
              <ul class="page-breadcrumb">
                <li>
                  <a href="index" class="text_hover_animaiton">Home</a>
                </li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

<section class="contact_me" id="counter">
      <div class="container">
        <div class="row">
          <div class="col-xl-6 col-lg-6">
            <div class="contact_me_text">
              <h2 data-animate="up" data-delay="100">Reach <span>For Speaker Invite</span></h2>
              <p class="" data-animate="up" data-delay="200">
                I’m always open to conversations around technology, innovation, social impact, and collaboration. Whether you’re looking to discuss a project, explore a partnership, invite me to speak, or simply connect, feel free to reach out. I believe great ideas grow faster through shared perspectives and purposeful dialogue.
              </p>
            </div>
            <div class="row">
              <div class="col-xl-6 col-md-6" data-animate="left" data-delay="250">
                <div
                  class="contact_me_counter fade_left"
                  data-trigerId="counter"
                >
                  <span class="icon">
                    <img
                      src="images/events.svg"
                      alt="counter"
                      class="svg img-fluid w-100"
                    />
                  </span>
                  <h3><span class="counter">50</span>+</h3>
                  <p>Speaking Engagements</p>
                </div>
              </div>
              <div class="col-xl-6 col-md-6">
                <div
                  class="contact_me_counter fade_left"
                  data-trigerId="counter"
                >
                  <span class="icon">
                    <img
                      src="images/people.svg"
                      alt="counter"
                      class="img-fluid w-100 svg"
                    />
                  </span>
                  <h3><span class="counter">10,000</span>+</h3>
                  <p>Young people reached</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6" data-animate="right" data-delay="250">
            <div class="contact_me_form">
              <h2 class="has-animation" data-animate="up" data-delay="300">GET IN TOUCH?</h2>
              <p class="" data-animate="up" data-delay="350">
                Let's work together! Fill out the form below to send me a message, and I'll get back to you as soon as possible.
              </p>
              <form id="contactForm">
                <input type="text" name="name" id="name" placeholder="Your Name" required />
                <input type="email" name="email" id="email" placeholder="Your Email" required />
                <input type="text" name="phone" id="phone" placeholder="Phone Number" />
                <textarea name="message" id="message" rows="4" placeholder="Message" required></textarea>

                <button type="submit" class="cv_btn" id="submitBtn">submit now</button>
                </form>

            </div>
          </div>
        </div>
      </div>
    </section>

    <script>
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  function isValidEmail(email) {
    // Simple, reliable email validation for frontend
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email.trim());
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      Swal.fire({
        icon: "error",
        title: "Missing fields",
        text: "Please fill in your name, email, and message.",
      });
      return;
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Disable button while sending
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    try {
      const res = await fetch("send-mail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Message sent!",
          text: "Thanks for reaching out. I’ll get back to you within 24hrs.",
        });
        form.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Message not sent",
          text: data.error || "Please try again later.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Network error",
        text: "Could not send your message. Please try again.",
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
</script>

<?php include 'footer.php'; ?>