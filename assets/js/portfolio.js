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

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Category filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');

            portfolioCards.forEach(function(card) {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
});
