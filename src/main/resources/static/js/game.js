document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы DOM
    const playerScore_span = document.getElementById("player-score");
    const botScore_span = document.getElementById("bot-score");
    const result_p = document.getElementById("result-message");
    const choicesContainer = document.getElementById("choices-container");
    const resetButton = document.getElementById("reset-button");

    // Загружаем доступные ходы с сервера
    function loadMoves() {
        fetch('/api/game/moves')
            .then(response => response.json())
            .then(moves => {
                // Очищаем контейнер
                choicesContainer.innerHTML = '';
                
                // Создаем кнопку для каждого хода
                moves.forEach(move => {
                    const moveBtn = document.createElement('button');
                    moveBtn.id = move.name;
                    moveBtn.className = 'choice-btn';
                    moveBtn.textContent = capitalizeFirstLetter(move.name);
                    
                    // Добавляем обработчик событий
                    moveBtn.addEventListener('click', () => game(move.name));
                    
                    // Добавляем кнопку в контейнер
                    choicesContainer.appendChild(moveBtn);
                });
            })
            .catch(error => console.error('Error loading moves:', error));
    }
    
    // Вспомогательная функция для заглавной буквы
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Функция для визуального отображения выигрыша
    function win(playerChoice) {
        const playerChoice_btn = document.getElementById(playerChoice);
        if (playerChoice_btn) {
            playerChoice_btn.classList.add('green-glow');
            setTimeout(() => playerChoice_btn.classList.remove('green-glow'), 300);
        }
    }

    // Функция для визуального отображения проигрыша
    function lose(playerChoice) {
        const playerChoice_btn = document.getElementById(playerChoice);
        if (playerChoice_btn) {
            playerChoice_btn.classList.add('red-glow');
            setTimeout(() => playerChoice_btn.classList.remove('red-glow'), 300);
        }
    }

    // Функция для визуального отображения ничьи
    function draw(playerChoice) {
        const playerChoice_btn = document.getElementById(playerChoice);
        if (playerChoice_btn) {
            playerChoice_btn.classList.add('gray-glow');
            setTimeout(() => playerChoice_btn.classList.remove('gray-glow'), 300);
        }
    }

    // Основная функция игры
    function game(playerChoice) {
        fetch(`/api/game/play?move=${playerChoice}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const computerChoice = data.botMove;
            playerScore_span.innerHTML = data.playerScore;
            botScore_span.innerHTML = data.botScore;

            // Отображаем результат хода
            if (data.result === 'WIN') {
                result_p.innerHTML = `${capitalizeFirstLetter(playerChoice)} бьет ${capitalizeFirstLetter(computerChoice)}. Вы выиграли!`;
                win(playerChoice);
            } else if (data.result === 'LOSS') {
                result_p.innerHTML = `${capitalizeFirstLetter(computerChoice)} бьет ${capitalizeFirstLetter(playerChoice)}. Вы проиграли!`;
                lose(playerChoice);
            } else {
                result_p.innerHTML = `${capitalizeFirstLetter(playerChoice)} VS ${capitalizeFirstLetter(computerChoice)}. Ничья!`;
                draw(playerChoice);
            }

            // Проверяем, закончилась ли игра
            if (data.gameOver) {
                result_p.innerHTML = data.gameResult;
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Функция для сброса игры
    function resetGame() {
        fetch('/api/game/reset', {
            method: 'POST'
        })
        .then(() => {
            playerScore_span.innerHTML = "0";
            botScore_span.innerHTML = "0";
            result_p.innerHTML = "Выберите элемент";
        })
        .catch(error => console.error('Error:', error));
    }

    // Инициализация обработчиков событий
    function main() {
        loadMoves(); // Загружаем доступные ходы с сервера
        resetButton.addEventListener('click', resetGame);
    }

    main();
});