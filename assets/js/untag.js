/**
 * 언택 포트폴리오 - 좌측 미디어 / 우측 클릭 컨트롤 연동
 */
document.addEventListener('DOMContentLoaded', function() {
    var viewer = document.getElementById('untagViewer');
    var imgEl = document.getElementById('untagMediaImage');
    var videoEl = document.getElementById('untagMediaVideo');
    var placeholder = document.getElementById('untagMediaPlaceholder');
    var navItems = document.querySelectorAll('.untag-nav-item');
    var sidebar = document.querySelector('.untag-sidebar');
    var toggleBtn = document.getElementById('sidebarToggle');

    if (!viewer || !navItems.length) return;

    function showMedia(type, src, poster) {
        imgEl.style.display = 'none';
        imgEl.classList.remove('active');
        videoEl.style.display = 'none';
        videoEl.classList.remove('active');
        placeholder.style.display = 'none';

        if (!src) {
            placeholder.style.display = 'flex';
            placeholder.querySelector('img').src = '/assets/img/index/main-pf-4.png';
            return;
        }

        if (type === 'video') {
            videoEl.src = src;
            videoEl.poster = poster || '';
            videoEl.style.display = 'block';
            videoEl.classList.add('active');
            try {
                videoEl.play();
            } catch (e) {}
        } else {
            imgEl.src = src;
            imgEl.style.display = 'block';
            imgEl.classList.add('active');
            if (videoEl.src) {
                videoEl.pause();
                videoEl.src = '';
            }
        }
    }

    // 초기 로드: 활성 아이템 미디어 표시
    var activeItem = document.querySelector('.untag-nav-item.active');
    if (activeItem) {
        var t = activeItem.getAttribute('data-media-type') || 'image';
        var s = activeItem.getAttribute('data-media-src') || '';
        var p = activeItem.getAttribute('data-media-poster') || '';
        showMedia(t, s, p);
    }

    navItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var type = this.getAttribute('data-media-type') || 'image';
            var src = this.getAttribute('data-media-src') || '';
            var poster = this.getAttribute('data-media-poster') || '';

            navItems.forEach(function(i) { i.classList.remove('active'); });
            this.classList.add('active');

            showMedia(type, src, poster);
        });
    });

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            toggleBtn.querySelector('svg').style.transform = sidebar.classList.contains('collapsed') ? 'rotate(-90deg)' : '';
        });
    }
});
