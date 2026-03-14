/**
 * 언택 포트폴리오 - 좌측 미디어 / 우측 클릭 컨트롤 연동
 */
document.addEventListener('DOMContentLoaded', function() {
    var viewer = document.getElementById('untagViewer');
    var imgEl = document.getElementById('untagMediaImage');
    var videoEl = document.getElementById('untagMediaVideo');
    var youtubeEl = document.getElementById('untagMediaYoutube');
    var placeholder = document.getElementById('untagMediaPlaceholder');
    var navItems = document.querySelectorAll('.untag-nav-item');
    var sidebar = document.querySelector('.untag-sidebar');
    var toggleBtn = document.getElementById('sidebarToggle');

    if (!viewer || !navItems.length) return;

    function updateCategoryBadge(category) {
        var subList = category.querySelector('.untag-nav-sub');
        var items = subList ? subList.querySelectorAll('li') : [];
        var activeIndex = -1;
        items.forEach(function(li, i) {
            if (li.classList.contains('active')) activeIndex = i;
        });
        var badge = category.querySelector('.untag-nav-badge');
        var displayCurrent = activeIndex >= 0 ? activeIndex + 1 : items.length;  /* 미클릭시 꽉찬 숫자 */
        if (badge) {
            badge.textContent = displayCurrent + ' / ' + items.length;
        }
        return { activeIndex: activeIndex, total: items.length };
    }

    function updateSidebarCount() {
        var categories = document.querySelectorAll('.untag-nav-category');
        var allItems = [];
        categories.forEach(function(cat) {
            var subList = cat.querySelector('.untag-nav-sub');
            var items = subList ? subList.querySelectorAll('li') : [];
            items.forEach(function(li) { allItems.push(li); });
        });
        var totalCount = allItems.length;
        var globalIndex = 0;
        allItems.forEach(function(li, i) {
            if (li.classList.contains('active')) globalIndex = i + 1;
        });
        if (globalIndex === 0) globalIndex = totalCount;  /* 미선택시 꽉찬 숫자 */
        categories.forEach(function(cat) { updateCategoryBadge(cat); });
        var countEl = document.querySelector('.untag-sidebar-count');
        if (countEl) countEl.textContent = globalIndex + ' / ' + totalCount;
    }

    var sliderEl = document.getElementById('untagImageSlider');
    var sliderThumbsEl = document.getElementById('untagSliderThumbs');
    var currentImages = [];
    var currentSlideIndex = 0;
    var activeNavItem = null; /* 현재 선택된 nav item ( meta 업데이트용 ) */

    function renderSlider(images, navItem) {
        if (!sliderThumbsEl || !sliderEl) return;
        sliderThumbsEl.innerHTML = '';
        currentImages = images || [];
        currentSlideIndex = 0;
        activeNavItem = navItem || document.querySelector('.untag-nav-item.active');
        if (currentImages.length <= 1) {
            sliderEl.style.display = 'none';
            if (activeNavItem && currentImages.length === 1) {
                var meta = activeNavItem.querySelector('.untag-nav-item-meta');
                if (meta) meta.textContent = '1 / 1';
            }
            return;
        }
        sliderEl.style.display = 'flex';
        currentImages.forEach(function(src, i) {
            var thumb = document.createElement('button');
            thumb.type = 'button';
            thumb.className = 'untag-slider-thumb' + (i === 0 ? ' active' : '');
            thumb.setAttribute('data-index', i);
            thumb.setAttribute('aria-label', '이미지 ' + (i + 1) + ' 보기');
            var img = document.createElement('img');
            img.src = src;
            img.alt = '';
            thumb.appendChild(img);
            thumb.addEventListener('click', function() {
                goToSlide(parseInt(this.getAttribute('data-index'), 10));
            });
            sliderThumbsEl.appendChild(thumb);
        });
        updateSliderUI();
    }

    function goToSlide(index) {
        if (index < 0 || index >= currentImages.length) return;
        currentSlideIndex = index;
        imgEl.src = currentImages[index];
        updateSliderUI();
    }

    function updateSliderUI() {
        if (!sliderThumbsEl) return;
        var thumbs = sliderThumbsEl.querySelectorAll('.untag-slider-thumb');
        thumbs.forEach(function(thumb, i) {
            thumb.classList.toggle('active', i === currentSlideIndex);
        });
        var activeThumb = thumbs[currentSlideIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        }
        if (activeNavItem && currentImages.length > 0) {
            var meta = activeNavItem.querySelector('.untag-nav-item-meta');
            if (meta) meta.textContent = (currentSlideIndex + 1) + ' / ' + currentImages.length;
        }
    }

    function showMedia(type, src, poster, images) {
        imgEl.style.display = 'none';
        imgEl.classList.remove('active');
        videoEl.style.display = 'none';
        videoEl.classList.remove('active');
        if (youtubeEl) { youtubeEl.style.display = 'none'; youtubeEl.classList.remove('active'); }
        placeholder.style.display = 'none';
        if (sliderEl) sliderEl.style.display = 'none';

        if (!src && !images) {
            placeholder.style.display = 'flex';
            placeholder.querySelector('img').src = '/assets/img/index/main-pf-4.png';
            return;
        }

        if (type === 'youtube') {
            if (youtubeEl) {
                youtubeEl.src = src;
                youtubeEl.style.display = 'block';
                youtubeEl.classList.add('active');
            }
            if (videoEl.src) { videoEl.pause(); videoEl.src = ''; }
        } else if (type === 'video') {
            videoEl.src = src;
            videoEl.poster = poster || '';
            videoEl.style.display = 'block';
            videoEl.classList.add('active');
            try { videoEl.play(); } catch (e) {}
            if (youtubeEl) youtubeEl.src = '';
        } else {
            var imgList = images && images.length ? images : (src ? [src] : []);
            if (imgList.length) {
                imgEl.src = imgList[0];
                imgEl.style.display = 'block';
                imgEl.classList.add('active');
                var navItem = document.querySelector('.untag-nav-item.active');
                renderSlider(imgList, navItem);
            }
            if (videoEl.src) { videoEl.pause(); videoEl.src = ''; }
            if (youtubeEl) youtubeEl.src = '';
        }
    }

    function getMediaData(item) {
        var type = item.getAttribute('data-media-type') || 'image';
        var src = item.getAttribute('data-media-src') || '';
        var imagesAttr = item.getAttribute('data-media-images');
        var images = imagesAttr ? imagesAttr.split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [];
        if (!images.length && src) images = [src];
        return { type: type, src: src, images: images, poster: item.getAttribute('data-media-poster') || '' };
    }

    var activeItem = document.querySelector('.untag-nav-item.active');
    if (activeItem) {
        var d = getMediaData(activeItem);
        var s = d.src;
        if (d.type === 'youtube' && d.src) {
            var startSec = activeItem.getAttribute('data-media-start');
            if (startSec !== null) {
                var sep = d.src.indexOf('?') >= 0 ? '&' : '?';
                s = d.src + sep + 'autoplay=1&start=' + startSec;
            }
        }
        showMedia(d.type, s, d.poster, d.images);
    }

    document.querySelector('.untag-slider-prev') && document.querySelector('.untag-slider-prev').addEventListener('click', function() {
        goToSlide(currentSlideIndex - 1);
    });
    document.querySelector('.untag-slider-next') && document.querySelector('.untag-slider-next').addEventListener('click', function() {
        goToSlide(currentSlideIndex + 1);
    });

    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var d = getMediaData(this);
            var src = d.src;

            navItems.forEach(function(i) { i.classList.remove('active'); });
            this.classList.add('active');

            if (d.type === 'youtube' && src) {
                var startSec = this.getAttribute('data-media-start');
                if (startSec !== null) {
                    var sep = src.indexOf('?') >= 0 ? '&' : '?';
                    src = src + sep + 'autoplay=1&start=' + startSec;
                }
            }
            showMedia(d.type, src, d.poster, d.images);
            updateSidebarCount();
        });
    });

    updateSidebarCount();

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('collapsed');
            toggleBtn.querySelector('svg').style.transform = sidebar.classList.contains('collapsed') ? 'rotate(-90deg)' : '';
        });
    }

    document.querySelectorAll('.untag-nav-category-toggle').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var category = this.closest('.untag-nav-category');
            if (category) category.classList.toggle('collapsed');
        });
    });
    document.querySelectorAll('.untag-nav-category-head').forEach(function(head) {
        head.addEventListener('click', function(e) {
            if (e.target.closest('.untag-nav-category-toggle')) return;
            var category = this.closest('.untag-nav-category');
            if (category) category.classList.toggle('collapsed');
        });
    });
});
