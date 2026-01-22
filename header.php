<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Helen Okereke | Software Engineer, IoT & Tech for Impact</title>

    <meta name="description" content="Helen Okereke is a software engineer and IoT builder working at the intersection of technology, health, and business. Co-founder of L-Guard, Founder of Gozen Robotics Lab, and a leader driving tech-powered impact across Africa." />

    <meta name="keywords" content="Helen Okereke, Software Engineer Africa, IoT Engineer, Health Technology Africa, L-Guard, L-Guard Ltd, CEO L-Guard, Gozen Robotics, Women in Tech, Tech for Impact, African Innovator, Robotics Engineer, Tech in Kigali, WTM Ambassador" />

    <meta name="author" content="Helen Okereke" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Helen Okereke | Software Engineer & Tech for Impact" />
    <meta property="og:description" content="Building technology-driven solutions across health, IoT, and business. Co-founder of L-Guard and Founder of Gozen IT Solutions." />
    <meta property="og:url" content="https://helenbot.tech" />
    <meta property="og:image" content="https://helenbot.tech/images/H1.png" />
    <meta property="og:image:alt" content="Helen Okereke – Software Engineer and IoT Builder" />

    <link rel="icon" type="image/png" sizes="32x32" href="images/licon.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="images/licon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="images/licon.png" />



     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="responsive.css">

    <!-- Font Awesome 6 -->
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Google Fonts: Poppins -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">

</head>

<body class="loading">
    <!-- PRELOADER -->

    <header>
        <nav class="navbar">
            <div class="menu-nav">
                <a class="logo" href="#">
                <img src="images/l.png" alt="Helen Okereke Logo"
                    class="img-fluid w-100">
                </a>

                <button class="navbar-toggler" type="button" id="navbar-toggle" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa-solid fa-bars bar_icon"></i>
                <i class="fa-regular fa-xmark close_icon"></i>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav auto-margin">
                        <li class="nav-item">
                        <a class="nav-link text_hover_animaiton" href="index">Home</a>
                        </li>
                        <li class="menu-item nav-item menu-item-has-children dropdown has-dropdown">
                            <a class="nav-link text_hover_animaiton" href="index#about">About Me</a>

                            <ul class="droap_menu" role="menu">
                                <li class="menu-item nav-item"><a title="Multipage" href="index#about" class="dropdown-items">Student Portfolio</a></li>
                                <li class="menu-item nav-item"><a title="Multipage" href="index#about" class="dropdown-items">Professional Portfolio</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link text_hover_animaiton" href="projects">Projects</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link text_hover_animaiton" href="contact">Contact</a>
                        </li>
                    </ul>

                <span class="toggle_icon c-pointer" id="toggle-sidebar">
                    <i class="fa-solid fa-bars-staggered bar_icon-staggered"></i>
                    
                </span>
                </div>
            </div>
        </nav>

        <!-- The simple sidebar menu/contact form -->
         <div class="sidebar sidebar-end" tabindex="-1" id="Right_sidebar">
            <div class="sidebar-header">
                <a class="sidebar-logo" href="images/l.png">
                <img src="images/l.png" alt="Helen Okereke">
                </a>
                <button type="button" class="btn-close" id="close-sidebar">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="sidebar-body">
                <div class="sidebar_form">
                <div class="sidebar-content-box">
                    <h4 class="sidebar_title">About Me</h4>
                    <p>
                    I build technology that saves lives and expands access across Africa.
                    I’m a software engineer, IoT product builder, and co-founder of L-Guard, a life-saving mobility solution currently piloting with public and private partners across East Africa.
                    </p>
                </div>

                <div class="sidebar_contact_form" id="sidebar_contact_form">
                    <h4 class="sidebar_title">Contact Helen</h4>
                    <div lang="en-US" dir="ltr">
                        <div class="screen-reader-response">
                            <p role="status" aria-live="polite" aria-atomic="true"></p>
                            <ul></ul>
                        </div>
                        <form  method="post" aria-label="Contact form" novalidate="novalidate" data-status="init">

                            <span class="form-label" data-name="your-name">
                            <input size="40" aria-required="true" aria-invalid="false" placeholder="Your Name" value="" type="text" name="your-name">
                            </span>
                            <span class="form-label" data-name="your-email">
                            <input size="40" autocomplete="email" aria-required="true" aria-invalid="false" placeholder="Your Email" value="" type="email" name="your-email">
                            </span>
                            <span class="form-label" data-name="your-subject">
                            <textarea cols="10" rows="5"aria-invalid="false" placeholder="Message" name="your-subject"></textarea>
                            </span>
                            <input class="submit_btn" type="submit" value="Send Message">
                            <span class="wpcf7-spinner"></span>
                            <div class="wpcf7-response-output" aria-hidden="true"></div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
</div>

    </header>