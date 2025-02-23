document.addEventListener('DOMContentLoaded', function () {
    const bannerContainer = document.getElementById('banner-container');
    const bannerForm = document.getElementById('banner-form');

    // Функция для загрузки баннеров
    function loadBanners() {
        fetch('/banners')
            .then(response => response.json())
            .then(banners => {
                bannerContainer.innerHTML = '';
                banners.forEach(banner => {
                    const img = document.createElement('img');
                    img.src = `images/${banner.image}`;
                    img.alt = `Баннер ${banner.size}`;
                    img.style.width = `${banner.size.split('x')[0]}px`;
                    img.style.height = `${banner.size.split('x')[1]}px`;
                    bannerContainer.appendChild(img);
                });
            });
    }

    // Обработчик формы для добавления баннера
    if (bannerForm) {
        bannerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(bannerForm);
            fetch('/add-banner', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('Баннер добавлен успешно!');
                        loadBanners();
                        bannerForm.reset();
                    } else {
                        alert('Ошибка при добавлении баннера.');
                    }
                });
        });
    }

    // Загрузка баннеров при загрузке страницы
    loadBanners();
});