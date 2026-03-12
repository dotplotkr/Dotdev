// Loader - 공통 (window load 시 숨김, index/portfolio용)
document.addEventListener('DOMContentLoaded', function() {
    var loader = document.getElementById('progress');
    if (!loader || loader.classList.contains('progress-images')) return;

    function hideLoader() {
        loader.classList.add('hidden');
        setTimeout(function() {
            loader.style.display = 'none';
        }, 300);
    }

    var hideTimeout = setTimeout(hideLoader, 5000);
    window.addEventListener('load', function() {
        clearTimeout(hideTimeout);
        hideLoader();
    });
});
