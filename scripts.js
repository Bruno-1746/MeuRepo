// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const classificationData = [
        {position: 1, team: '9A', points: 0, games: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, percentage: 0},
        {position: 2, team: '9B', points: 0, games: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, percentage: 0},
        {position: 3, team: '9C', points: 0, games: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, percentage: 0},
        // Adicione mais times conforme necessário
    ];

    const matchesData = [
        {date: '26/06', time: '19:00', homeTeam: '9A', awayTeam: '9B', homeScore: 2, awayScore: 0},
        {date: '26/06', time: '19:00', homeTeam: '9C', awayTeam: '9B', homeScore: 2, awayScore: 1},
        {date: '26/06', time: '20:00', homeTeam: '9C', awayTeam: '9A', homeScore: 1, awayScore: 1},
        // Adicione mais jogos conforme necessário
    ];

    const classificationTable = document.getElementById('classification-table');
    const matchesDiv = document.getElementById('matches');
    const resultForm = document.getElementById('result-form');
    const loginForm = document.getElementById('login-form');
    const adminSection = document.getElementById('admin-section');
    const loginSection = document.getElementById('login-section');

    const adminCredentials = {
        username: 'admin',
        password: 'senha123'
    };

    function updateClassificationTable() {
        classificationTable.innerHTML = `
            <tr>
                <th>Posição</th>
                <th>Time</th>
                <th>P</th>
                <th>J</th>
                <th>V</th>
                <th>E</th>
                <th>D</th>
                <th>GP</th>
                <th>GC</th>
                <th>SG</th>
                <th>%</th>
            </tr>
        `;
        
        classificationData.forEach(team => {
            classificationTable.innerHTML += `
                <tr>
                    <td>${team.position}</td>
                    <td>${team.team}</td>
                    <td>${team.points}</td>
                    <td>${team.games}</td>
                    <td>${team.wins}</td>
                    <td>${team.draws}</td>
                    <td>${team.losses}</td>
                    <td>${team.gf}</td>
                    <td>${team.ga}</td>
                    <td>${team.gd}</td>
                    <td>${team.percentage}</td>
                </tr>
            `;
        });
    }

    function updateMatches() {
        matchesDiv.innerHTML = '';
        matchesData.forEach(match => {
            matchesDiv.innerHTML += `
                <div class="match">
                    <span>${match.date} ${match.time}</span>
                    <span>${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam}</span>
                </div>
            `;
        });
    }

    function addResult(homeTeam, homeScore, awayTeam, awayScore) {
        // Adicionar jogo à lista de jogos
        matchesData.push({
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            homeTeam,
            homeScore: parseInt(homeScore, 10),
            awayTeam,
            awayScore: parseInt(awayScore, 10)
        });

        // Atualizar dados de classificação
        classificationData.forEach(team => {
            if (team.team === homeTeam) {
                team.games += 1;
                team.gf += parseInt(homeScore, 10);
                team.ga += parseInt(awayScore, 10);

                if (homeScore > awayScore) {
                    team.wins += 1;
                    team.points += 3;
                } else if (homeScore === awayScore) {
                    team.draws += 1;
                    team.points += 1;
                } else {
                    team.losses += 1;
                }
            } else if (team.team === awayTeam) {
                team.games += 1;
                team.gf += parseInt(awayScore, 10);
                team.ga += parseInt(homeScore, 10);

                if (awayScore > homeScore) {
                    team.wins += 1;
                    team.points += 3;
                } else if (awayScore === homeScore) {
                    team.draws += 1;
                    team.points += 1;
                } else {
                    team.losses += 1;
                }
            }

            // Atualizar saldo de gols e porcentagem
            team.gd = team.gf - team.ga;
            team.percentage = Math.round((team.points / (team.games * 3)) * 100);
        });

        // Ordenar classificação por pontos, vitórias, saldo de gols e gols marcados
        classificationData.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.wins !== a.wins) return b.wins - a.wins;
            if (b.gd !== a.gd) return b.gd - a.gd;
            return b.gf - a.gf;
        });

        // Atualizar posições na tabela de classificação
        classificationData.forEach((team, index) => {
            team.position = index + 1;
        });

        updateClassificationTable();
        updateMatches();
    }

    function authenticate(username, password) {
        return username === adminCredentials.username && password === adminCredentials.password;
    }

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = loginForm['admin-username'].value;
        const password = loginForm['admin-password'].value;

        if (authenticate(username, password)) {
            adminSection.style.display = 'block';
            loginSection.style.display = 'none';
        } else {
            alert('Usuário ou senha incorretos!');
        }

        loginForm.reset();
    });

    resultForm.addEventListener('submit', event => {
        event.preventDefault();
        const homeTeam = resultForm['home-team'].value;
        const homeScore = resultForm['home-score'].value;
        const awayTeam = resultForm['away-team'].value;
        const awayScore = resultForm['away-score'].value;
        addResult(homeTeam, homeScore, awayTeam, awayScore);
        resultForm.reset();
    });

    adminSection.style.display = 'none';
    loginSection.style.display = 'block';

    updateClassificationTable();
    updateMatches();
});
