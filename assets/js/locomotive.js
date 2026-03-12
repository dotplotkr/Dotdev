/**
 * Locomotive Scroll - 공통 초기화 (전체 페이지)
 * [data-scroll-container] 있는 페이지에서만 동작
 */
(function() {
    function initLocomotive() {
        if (typeof LocomotiveScroll === 'undefined') return null;

        var container = document.querySelector('[data-scroll-container]');
        if (!container) return null;

        var locomotiveScroll = new LocomotiveScroll({
            el: container,
            smooth: true
        });

        if (typeof ScrollTrigger !== 'undefined') {
            locomotiveScroll.on('scroll', ScrollTrigger.update);
            ScrollTrigger.addEventListener('refresh', function() {
                if (locomotiveScroll.update) locomotiveScroll.update();
            });
        }

        return locomotiveScroll;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.locomotiveScroll = initLocomotive();
        });
    } else {
        window.locomotiveScroll = initLocomotive();
    }
})();
