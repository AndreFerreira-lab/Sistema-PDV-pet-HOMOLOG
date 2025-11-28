/* Fonte */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

body {
    font-family: 'Poppins', sans-serif;
}

/* Scrollbar Personalizada */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #171717;
}

::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #f59e0b;
}

/* Efeitos Neon */
.neon-text {
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
}

/* Animações */
.fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Componentes Comuns via CSS puro para limpar HTML */
.nav-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    transition: all 0.2s;
    font-weight: 500;
    color: #d1d5db;
    text-align: left;
}

.nav-btn:hover {
    background-color: #262626;
    color: white;
}

.nav-btn.active {
    background-color: #f59e0b;
    color: black;
    font-weight: 700;
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
}

.input-field {
    width: 100%;
    background-color: #171717;
    border: 1px solid #404040;
    border-radius: 6px;
    padding: 10px;
    color: white;
    outline: none;
    transition: border-color 0.2s;
}

.input-field:focus {
    border-color: #f59e0b;
}

.btn-primary {
    background-color: #f59e0b;
    color: black;
    font-weight: 700;
    padding: 10px;
    border-radius: 6px;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: #fbbf24;
}

.card-stat {
    background-color: #262626;
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s;
}

.card-stat:hover {
    transform: scale(1.02);
}
