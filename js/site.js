// Determine folder depth
function getPathPrefix() {
    const path = window.location.pathname;
    const repoBase = "";
    const pathParts = path
        .replace(repoBase, "")
        .split("/")
        .filter(p => p !== "" && !p.includes(".html"));

    return "../".repeat(pathParts.length);
}

// Highlight active navigation link
function initNavigation() {
    const links = document.querySelectorAll("header .nav-links a");
    const currentPath = window.location.pathname;

    const isMediaPage =
        currentPath.startsWith("/renewables/") ||
        currentPath.startsWith("/efficiency/");

    links.forEach(link => link.classList.remove("active"));

    links.forEach(link => {
        const linkPath = new URL(link.href).pathname;

        // HOME FIX (must be first and strict)
        if (linkPath === "/" && currentPath === "/") {
            link.classList.add("active");
            return;
        }

        // Never allow Home to activate on other pages
        if (linkPath === "/") {
            return;
        }

        // MEDIA GROUP LOGIC
        if (link.classList.contains("dropdown-toggle")) {
            if (isMediaPage) {
                link.classList.add("active");
            }
            return;
        }

        // Prevent Renewables/Efficiency from affecting top nav active state
        if (linkPath === "/renewables/" || linkPath === "/efficiency/") {
            return;
        }

        // Normal page matching
        if (currentPath === linkPath || currentPath.startsWith(linkPath)) {
            link.classList.add("active");
        }
    });
}

// Load header navigation
function loadNav() {
    const prefix = getPathPrefix();

    fetch(prefix + "nav.html")
        .then(res => res.text())
        .then(data => {
            const nav = document.getElementById("nav-placeholder");
            nav.innerHTML = data;

            nav.classList.add("nav-visible");

            initNavigation();
            initMobileMenu();
        })
        .catch(err => console.error(err));
}

// Load footer
function loadFooter() {
    const prefix = getPathPrefix();

    fetch(prefix + "footer.html")
        .then(res => {
            if (!res.ok) throw new Error("Could not load footer");
            return res.text();
        })
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(err => console.error(err));
}

// Header scroll effect
function initHeaderScroll() {
    window.addEventListener("scroll", function () {
        const header = document.querySelector("header");
        if (!header) return;

        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

/* ADD THIS RIGHT HERE — GLOBAL HELPER */
function closeAllNavStates() {
    document.querySelectorAll(".dropdown.open")
        .forEach(d => d.classList.remove("open"));
}

// Unified mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (!hamburger || !navLinks) return;

    // Hamburger click toggles menu
hamburger.addEventListener("click", (e) => {
    e.stopPropagation();

    navLinks.classList.toggle("open");

    if (!navLinks.classList.contains("open")) {
        closeAllNavStates();
        document.body.classList.remove("nav-open");
    } else {
        document.body.classList.add("nav-open");
    }
});

    // Click anywhere outside nav closes it
    document.addEventListener("click", (e) => {
        if (
            navLinks.classList.contains("open") &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            navLinks.classList.remove("open")
            document.body.classList.remove("nav-open");
            closeAllNavStates();
        }
    });

    // Close menu on scroll
    window.addEventListener("scroll", () => {
        if (navLinks.classList.contains("open")) {
            navLinks.classList.remove("open");
            document.body.classList.remove("nav-open");
            closeAllNavStates();
        }
    });

    // Optional: close menu when resizing to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1080) {
            navLinks.classList.remove("open");
            document.body.classList.remove("nav-open");
            closeAllNavStates();
        }
    });
}

document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".dropdown-toggle");

    if (!toggle) return;

    if (window.innerWidth > 1080) return;

    e.preventDefault();

    const dropdown = toggle.closest(".dropdown");

    const isOpen = dropdown.classList.contains("open");

    // close all others first (prevents sticky state bugs)
    document.querySelectorAll(".dropdown.open")
        .forEach(d => d.classList.remove("open"));

    // reopen ONLY if it was closed
    if (!isOpen) {
        dropdown.classList.add("open");
    }

    // If clicking outside → close instantly
    if (!dropdown) {
        document.querySelectorAll(".dropdown.open")
            .forEach(d => d.classList.remove("open"));
    }
});

// Initialize everything
document.addEventListener("DOMContentLoaded", function () {
    loadNav();
    loadFooter();
    initHeaderScroll();
});

function link(path){
    return BASE_PATH + path;
}