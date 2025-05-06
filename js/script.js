/**
 * Snake Game - Jogo da Cobra
 * Código refatorado usando programação orientada a objetos
 */

class JogoCobra {
    constructor() {
        // Elementos do canvas
        this.canvas = document.getElementById("snake");
        this.contexto = this.canvas.getContext("2d");
        this.tamanho = 32;
        
        // Configurações do jogo
        this.direcao = "right";
        this.pontuacao = 0;
        this.intervaloJogo = null;
        this.velocidadeJogo = 100; // Velocidade inicial
        this.jogoIniciado = false;
        this.jogoFinalizado = false;
        
        // Inicialização da cobra
        this.cobra = [];
        this.cobra[0] = {
            x: 8 * this.tamanho,
            y: 8 * this.tamanho
        };
        
        // Inicialização da comida
        this.comida = this.criarComida();
        
        // Inicializa os event listeners
        this.configurarEventos();
        
        // Exibe tela inicial
        this.desenharTelaInicial();
    }
    
    // Gera uma nova posição para a comida
    criarComida() {
        return {
            x: Math.floor(Math.random() * 15 + 1) * this.tamanho,
            y: Math.floor(Math.random() * 15 + 1) * this.tamanho
        };
    }
    
    // Cria o fundo do jogo
    criarBG() {
        this.contexto.fillStyle = "#0a0a14";
        this.contexto.fillRect(0, 0, 16 * this.tamanho, 16 * this.tamanho);
        
        // Adiciona grade fina para efeito cyberpunk
        this.contexto.strokeStyle = "rgba(0, 238, 255, 0.1)";
        this.contexto.lineWidth = 0.5;
        
        // Linhas horizontais
        for(let i = 0; i <= 16; i++) {
            this.contexto.beginPath();
            this.contexto.moveTo(0, i * this.tamanho);
            this.contexto.lineTo(16 * this.tamanho, i * this.tamanho);
            this.contexto.stroke();
        }
        
        // Linhas verticais
        for(let i = 0; i <= 16; i++) {
            this.contexto.beginPath();
            this.contexto.moveTo(i * this.tamanho, 0);
            this.contexto.lineTo(i * this.tamanho, 16 * this.tamanho);
            this.contexto.stroke();
        }
    }
    
    // Desenha a cobra
    criarCobrinha() {
        for (let i = 0; i < this.cobra.length; i++) {
            // Cabeça com cor diferente
            if (i === 0) {
                this.contexto.fillStyle = "#ffffff"; // Branco para a cabeça
            } else {
                this.contexto.fillStyle = "#d3d3d3"; // Cinza claro para o corpo
            }
            this.contexto.fillRect(this.cobra[i].x, this.cobra[i].y, this.tamanho, this.tamanho);
            
            // Efeito de brilho neon
            this.contexto.strokeStyle = "#00eeff"; // Ciano neon
            this.contexto.lineWidth = 1;
            this.contexto.strokeRect(this.cobra[i].x, this.cobra[i].y, this.tamanho, this.tamanho);
        }
    }
    
    // Desenha a comida
    desenharComida() {
        this.contexto.fillStyle = "red";
        this.contexto.fillRect(this.comida.x, this.comida.y, this.tamanho, this.tamanho);
    }
    
    // Desenha a pontuação
    desenharPontuacao() {
        // Adiciona fundo semitransparente para o texto
        this.contexto.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.contexto.fillRect(10, 10, 150, 30);
        
        // Borda neon para o painel de pontuação
        this.contexto.strokeStyle = "#ff00dd";
        this.contexto.lineWidth = 1;
        this.contexto.strokeRect(10, 10, 150, 30);
        
        // Texto da pontuação com gradiente e sombra neon
        // Primeira parte: "Pontuação: "
        this.contexto.fillStyle = "#7df9ff"; // Azul claro/turquesa
        this.contexto.font = "20px Arial";
        this.contexto.shadowColor = "#7df9ff";
        this.contexto.shadowBlur = 5;
        this.contexto.textAlign = "left";
        this.contexto.fillText("Pontuação: ", 20, 32);
        
        // Segunda parte: o valor numérico com cor diferente
        let txtPontuacao = "Pontuação: ";
        let larguraTxt = this.contexto.measureText(txtPontuacao).width;
        this.contexto.fillStyle = "#ffffff"; // Branco para o número
        this.contexto.shadowColor = "#ffffff";
        this.contexto.fillText(`${this.pontuacao}`, 20 + larguraTxt, 32);
        
        // Resetar sombra para não afetar outros elementos
        this.contexto.shadowBlur = 0;
    }
    
