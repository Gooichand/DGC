/**
 * Matrix Rain - Digital rain effect for the SECURE COMMUNICATION cards.
 * Vanilla JS port of Componentry's MatrixRain. Canvas stays transparent so
 * the glass-card background shows through with a soft semi-transparent rain.
 */
(function () {
    'use strict';

    var CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF';

    var COLORS = {
        green: '#00ff41',
        cyan: '#00ffff'
    };

    function injectStyles() {
        if (document.getElementById('matrix-rain-styles')) return;
        var style = document.createElement('style');
        style.id = 'matrix-rain-styles';
        style.textContent = `
            .matrix-card {
                position: relative;
                overflow: hidden;
            }
            .matrix-card > *:not(.matrix-rain-canvas):not(.matrix-rain-veil) {
                position: relative;
                z-index: 1;
            }
            .matrix-rain-canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                opacity: 0.4;
                pointer-events: none;
                border-radius: inherit;
            }
            .matrix-rain-veil {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                pointer-events: none;
                border-radius: inherit;
                background: rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    }

    function initCard(card) {
        var variant = card.getAttribute('data-matrix') || 'green';
        var fontSize = 14;
        var speed = 50;
        var color = COLORS[variant] || COLORS.green;

        var canvas = document.createElement('canvas');
        canvas.className = 'matrix-rain-canvas';
        card.insertBefore(canvas, card.firstChild);

        var veil = document.createElement('div');
        veil.className = 'matrix-rain-veil';
        card.insertBefore(veil, canvas.nextSibling);

        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var columns = 0;
        var drops = [];

        function resize() {
            var w = card.clientWidth;
            var h = card.clientHeight;
            var dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            columns = Math.floor(w / fontSize);
            drops = new Array(columns).fill(1);
        }

        resize();
        if (window.ResizeObserver) {
            new ResizeObserver(resize).observe(card);
        }

        function draw() {
            // Fade previous frame while keeping the canvas transparent
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = 'source-over';
            ctx.font = fontSize + 'px monospace';
            ctx.globalAlpha = 0.45;

            for (var i = 0; i < drops.length; i++) {
                var text = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
                var x = i * fontSize;
                var y = drops[i] * fontSize;

                ctx.fillStyle = color;
                ctx.fillText(text, x, y);

                // Head character glows brighter
                ctx.globalAlpha = 0.75;
                ctx.fillStyle = '#eafff0';
                ctx.fillText(text, x, y - fontSize);

                ctx.globalAlpha = 0.45;

                if (y > canvas.height / (window.devicePixelRatio || 1) && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            ctx.globalAlpha = 1;
        }

        var interval = setInterval(draw, speed);
        canvas.__matrixInterval = interval;
    }

    function init() {
        injectStyles();

        var cards = document.querySelectorAll('#contact .glass-card');
        if (!cards.length) return;

        Array.prototype.forEach.call(cards, function (card) {
            if (card.querySelector('.matrix-rain-canvas')) return;
            initCard(card);
        });
    }

    var started = false;

    function startWhenNear() {
        if (started) return;
        var contact = document.getElementById('contact');
        if (!contact) { init(); started = true; return; }
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    started = true;
                    init();
                    io.disconnect();
                }
            }, { rootMargin: '400px' });
            io.observe(contact);
        } else {
            started = true;
            init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startWhenNear);
    } else {
        startWhenNear();
    }
})();