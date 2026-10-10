/**
 * Liquid Chrome - Premium Fluid Liquid Metal Shader Background
 * Vanilla JS port of Componentry's Liquid Chrome
 * WebGL fragment shader with fluid noise, mouse interaction, and liquid metal aesthetic
 */

(function() {
    'use strict';

    const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec3 u_baseColor;
        uniform float u_amplitude;

        // Simple 2D noise
        const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

        float hash( vec2 p ) {
            float h = dot(p,vec2(127.1,311.7));
            return fract(sin(h)*43758.5453123);
        }

        float noise( in vec2 p ) {
            vec2 i = floor( p );
            vec2 f = fract( p );
            vec2 u = f*f*(3.0-2.0*f);
            return mix( mix( hash( i + vec2(0.0,0.0) ), 
                             hash( i + vec2(1.0,0.0) ), u.x),
                        mix( hash( i + vec2(0.0,1.0) ), 
                             hash( i + vec2(1.0,1.0) ), u.x), u.y);
        }

        float fbm( vec2 p ) {
            float f = 0.0;
            f += 0.5000*noise( p ); p = m*p*2.02;
            f += 0.2500*noise( p ); p = m*p*2.03;
            f += 0.1250*noise( p ); p = m*p*2.01;
            f += 0.0625*noise( p );
            return f/0.9375;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec2 p = -1.0 + 2.0 * uv;
            if (u_resolution.y > 0.0) {
                p.x *= u_resolution.x / u_resolution.y;
            }

            // Mouse interaction
            vec2 mouse = (u_mouse - 0.5) * 2.0;
            if (u_resolution.y > 0.0) {
                mouse.x *= u_resolution.x / u_resolution.y;
            }
            
            // Distort based on distance to mouse
            vec2 diff = p - mouse;
            float dist = length(diff);
            vec2 distortion = vec2(0.0);
            if (dist > 0.0) {
                distortion = (diff / dist) * exp(-dist * 3.0) * 0.1;
            }
            p += distortion;

            float time = u_time * 0.5;

            // Domain warping
            vec2 q = vec2(0.0);
            q.x = fbm(p + vec2(0.0, 0.0) + time * 0.1);
            q.y = fbm(p + vec2(5.2, 1.3) + time * 0.15);

            vec2 r = vec2(0.0);
            r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + time * 0.2);
            r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) + time * 0.25);

            float f = fbm(p + r * 4.0 * u_amplitude);

            // Color mixing (Chrome / Liquid Metal style)
            vec3 col = u_baseColor;
            
            // Add bright highlights based on the warped noise
            float highlight = smoothstep(0.4, 0.6, f);
            float highlight2 = smoothstep(0.6, 0.8, f);
            float dark = smoothstep(0.1, 0.3, f);
            
            col = mix(col, vec3(0.0), 1.0 - dark);
            col = mix(col, vec3(0.8, 0.8, 0.9), highlight);
            col = mix(col, vec3(1.0, 1.0, 1.0), highlight2);
            
            // Vignette
            float v = 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
            col *= 0.5 + 0.5 * pow(max(0.0, v), 0.2);

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    class LiquidChrome {
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.options = {
                baseColor: options.baseColor || [0.05, 0.05, 0.08],
                speed: options.speed || 1.0,
                amplitude: options.amplitude || 0.6,
                interactive: options.interactive !== false
            };

            this.gl = null;
            this.program = null;
            this.mouse = [0.5, 0.5];
            this.animationFrameId = null;
            this.startTime = performance.now();
            this.resizeTimeout = null;
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.isSmallViewport = window.matchMedia('(max-width: 900px)').matches;
            this.renderDpr = this.isSmallViewport ? 1 : 1.25;
            this.maxFrameInterval = this.isSmallViewport ? (1000 / 30) : (1000 / 45);
            this.lastRenderTime = 0;

            this.init();
        }

        init() {
            const gl = this.canvas.getContext('webgl', {
                alpha: false,
                antialias: false,
                depth: false,
                stencil: false,
                preserveDrawingBuffer: false,
                powerPreference: 'low-power'
            });
            if (!gl) {
                this.fallback();
                return;
            }
            this.gl = gl;

            // Compile shaders
            const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
            if (!vertexShader || !fragmentShader) {
                this.fallback();
                return;
            }

            // Link program
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertexShader);
            gl.attachShader(this.program, fragmentShader);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(this.program));
                this.fallback();
                return;
            }

            gl.useProgram(this.program);

            // Setup geometry (full-screen quad)
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1,  1, -1,  -1, 1,
                -1,  1,  1, -1,   1, 1
            ]), gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(this.program, 'position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // Cache uniform locations
            this.uniforms = {
                resolution: gl.getUniformLocation(this.program, 'u_resolution'),
                time: gl.getUniformLocation(this.program, 'u_time'),
                mouse: gl.getUniformLocation(this.program, 'u_mouse'),
                baseColor: gl.getUniformLocation(this.program, 'u_baseColor'),
                amplitude: gl.getUniformLocation(this.program, 'u_amplitude')
            };

            // Event listeners
            this.handleResize = this.handleResize.bind(this);
            this.handleMouseMove = this.handleMouseMove.bind(this);
            this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
            this.render = this.render.bind(this);
            this.paused = false;

            window.addEventListener('resize', this.handleResize);
            if (this.options.interactive) {
                window.addEventListener('mousemove', this.handleMouseMove);
            }
            document.addEventListener('visibilitychange', this.handleVisibilityChange);

            this.handleResize();
            this.render(performance.now());
        }

        compileShader(type, source) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        handleResize() {
            const gl = this.gl;
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const renderDpr = Math.min(dpr, this.renderDpr);
            this.canvas.width = Math.max(1, Math.floor(rect.width * renderDpr));
            this.canvas.height = Math.max(1, Math.floor(rect.height * renderDpr));
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
        }

        handleMouseMove(e) {
            if (!this.options.interactive) return;
            const rect = this.canvas.getBoundingClientRect();
            this.mouse[0] = (e.clientX - rect.left) / rect.width;
            this.mouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
        }

        render(time) {
            const gl = this.gl;
            if (time - this.lastRenderTime < this.maxFrameInterval) {
                if (!this.paused && !this.reducedMotion) {
                    this.animationFrameId = requestAnimationFrame(this.render);
                }
                return;
            }
            this.lastRenderTime = time;
            const elapsedTime = (time - this.startTime) * 0.001 * this.options.speed;

            gl.uniform1f(this.uniforms.time, elapsedTime);
            gl.uniform2f(this.uniforms.mouse, this.mouse[0], this.mouse[1]);
            gl.uniform3f(this.uniforms.baseColor, 
                this.options.baseColor[0], 
                this.options.baseColor[1], 
                this.options.baseColor[2]
            );
            gl.uniform1f(this.uniforms.amplitude, this.options.amplitude);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            if (!this.paused && !this.reducedMotion) {
                this.animationFrameId = requestAnimationFrame(this.render);
            }
        }

        handleVisibilityChange() {
            if (document.hidden) {
                this.paused = true;
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                }
            } else {
                this.paused = false;
                this.animationFrameId = requestAnimationFrame(this.render);
            }
        }

        fallback() {
            // Fallback: preserve the background treatment without blocking portfolio content.
            this.canvas.style.display = 'none';
            document.documentElement.classList.add('liquid-chrome-fallback');
        }

        destroy() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('mousemove', this.handleMouseMove);
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            if (this.gl) {
                this.gl.getExtension('WEBGL_lose_context')?.loseContext();
            }
        }

        // Public API for dynamic updates
        setBaseColor(r, g, b) {
            this.options.baseColor = [r, g, b];
        }

        setSpeed(speed) {
            this.options.speed = speed;
        }

        setAmplitude(amplitude) {
            this.options.amplitude = amplitude;
        }

        setInteractive(interactive) {
            this.options.interactive = interactive;
        }
    }

    // Start on demand after the initial portfolio shell is interactive.
    let liquidChromeStarted = false;
    window.startLiquidChrome = () => {
        if (liquidChromeStarted) return;
        const canvas = document.getElementById('liquid-chrome-canvas');
        if (!canvas) return;
        liquidChromeStarted = true;

        const chrome = new LiquidChrome(canvas, {
            baseColor: [0.02, 0.04, 0.06],
            speed: 0.8,
            amplitude: 0.55,
            interactive: true
        });
        window.liquidChrome = chrome;
    };

    // This file is loaded by the portfolio's idle-time loader, after DOMContentLoaded may have fired.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.startLiquidChrome, { once: true });
    } else {
        window.startLiquidChrome();
    }
})();