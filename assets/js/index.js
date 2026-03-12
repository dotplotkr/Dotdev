// Loader (imagesLoaded)
document.addEventListener('DOMContentLoaded', function() {
    var container = document.getElementById('progress');
    if (container && container.classList.contains('progress-images') && typeof imagesLoaded !== 'undefined') {
        var imgLoad = imagesLoaded(document.body);
        var imgTotal = imgLoad.images.length;
        var imgLoaded = 0;
        var progressBar = container.querySelector('.progress-bar');
        var progressTimer = setInterval(function() {
            var target = imgTotal > 0 ? (imgLoaded / imgTotal) * 100 : 100;
            if (progressBar) progressBar.style.width = (target + 90) + 'px';
            if (target >= 100) {
                clearInterval(progressTimer);
                container.classList.add('hidden');
                setTimeout(function() {
                    container.style.display = 'none';
                    if (window.locomotiveScroll && window.locomotiveScroll.update) {
                        window.locomotiveScroll.update();
                    }
                }, 800);
            }
        }, 1000 / 60);
        imgLoad.on('progress', function() { imgLoaded++; });
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // GSAP scroll animations (optional enhancement)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.section').forEach(function(section) {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }
});
