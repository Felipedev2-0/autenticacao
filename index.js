const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// Configuração do Passport
passport.use(new LocalStrategy(
    (username, password, done) => {
        // Aqui você deve verificar as credenciais do usuário (por exemplo, em um banco de dados)
        if (username === 'user' && password === 'password') {
            return done(null, { id: 1, username: 'user' });
        } else {
            return done(null, false, { message: 'Credenciais inválidas.' });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Aqui você recuperaria os dados do usuário do banco de dados
    done(null, { id: 1, username: 'user' });
});

// Configuração do Express
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secretpassword', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.get('/', (req, res) => {
    res.send('Página inicial. <a href="/login">Login</a>');
});

app.get('/login', (req, res) => {
    res.send('Página de login. <form method="post" action="/login"><input type="text" name="username" placeholder="Usuário"><input type="password" name="password" placeholder="Senha"><button type="submit">Login</button></form>');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Dashboard. Bem-vindo, ${req.user.username}! <a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
