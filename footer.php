 <!--================================
        FOOTER START
    =================================-->
    <footer class="footer" id="footer">
      <div class="footer-container">
        <div class="xs_pt_80 sm_pt_80" style="padding-top: 120px !important;">
          <div class="container">
            <div class="row">
              <div class="col-lg-4">
                <div
                  class="footer_section_content fade_right". data-trigerId="footer" data-stagger=".25" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px); opacity: 1;">
                  <div class="icon">
                    <div class="icon-contianer">
                      <img src="images/linkedin.svg" alt="Helen Okereke" class="img-fluid w-100 svg" /> 
                    </div>
                  </div>
                  <div class="text">
                    <h3>Connect with me</h3>
                     <a href="https://www.linkedin.com/in/helen-okereke-432323205">Helen Okereke on LinkedIn</a>
                    <a href="https://x.com/helen_codeadict">Helen Codeadict on X</a>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div
                  class="footer_section_content fade_right" data-trigerId="footer" data-stagger=".25" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px); opacity: 1;">
                  <div class="icon">
                    <div class="icon-contianer">
                      <img src="images/youtube.svg" alt="Helen Okereke" class="img-fluid w-100 svg" />
                    </div>
                  </div>
                  <div class="text">
                    <h3>Subscribe now</h3>
                    <a href="https://youtube.com/@helen_codeaddict">Helen Codeadict</a>
                    <p>Watch my tech contents</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div
                  class="footer_section_content fade_right" data-trigerId="footer" data-stagger=".25" style="translate: none; rotate: none; scale: none; transform: translate(0px, 0px); opacity: 1;">
                  <div class="icon">
                    <div class="icon-contianer">
                      <img src="images/email.svg" alt="Helen Okereke" class="img-fluid w-100 svg" />
                    </div>
                  </div>
                  <div class="text">
                    <h3>Email me</h3>
                    <a href="mailto:helen.okereke@lguard.tech"
                      >helen.okereke@lguard.tech</a>
                    
                    <a href="mailto:okerekehelenugoeze@gmail.com">okerekehelenugoeze@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-center" style="margin-top: 75px; border-top: 1px solid rgba(255, 255, 255, 0.067); padding: 35px 0px;">
                  <p>© 2023 Helen. All Rights Reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>


    <div class="video-overlay" id="videoOverlay">
  <div class="video-container">
    <button class="close-video" id="closeVideo">&times;</button>

    <iframe id="youtubeFrame" width="100%" height="100%" src="" title="YouTube video player" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
    ></iframe>
  </div>
</div>


    <script src="script.js"></script>
     <!-- jQuery 3.6.0 -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Bootstrap 5.3.3 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
document.addEventListener("DOMContentLoaded", () => {
  const headerForm = document.querySelector(
    'form[aria-label="Contact form"]'
  );

  if (!headerForm) return;

  headerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = headerForm.querySelector('input[name="your-name"]').value.trim();
    const email = headerForm.querySelector('input[name="your-email"]').value.trim();
    const message = headerForm.querySelector('textarea[name="your-subject"]').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    const submitBtn = headerForm.querySelector(".submit_btn");
    const spinner = headerForm.querySelector(".wpcf7-spinner");

    submitBtn.disabled = true;
    submitBtn.value = "Sending...";

    if (spinner) spinner.style.display = "inline-block";

    try {
      const response = await fetch("/send-mail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: "", // header form has no phone
          message: message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Message sent!",
          text: "Thanks for reaching out. I’ll get back to you shortly.",
        });

        headerForm.reset();
      } else {
        throw new Error(result.error || "Mail sending failed");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Could not send your message. Please try again later.",
      });
    } finally {
      submitBtn.disabled = false;
      submitBtn.value = "Send Message";

      if (spinner) spinner.style.display = "none";
    }
  });
});

document.getElementById("newsletterForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔥 VERY IMPORTANT

  const emailInput = document.getElementById("newsletterEmail");
  const email = emailInput.value.trim();

  if (!email) {
    Swal.fire({
      icon: "warning",
      title: "Missing email",
      text: "Please enter your email address."
    });
    emailInput.focus();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid email",
      text: "Please enter a valid email address."
    });
    emailInput.focus();
    return;
  }

  try {
    const response = await fetch("/newsletter.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ email })
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Subscribed!",
        text: data.message || "You have been added to the newsletter."
      });
      emailInput.value = "";
    } else {
      Swal.fire({
        icon: "error",
        title: "Subscription failed",
        text: data.message || "Please try again."
      });
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Network error",
      text: "Please try again later."
    });
  }
});

</script>

</body>

   
   
</html>