    // Desenha o copyright
    desenharCopyright() {
        // Posiciona o texto no canto inferior direito
        this.contexto.fillStyle = "rgba(255, 255, 255, 0.6)";
        this.contexto.font = "12px Arial";
        this.contexto.textAlign = "right";
        this.contexto.fillText("Desenvolvido por Camila Sena", this.canvas.width - 10, this.canvas.height - 10);
    }
    
    // Tela inicial
    desenharTelaInicial() {
        this.criarBG();
        this.contexto.fillStyle = "green";
        this.contexto.font = "30px Arial";
        this.contexto.textAlign = "center";
        this.contexto.fillText("Jogo da Cobra", this.canvas.width/2, this.canvas.height/2 - 50);
        this.contexto.font = "20px Arial";
        this.contexto.fillText("Pressione ESPAÇO para começar", this.canvas.width/2, this.canvas.height/2);
        this.contexto.fillText("Use as setas para mover a cobra", this.canvas.width/2, this.canvas.height/2 + 30);
        
        // Adiciona o copyright na tela inicial
        this.desenharCopyright();
    }
    
    // Tela de Game Over
    desenharTelaGameOver() {
        // Fundo semi-transparente para todo o canvas
        this.contexto.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.contexto.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Tamanho do modal
        const larguraModal = 400;
        const alturaModal = 250;
        
        // Posição do modal (centralizado)
        const xModal = (this.canvas.width - larguraModal) / 2;
        const yModal = (this.canvas.height - alturaModal) / 2;
        
        // Desenha o fundo do modal
        this.contexto.fillStyle = "#0f0a1e";
        this.contexto.fillRect(xModal, yModal, larguraModal, alturaModal);
        
        // Borda neon para o modal
        this.contexto.strokeStyle = "#ff00dd";
        this.contexto.lineWidth = 3;
        this.contexto.strokeRect(xModal, yModal, larguraModal, alturaModal);
        
        // Grade de fundo sutil no modal
        this.contexto.strokeStyle = "rgba(0, 238, 255, 0.1)";
        this.contexto.lineWidth = 0.5;
        
        // Linhas horizontais da grade
        for (let i = 0; i <= 10; i++) {
            this.contexto.beginPath();
            this.contexto.moveTo(xModal, yModal + i * (alturaModal / 10));
            this.contexto.lineTo(xModal + larguraModal, yModal + i * (alturaModal / 10));
            this.contexto.stroke();
        }
        
        // Linhas verticais da grade
        for (let i = 0; i <= 10; i++) {
            this.contexto.beginPath();
            this.contexto.moveTo(xModal + i * (larguraModal / 10), yModal);
            this.contexto.lineTo(xModal + i * (larguraModal / 10), yModal + alturaModal);
            this.contexto.stroke();
        }
        
        // Título do modal
        this.contexto.fillStyle = "#ff00dd";
        this.contexto.font = "bold 36px Arial";
        this.contexto.textAlign = "center";
        this.contexto.shadowColor = "#ff00dd";
        this.contexto.shadowBlur = 10;
        this.contexto.fillText("GAME OVER", this.canvas.width/2, yModal + 60);
        
        // Pontuação
        this.contexto.fillStyle = "#7df9ff";
        this.contexto.font = "24px Arial";
        this.contexto.shadowColor = "#7df9ff";
        this.contexto.shadowBlur = 5;
        this.contexto.fillText(`Sua pontuação: ${this.pontuacao}`, this.canvas.width/2, yModal + 120);
        
        // Instrução para reiniciar
        this.contexto.fillStyle = "#ffffff";
        this.contexto.font = "18px Arial";
        this.contexto.shadowColor = "#ffffff";
        this.contexto.shadowBlur = 3;
        this.contexto.fillText("Pressione ESPAÇO para jogar novamente", this.canvas.width/2, yModal + 180);
        
        // Resetar sombras
        this.contexto.shadowBlur = 0;
        
        // Adiciona o copyright na tela de game over
        this.desenharCopyright();
    }
    
