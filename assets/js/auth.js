// Función para alternar entre el formulario de Login y Registro
function toggleAuth(view) {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');

    if (view === 'register') {
        loginCard.classList.add('hidden');
        registerCard.classList.remove('hidden');
    } else {
        loginCard.classList.remove('hidden');
        registerCard.classList.add('hidden');
    }
}

// Lógica de Registro
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-user').value;
    const password = document.getElementById('reg-pass').value;

    let users = JSON.parse(localStorage.getItem('dul_shop_users')) || [];

    // Verificar si el usuario ya existe
    const exists = users.find(u => u.username === username);
    if (exists) {
        alert('El usuario ya existe');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('dul_shop_users', JSON.stringify(users));
    alert('Usuario registrado con éxito');
    toggleAuth('login');
});

// Lógica de Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;

    // Usuario por defecto para el taller si no hay nadie más
    if (username === 'admin' && password === 'admin') {
        initSession(username);
        return;
    }

    let users = JSON.parse(localStorage.getItem('dul_shop_users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        initSession(username);
    } else {
        alert('Credenciales incorrectas');
    }
});

function initSession(username) {
    localStorage.setItem('dul_shop_session', username);
    checkSession();
}

function logout() {
    localStorage.removeItem('dul_shop_session');
    checkSession();
}

function checkSession() {
    const session = localStorage.getItem('dul_shop_session');
    const authView = document.getElementById('auth-view');
    const mainView = document.getElementById('main-view');

    if (session) {
        authView.classList.add('hidden');
        mainView.classList.remove('hidden');
    } else {
        authView.classList.remove('hidden');
        mainView.classList.add('hidden');
    }
}

// Ejecutar al cargar
window.onload = checkSession;
