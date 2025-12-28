// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const minValueInput = document.getElementById('min-value');
    const maxValueInput = document.getElementById('max-value');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultNumber = document.getElementById('result-number');
    const historyNumbers = document.getElementById('history-numbers');
    const totalGenerated = document.getElementById('total-generated');
    const averageValue = document.getElementById('average-value');
    const lastTime = document.getElementById('last-time');
    
    // Переменные состояния
    let history = [];
    let totalCount = 0;
    let sumValues = 0;
    
    // Инициализация
    updateStats();
    loadFromLocalStorage();
    
    // Валидация полей ввода
    minValueInput.addEventListener('input', function() {
        const min = parseInt(this.value) || 0;
        const max = parseInt(maxValueInput.value) || 100;
        
        if (min >= max) {
            this.value = max - 1;
        }
    });
    
    maxValueInput.addEventListener('input', function() {
        const min = parseInt(minValueInput.value) || 0;
        const max = parseInt(this.value) || 100;
        
        if (max <= min) {
            this.value = min + 1;
        }
    });
    
    // Генерация случайного числа
    generateBtn.addEventListener('click', function() {
        const min = parseInt(minValueInput.value) || 0;
        const max = parseInt(maxValueInput.value) || 100;
        
        if (min >= max) {
            alert('Минимальное значение должно быть меньше максимального');
            return;
        }
        
        // Анимация кнопки
        this.classList.add('active');
        setTimeout(() => {
            this.classList.remove('active');
        }, 300);
        
        // Генерация случайного числа
        const randomNum = generateRandomNumber(min, max);
        
        // Анимация результата
        animateNumber(randomNum);
        
        // Обновление истории
        addToHistory(randomNum);
        
        // Обновление статистики
        updateStats();
        
        // Сохранение в LocalStorage
        saveToLocalStorage();
    });
    
    // Очистка истории
    clearBtn.addEventListener('click', function() {
        if (history.length === 0) {
            return; // Нечего очищать
        }
        
        // Анимация кнопки
        this.classList.add('active');
        setTimeout(() => {
            this.classList.remove('active');
        }, 300);
        
        // Подтверждение очистки
        if (confirm('Вы уверены, что хотите очистить историю генераций?')) {
            history = [];
            totalCount = 0;
            sumValues = 0;
            
            updateHistoryDisplay();
            updateStats();
            saveToLocalStorage();
        }
    });
    
    // Функция генерации случайного числа
    function generateRandomNumber(min, max) {
        // Криптографически безопасная генерация
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const random = randomBuffer[0] / (0xFFFFFFFF + 1);
        
        return Math.floor(random * (max - min + 1)) + min;
    }
    
    // Функция анимации числа
    function animateNumber(finalNumber) {
        const duration = 800; // Длительность анимации в мс
        const steps = 20;
        const stepDuration = duration / steps;
        let currentStep = 0;
        
        const min = parseInt(minValueInput.value) || 0;
        const max = parseInt(maxValueInput.value) || 100;
        
        // Показываем анимацию счета
        const interval = setInterval(() => {
            currentStep++;
            
            if (currentStep >= steps) {
                resultNumber.textContent = finalNumber.toLocaleString();
                clearInterval(interval);
                
                // Добавляем эффект "пульсации"
                resultNumber.classList.add('pulse');
                setTimeout(() => {
                    resultNumber.classList.remove('pulse');
                }, 300);
            } else {
                // Показываем промежуточное случайное число
                const tempRandom = generateRandomNumber(min, max);
                resultNumber.textContent = tempRandom.toLocaleString();
            }
        }, stepDuration);
    }
    
    // Функция добавления в историю
    function addToHistory(number) {
        history.unshift(number);
        totalCount++;
        sumValues += number;
        
        // Ограничиваем историю 10 последними значениями
        if (history.length > 10) {
            history.pop();
        }
        
        updateHistoryDisplay();
        updateLastTime();
    }
    
    // Функция обновления отображения истории
    function updateHistoryDisplay() {
        historyNumbers.innerHTML = '';
        
        history.forEach(num => {
            const historyEl = document.createElement('div');
            historyEl.className = 'history-number';
            historyEl.textContent = num.toLocaleString();
            historyNumbers.appendChild(historyEl);
        });
        
        // Если история пуста, показываем сообщение
        if (history.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'history-empty';
            emptyMsg.textContent = 'История пуста';
            historyNumbers.appendChild(emptyMsg);
        }
    }
    
    // Функция обновления статистики
    function updateStats() {
        totalGenerated.textContent = totalCount.toLocaleString();
        
        if (totalCount > 0) {
            const avg = Math.round(sumValues / totalCount);
            averageValue.textContent = avg.toLocaleString();
        } else {
            averageValue.textContent = '0';
        }
    }
    
    // Функция обновления времени последней генерации
    function updateLastTime() {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        lastTime.textContent = timeString;
    }
    
    // Функция сохранения в LocalStorage
    function saveToLocalStorage() {
        const data = {
            history: history,
            totalCount: totalCount,
            sumValues: sumValues,
            minValue: minValueInput.value,
            maxValue: maxValueInput.value,
            lastTime: lastTime.textContent
        };
        
        localStorage.setItem('randomGeneratorData', JSON.stringify(data));
    }
    
    // Функция загрузки из LocalStorage
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('randomGeneratorData');
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                history = data.history || [];
                totalCount = data.totalCount || 0;
                sumValues = data.sumValues || 0;
                
                if (data.minValue) minValueInput.value = data.minValue;
                if (data.maxValue) maxValueInput.value = data.maxValue;
                if (data.lastTime) lastTime.textContent = data.lastTime;
                
                updateHistoryDisplay();
                updateStats();
            } catch (e) {
                console.error('Ошибка загрузки данных:', e);
            }
        }
    }
    
    // Имитация "живого" обновления статуса
    setInterval(() => {
        const statusIndicator = document.querySelector('.status-indicator');
        statusIndicator.classList.toggle('active');
        
        // Случайное изменение цвета индикатора
        const colors = ['#00c853', '#00d4ff', '#ff9800'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        statusIndicator.style.background = randomColor;
    }, 5000);
});