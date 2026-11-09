// ===== Elementos da página =====
const caixas = document.querySelectorAll('.box');
const container = document.getElementById('container');
const mensagem = document.getElementById('message');
const textoMensagem = mensagem.querySelector('p');
const placarX = document.getElementById('scoreboard-1');
const placarO = document.getElementById('scoreboard-2');

// ===== Dados do jogo =====
// As 8 formas de ganhar (posições de 0 a 8 do tabuleiro)
const combinacoes = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6]             // diagonais
];

let tabuleiro;          // lista com 9 posições: '', 'x' ou 'o'
let vez;                // de quem é a vez: 'x' ou 'o'
let fimDeJogo;          // true enquanto a mensagem de fim aparece
let contraIA;           // true = jogando contra o computador
let pontos = { x: 0, o: 0 };
let timer;              // guarda o temporizador da mensagem de fim

// ===== Começar / reiniciar =====
function reiniciar() {
    tabuleiro = Array(9).fill('');
    vez = 'x';
    fimDeJogo = false;
    caixas.forEach(caixa => caixa.innerHTML = '');
}

function iniciar(ia) {
    clearTimeout(timer);
    contraIA = ia;
    pontos = { x: 0, o: 0 };
    placarX.textContent = 0;
    placarO.textContent = 0;
    mensagem.classList.add('hide');
    reiniciar();
    container.classList.remove('hide');
}

document.getElementById('btn-2-players').addEventListener('click', () => iniciar(false));
document.getElementById('ai-player').addEventListener('click', () => iniciar(true));

// ===== Clique em uma casa =====
caixas.forEach((caixa, i) => {
    caixa.addEventListener('click', () => {
        if (fimDeJogo || tabuleiro[i] !== '') return;   // jogo parado ou casa ocupada
        if (contraIA && vez === 'o') return;            // é a vez da IA
        jogar(i);
    });
});

// ===== Fazer uma jogada =====
function jogar(i) {
    tabuleiro[i] = vez;

    const peca = document.createElement('div');
    peca.className = vez;                 // 'x' ou 'o' (o CSS usa essas classes)
    peca.textContent = vez.toUpperCase();
    caixas[i].appendChild(peca);

    if (venceu(vez)) return terminar(vez);
    if (!tabuleiro.includes('')) return terminar(null);   // sem casas vazias = empate

    vez = vez === 'x' ? 'o' : 'x';
    if (contraIA && vez === 'o') setTimeout(jogadaIA, 500);
}

function venceu(jogador) {
    return combinacoes.some(c => c.every(i => tabuleiro[i] === jogador));
}

// ===== Fim de rodada =====
function terminar(vencedor) {
    fimDeJogo = true;

    if (vencedor) {
        pontos[vencedor]++;
        placarX.textContent = pontos.x;
        placarO.textContent = pontos.o;
        textoMensagem.textContent = vencedor.toUpperCase() + ' venceu!';
    } else {
        textoMensagem.textContent = 'Deu velha!';
    }

    mensagem.classList.remove('hide');
    timer = setTimeout(() => {
        mensagem.classList.add('hide');
        reiniciar();
    }, 1500);
}

// ===== Computador (joga como O) =====
function jogadaIA() {
    if (fimDeJogo || vez !== 'o') return;

    const vazias = [];
    tabuleiro.forEach((valor, i) => { if (valor === '') vazias.push(i); });

    // 1º tenta ganhar, 2º bloqueia o X, 3º joga em uma casa aleatória
    const escolha = achar('o', vazias)
        ?? achar('x', vazias)
        ?? vazias[Math.floor(Math.random() * vazias.length)];

    jogar(escolha);
}

// Devolve a casa que faria o jogador completar uma linha (ou undefined)
function achar(jogador, vazias) {
    return vazias.find(i => {
        tabuleiro[i] = jogador;          // testa a jogada
        const ganha = venceu(jogador);
        tabuleiro[i] = '';               // desfaz o teste
        return ganha;
    });
}