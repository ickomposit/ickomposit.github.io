// Функция загрузки содержимого страницы без перезагрузки
async function loadPage(page) {
    const container = document.getElementById('pageContent');
    
    container.innerHTML = '<div style="text-align: center; padding: 50px;">Загрузка...</div>';
    
    try {
        const response = await fetch(`pages/${page}.html`);
        
        if (!response.ok) {
            throw new Error('Страница не найдена');
        }
        
        const html = await response.text();
        container.innerHTML = html;
        
        // Выполняем все скрипты, которые есть в загруженном HTML
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            document.body.removeChild(newScript);
        });
        
        const url = new URL(window.location.href);
        url.searchParams.set('page', page);
        window.history.pushState({ page: page }, '', url);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: red;">
                <p>❌ Ошибка загрузки страницы</p>
                <p style="font-size: 14px; margin-top: 10px;">Проверьте, что файл ${page}.html существует в папке pages/</p>
            </div>
        `;
    }
}   

// Определяем текущую страницу из URL
function getCurrentPageFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    // Валидация: только разрешенные страницы
    const allowedPages = ['activity', 'products', 'services'];
    if (page && allowedPages.includes(page)) {
        return page;
    }
    return 'services'; // страница по умолчанию
}

// --- Обработчики для кнопок навигации ---
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем контент в зависимости от URL
    const initialPage = getCurrentPageFromURL();
    loadPage(initialPage);
    
    // Навешиваем обработчики на кнопки навигации
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.getAttribute('data-page');
            if (page) {
                loadPage(page);
            }
        });
    });
});

// Обработка кнопки "назад" в браузере
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        loadPage(event.state.page);
    } else {
        const page = getCurrentPageFromURL();
        loadPage(page);
    }
});

    // Аккордеон для списка ОКВЭД
    const toggleBtn = document.getElementById('okvedToggleBtn');
    const okvedList = document.getElementById('okvedList');
    
    if (toggleBtn && okvedList) {
        // По умолчанию список скрыт
        okvedList.style.display = 'none';
        
        toggleBtn.addEventListener('click', function() {
            const arrow = this.querySelector('.toggle-arrow');
            
            if (okvedList.style.display === 'none') {
                okvedList.style.display = 'block';
                arrow.textContent = '▲';
                arrow.style.transform = 'rotate(0deg)';
            } else {
                okvedList.style.display = 'none';
                arrow.textContent = '▼';
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    }