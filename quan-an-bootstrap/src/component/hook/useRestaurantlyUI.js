// src/hooks/useRestaurantlyUI.ts (hoặc .js nếu không dùng TypeScript)

import { useEffect } from "react";
import AOS from "aos";
import GLightbox from "glightbox";
import Isotope from "isotope-layout";
import Swiper from "swiper";
import imagesLoaded from "imagesloaded";

export const useRestaurantlyUI = () => {
    useEffect(() => {
        // 1. Scrolled class
        const toggleScrolled = () => {
            const body = document.body;
            const header = document.querySelector("#header");
            if (!header) return;
            if (
                !header.classList.contains("scroll-up-sticky") &&
                !header.classList.contains("sticky-top") &&
                !header.classList.contains("fixed-top")
            )
                return;
            window.scrollY > 100
                ? body.classList.add("scrolled")
                : body.classList.remove("scrolled");
        };
        toggleScrolled();
        document.addEventListener("scroll", toggleScrolled);
        window.addEventListener("load", toggleScrolled);

        // 2. Mobile nav toggle
        const toggleBtn = document.querySelector(".mobile-nav-toggle");
        const toggleMobileNav = () => {
            document.body.classList.toggle("mobile-nav-active");
            toggleBtn?.classList.toggle("bi-list");
            toggleBtn?.classList.toggle("bi-x");
        };
        toggleBtn?.addEventListener("click", toggleMobileNav);

        // 3. Hide mobile nav on link click
        document.querySelectorAll("#navmenu a").forEach((el) => {
            el.addEventListener("click", () => {
                if (document.querySelector(".mobile-nav-active")) {
                    toggleMobileNav();
                }
            });
        });

        // 4. Preloader
        const preloader = document.querySelector("#preloader");
        if (preloader) {
            window.addEventListener("load", () => preloader.remove());
        }

        // 5. Scroll top
        const scrollTop = document.querySelector(".scroll-top");
        const toggleScrollTop = () => {
            if (!scrollTop) return;
            window.scrollY > 100
                ? scrollTop.classList.add("active")
                : scrollTop.classList.remove("active");
        };
        scrollTop?.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        toggleScrollTop();
        document.addEventListener("scroll", toggleScrollTop);
        window.addEventListener("load", toggleScrollTop);

        // 6. AOS init
        AOS.init({
            duration: 600,
            easing: "ease-in-out",
            once: true,
            mirror: false,
        });

        // 7. GLightbox init
        GLightbox({ selector: ".glightbox" });

        // 8. Isotope init
        document.querySelectorAll(".isotope-layout").forEach((layout) => {
            const container = layout.querySelector(".isotope-container");
            if (!container) return;
            const layoutMode = layout.getAttribute("data-layout") || "masonry";
            const filter = layout.getAttribute("data-default-filter") || "*";
            const sort = layout.getAttribute("data-sort") || "original-order";

            imagesLoaded(container, () => {
                const iso = new Isotope(container, {
                    itemSelector: ".isotope-item",
                    layoutMode,
                    filter,
                    sortBy: sort,
                });

                layout.querySelectorAll(".isotope-filters li").forEach((btn) => {
                    btn.addEventListener("click", () => {
                        layout
                            .querySelector(".filter-active")
                            ?.classList.remove("filter-active");
                        btn.classList.add("filter-active");
                        iso.arrange({ filter: btn.getAttribute("data-filter") });
                        AOS.refresh(); // Re-apply animation
                    });
                });
            });
        });

        // 9. Swiper init
        document.querySelectorAll(".init-swiper").forEach((el) => {
            const configTag = el.querySelector(".swiper-config");
            if (!configTag) return;
            const config = JSON.parse(configTag.innerHTML.trim());
            new Swiper(el, config);
        });

        // 10. Scroll spy
        const navlinks = document.querySelectorAll(".navmenu a");
        const navScrollSpy = () => {
            const pos = window.scrollY + 200;
            navlinks.forEach((link) => {
                if (!link.hash) return;
                const section = document.querySelector(link.hash);
                if (
                    section &&
                    pos >= section.offsetTop &&
                    pos <= section.offsetTop + section.offsetHeight
                ) {
                    document.querySelectorAll(".navmenu a.active").forEach((l) =>
                        l.classList.remove("active")
                    );
                    link.classList.add("active");
                }
            });
        };
        navScrollSpy();
        window.addEventListener("scroll", navScrollSpy);
        window.addEventListener("load", navScrollSpy);

        // Cleanup listeners (nếu cần)
        return () => {
            document.removeEventListener("scroll", toggleScrolled);
            document.removeEventListener("scroll", toggleScrollTop);
            window.removeEventListener("load", toggleScrolled);
            window.removeEventListener("load", toggleScrollTop);
        };
    }, []);
};