    // Configura os event listeners
    configurarEventos() {
        // Controles por teclado
        document.addEventListener('keydown', (evento) => this.tratarTecla(evento));
        
        // Adiciona controles para touch (dispositivos móveis)
        this.configurarControleTouch();
        
        // Botões de controle na tela
        this.configurarBotoesControle();
    }
    
    // Configura controles para dispositivos móveis (touch)
    configurarControleTouch() {
        let inicioTouchX, inicioTouchY;
        
        this.canvas.addEventListener('touchstart', (e) => {
            inicioTouchX = e.touches[0].clientX;
            inicioTouchY = e.touches[0].clientY;
            e.preventDefault();
        }, false);
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, false);
        
        this.canvas.addEventListener('touchend', (e) => {
            const fimTouchX = e.changedTouches[0].clientX;
            const fimTouchY = e.changedTouches[0].clientY;
            
            const diferencaX = fimTouchX - inicioTouchX;
            const diferencaY = fimTouchY - inicioTouchY;
            
            // Determina qual foi o maior movimento (horizontal ou vertical)
            if (Math.abs(diferencaX) > Math.abs(diferencaY)) {
                // Movimento horizontal
                if (diferencaX > 0 && this.direcao !== "left") {
                    this.direcao = "right";
                } else if (diferencaX < 0 && this.direcao !== "right") {
                    this.direcao = "left";
                }
            } else {
                // Movimento vertical
                if (diferencaY > 0 && this.direcao !== "up") {
                    this.direcao = "down";
                } else if (diferencaY < 0 && this.direcao !== "down") {
                    this.direcao = "up";
                }
            }
            
            e.preventDefault();
        }, false);
    }
    
    // Configura os botões de controle na tela
    configurarBotoesControle() {
        // Inicia o jogo ao clicar em qualquer botão (se ainda não estiver rodando)
        const iniciarJogo = () => {
            if (!this.jogoIniciado || this.jogoFinalizado) {
                this.comecarJogo();
            }
        };
        
        // Botão para cima
        const btnCima = document.getElementById('botao-cima');
        if (btnCima) {
            btnCima.addEventListener('click', () => {
                iniciarJogo();
                if (this.direcao !== "down") {
                    this.direcao = "up";
                }
            });
        }
        
        // Botão para baixo
        const btnBaixo = document.getElementById('botao-baixo');
        if (btnBaixo) {
            btnBaixo.addEventListener('click', () => {
                iniciarJogo();
                if (this.direcao !== "up") {
                    this.direcao = "down";
                }
            });
        }
        
        // Botão para esquerda
        const btnEsquerda = document.getElementById('botao-esquerda');
        if (btnEsquerda) {
            btnEsquerda.addEventListener('click', () => {
                iniciarJogo();
                if (this.direcao !== "right") {
                    this.direcao = "left";
                }
            });
        }
        
        // Botão para direita
        const btnDireita = document.getElementById('botao-direita');
        if (btnDireita) {
            btnDireita.addEventListener('click', () => {
                iniciarJogo();
                if (this.direcao !== "left") {
                    this.direcao = "right";
                }
            });
        }
        
        // Inicia o jogo ao tocar no canvas também
        this.canvas.addEventListener('click', () => {
            if (!this.jogoIniciado || this.jogoFinalizado) {
                this.comecarJogo();
            }
        });
    }
    
    // Trata os eventos de teclado
    tratarTecla(evento) {
        // Iniciar/Reiniciar jogo com espaço
        if (evento.code === "Space") {
            if (!this.jogoIniciado || this.jogoFinalizado) {
                this.comecarJogo();
            }
            return;
        }
        
        // Se o jogo não estiver rodando, não processa as teclas de direção
        if (!this.jogoIniciado) return;
        
        // Suporte para teclas de seta e WASD
        switch (evento.keyCode) {
            case 37: // Esquerda (seta)
            case 65: // A
                if (this.direcao !== "right") this.direcao = "left";
                break;
            case 38: // Cima (seta)
            case 87: // W
                if (this.direcao !== "down") this.direcao = "up";
                break;
            case 39: // Direita (seta)
            case 68: // D
                if (this.direcao !== "left") this.direcao = "right";
                break;
            case 40: // Baixo (seta)
            case 83: // S
                if (this.direcao !== "up") this.direcao = "down";
                break;
        }
    }
    
    // Inicia ou reinicia o jogo
    comecarJogo() {
        // Reinicia as configurações do jogo
        this.cobra = [{
            x: 8 * this.tamanho,
            y: 8 * this.tamanho
        }];
        this.direcao = "right";
        this.pontuacao = 0;
        this.velocidadeJogo = 100;
        this.jogoFinalizado = false;
        this.jogoIniciado = true;
        
        // Limpa qualquer intervalo anterior
        if (this.intervaloJogo) {
            clearInterval(this.intervaloJogo);
        }
        
        // Inicia o loop do jogo
        this.intervaloJogo = setInterval(() => this.loopJogo(), this.velocidadeJogo);
    }
    
    // Loop principal do jogo
    loopJogo() {
        // Verifica colisão com as bordas
        this.verificaColisaoBorda();
        
        // Verifica colisão com o próprio corpo
        if (this.verificaColisaoCorpo()) {
            this.finalizarJogo();
            return;
        }
        
        // Desenha os elementos
        this.criarBG();
        this.criarCobrinha();
        this.desenharComida();
        this.desenharPontuacao();
        this.desenharCopyright(); // Adiciona o copyright em cada frame
        
        // Movimenta a cobra
        this.moverCobra();
    }
    
    // Verifica colisão com as bordas e faz o retorno pelo lado oposto
    verificaColisaoBorda() {
        let cabeca = this.cobra[0];
        
        if (cabeca.x > 15 * this.tamanho && this.direcao === "right") {
            this.cobra[0].x = 0;
        }
        if (cabeca.x < 0 && this.direcao === "left") {
            this.cobra[0].x = 16 * this.tamanho;
        }
        if (cabeca.y > 15 * this.tamanho && this.direcao === "down") {
            this.cobra[0].y = 0;
        }
        if (cabeca.y < 0 && this.direcao === "up") {
            this.cobra[0].y = 16 * this.tamanho;
        }
    }
    
    // Verifica colisão com o próprio corpo
    verificaColisaoCorpo() {
        let cabeca = this.cobra[0];
        
        for (let i = 1; i < this.cobra.length; i++) {
            if (cabeca.x === this.cobra[i].x && cabeca.y === this.cobra[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // Movimenta a cobra
    moverCobra() {
        let cabeca = this.cobra[0];
        let novaCabeca = {
            x: cabeca.x,
            y: cabeca.y
        };
        
        // Atualiza a posição com base na direção
        switch (this.direcao) {
            case "right":
                novaCabeca.x += this.tamanho;
                break;
            case "left":
                novaCabeca.x -= this.tamanho;
                break;
            case "up":
                novaCabeca.y -= this.tamanho;
                break;
            case "down":
                novaCabeca.y += this.tamanho;
                break;
        }
        
        // Verifica se a cobra comeu a comida
        if (novaCabeca.x === this.comida.x && novaCabeca.y === this.comida.y) {
            this.pontuacao++;
            this.comida = this.criarComida();
            
            // Aumenta a velocidade a cada 5 pontos
            if (this.pontuacao % 5 === 0 && this.velocidadeJogo > 50) {
                this.velocidadeJogo -= 5;
                clearInterval(this.intervaloJogo);
                this.intervaloJogo = setInterval(() => this.loopJogo(), this.velocidadeJogo);
            }
        } else {
            // Se não comeu, remove a cauda
            this.cobra.pop();
        }
        
        // Adiciona a nova cabeça
        this.cobra.unshift(novaCabeca);
    }
    
    // Finaliza o jogo
    finalizarJogo() {
        this.jogoIniciado = false;
        this.jogoFinalizado = true;
        clearInterval(this.intervaloJogo);
        this.desenharTelaGameOver();
    }
}

// Inicia o jogo quando a página carregar
window.onload = () => {
    const jogo = new JogoCobra();
};


