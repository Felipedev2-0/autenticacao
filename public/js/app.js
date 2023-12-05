new Vue({
    el: '#app',
    data: {
        username: '',
        password: '',
        user: null
    },
    methods: {
        login() {
            // Substitua isto com a lógica de login real (pode fazer uma solicitação AJAX)
            if (this.username === 'user' && this.password === 'password') {
                this.user = { username: 'user' };
            } else {
                alert('Credenciais inválidas.');
            }
        },
        logout() {
            this.user = null;
        }
    }
});
