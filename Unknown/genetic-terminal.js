/**
 * GENETIC ANALYSIS — terminal reveal animation + interactive mini shell
 *
 * 1. prompts "DGC@MHNE:~"
 * 2. types "DGC_Information.txt"
 * 3. reveals the header + description (typed) + statistics
 * 4. finishes with a blinking "DGC@MHNE:~ █"
 *
 * After the reveal completes, the user can click the terminal body and type
 * commands (help, whoami, ls, cat, skills, contact, echo, clear, sudo...).
 * Runs ONCE when the terminal scrolls into the viewport (IntersectionObserver).
 * The home hero typewriter (cyber-typing-effect.js) is left untouched.
 */
(function () {
    'use strict';

    var term = document.getElementById('genetic-terminal');
    if (!term) return;

    var runOnce = false;
    var interactive = false;

    /* grab sub-elements */
    var promptLine = term.querySelector('[data-term-prompt]');
    var cmdEl = term.querySelector('[data-term-cmd]');
    var cmdCursor = term.querySelector('[data-term-cmd-cursor]');
    var headerEl = term.querySelector('[data-term-header]');
    var sepEl = term.querySelector('[data-term-sep]');
    var descEl = term.querySelector('[data-term-desc]');
    var descTextEl = term.querySelector('[data-term-desc-text]');
    var descFull = term.querySelector('[data-term-desc-full]');
    var statsEl = term.querySelector('[data-term-stats]');
    var statEls = Array.prototype.slice.call(term.querySelectorAll('[data-term-stat]'));
    var finalEl = term.querySelector('[data-term-final]');
    var outputEl = term.querySelector('[data-term-output]');
    var inputEl = term.querySelector('[data-term-hidden-input]');
    var inputTextEl = term.querySelector('[data-term-input-text]');
    var termBody = term.querySelector('.term-body');

    if (!cmdEl || !descTextEl) return;

    var delay = function (ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    };

    var typeInto = function (el, text, speed) {
        return new Promise(function (resolve) {
            var i = 0;
            el.textContent = '';
            (function typeChar() {
                if (i < text.length) {
                    var ch = text.charAt(i);
                    el.textContent += ch;
                    i++;
                    /* brief realistic pause after punctuation/clauses */
                    var gap = speed;
                    if (/[.;,:]/.test(ch)) gap = speed * 12;
                    setTimeout(typeChar, gap);
                } else {
                    resolve();
                }
            })();
        });
    };

    /* highlight the given keywords in neon green inside the typed description */
    var HIGHLIGHTS = ['Cybersecurity', 'Digital Forensics', 'threat analysis',
        'digital evidence examination', 'incident response', 'continuous learning',
        'cyber threat', 'forensic methodologies', 'security technologies'];

    var highlight = function (text) {
        var escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
        var present = HIGHLIGHTS.filter(function (kw) { return escaped.indexOf(kw) !== -1; });
        if (!present.length) return escaped;
        var re = new RegExp('(' + present.map(escapeRe).join('|') + ')', 'g');
        return escaped.replace(re, '<span class="t-hi">$1</span>');
    };

    function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    /* build a plain-text (no highlight) version for typing, then switch to highlighted html */
    var buildTypedDescription = function () {
        return descFull ? (descFull.textContent.replace(/\s+/g, ' ').trim()) : '';
    };

    var run = async function () {
        if (runOnce) return;
        runOnce = true;

        /* 1. reveal the card, prompt is already visible via CSS; start */
        term.classList.add('term-active');

        var cmdText = 'DGC_Information.txt';
        cmdEl.textContent = '';

        try {
            /* type the command */
            await typeInto(cmdEl, cmdText, 70);
            await delay(260);

            /* hide command cursor, show header + separator */
            if (cmdCursor) cmdCursor.classList.add('hidden');
            headerEl.classList.add('term-visible');
            await delay(140);
            sepEl.classList.add('term-visible');
            await delay(180);

            /* type the description with terminal feel */
            var plain = buildTypedDescription();
            descEl.classList.add('term-visible');
            await typeInto(descTextEl, plain, 30);
            /* swap to highlighted html after typing for keyword emphasis */
            if (descFull) {
                descTextEl.innerHTML = highlight(descFull.textContent.replace(/\s+/g, ' ').trim());
            }
            await delay(200);

            /* reveal stats one by one */
            statsEl.classList.add('term-visible');
            statEls.forEach(function (s, idx) {
                s.style.setProperty('--t-d', (idx * 0.12 + 0.05) + 's');
                s.classList.add('term-visible');
            });
            await delay(120 + statEls.length * 120);

            /* finish with a live blinking prompt */
            finalEl.classList.add('term-visible');
            await delay(400);

            /* arm the interactive terminal */
            enableInteractive();
        } catch (e) {
            /* if anything interrupts, force everything visible so content never hides */
            [headerEl, sepEl, descEl, statsEl, finalEl].forEach(function (el) {
                if (el) el.classList.add('term-visible');
            });
            statEls.forEach(function (s) { return s.classList.add('term-visible'); });
            enableInteractive();
        }
    };

    /* ================= INTERACTIVE MINI SHELL ================= */

    var escText = function (s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    };

    var COMMANDS = {
        help: function () {
            return [
                'AVAILABLE COMMANDS',
                '  help                         show this help',
                '  whoami                       who is logged in',
                '  ls                           list profile files',
                '  cat <file>                   read a profile file',
                '  skills                       show skillset',
                '  contact                      show contact info',
                '  date                         show current date/time',
                '  echo <text>                  print text',
                '  clear                        clear the terminal',
                '  sudo <cmd>                   try it ;)',
                '  exit                         close session',
                ''
            ].join('\n');
        },
        whoami: function () {
            return 'DGC@MHNE\nCybersecurity & Digital Forensics Student';
        },
        ls: function () {
            return 'DGC_Information.txt   skills.txt   contact.txt   projects/';
        },
        'cat DGC_Information.txt': function () {
            return buildTypedDescription() || 'Fourth-year Cybersecurity & Digital Forensics student...';
        },
        'cat skills.txt': function () {
            return 'THREAT ANALYSIS\nDIGITAL FORENSICS\nINCIDENT RESPONSE\nMALWARE ANALYSIS\nSECURITY TOOLS (50+)';
        },
        'cat contact.txt': function () {
            return 'DGC@MHNE\nAvailable for security research, internships & collaborations.';
        },
        skills: function () {
            return COMMANDS['cat skills.txt']();
        },
        contact: function () {
            return COMMANDS['cat contact.txt']();
        },
        date: function () {
            return new Date().toLocaleString();
        },
        echo: function (args) {
            return args || '';
        },
        clear: function () {
            return null; /* special: handled by caller */
        },
        exit: function () {
            return 'session closed — but you can click again to reopen';
        }
    };

    var runCommand = function (raw) {
        var line = (raw || '').trim();
        var lower = line.toLowerCase();
        var name = lower.split(/\s+/)[0] || '';
        var rest = line.slice(name.length).trim();

        /* exact-match commands with args */
        if (lower === 'cat dgc_information.txt') return COMMANDS['cat DGC_Information.txt']();
        if (lower === 'cat skills.txt') return COMMANDS['cat skills.txt']();
        if (lower === 'cat contact.txt') return COMMANDS['cat contact.txt']();

        if (name === 'echo') return COMMANDS.echo(rest);
        if (name === 'cat') return 'cat: ' + rest + ': no such file';

        if (name === 'sudo') return 'nice try — you are already root.';

        if (typeof COMMANDS[name] === 'function') {
            return COMMANDS[name]();
        }

        return name ? 'bash: ' + name + ': command not found' : '';
    };

    var appendOutput = function (html, cls) {
        if (!outputEl) return;
        var lineDiv = document.createElement('div');
        lineDiv.className = 'term-out-line' + (cls ? ' ' + cls : '');
        lineDiv.innerHTML = html; /* safe: built from escText() below */
        outputEl.appendChild(lineDiv);
    };

    var appendPrompt = function (cmd) {
        if (!outputEl) return;
        var lineDiv = document.createElement('div');
        lineDiv.className = 'term-out-line term-out-cmd';
        lineDiv.innerHTML = '<span class="term-user">DGC@MHNE:~</span> <span class="term-cmd">' +
            escText(cmd) + '</span>';
        outputEl.appendChild(lineDiv);
    };

    var showNewPrompt = function () {
        /* reveal a fresh interactive prompt line at the end */
        if (finalEl) finalEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    var keepPromptVisible = function () {
        if (finalEl) finalEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    var handleEnter = function () {
        var value = inputEl.value;
        inputEl.value = '';
        inputTextEl.textContent = '';
        updateBuffer();
        keepPromptVisible();

        if (!value) {
            /* empty command → still log a bare prompt */
            appendPrompt('');
            keepPromptVisible();
            return;
        }

        /* echo the command as a committed line */
        appendPrompt(value);
        keepPromptVisible();

        var out = runCommand(value);

        if (value.trim().toLowerCase() === 'clear') {
            /* wipe output and start fresh */
            if (outputEl) outputEl.innerHTML = '';
            keepPromptVisible();
            return;
        }

        if (out) {
            var isErr = /^(bash:|cat:|nice try)/.test(out);
            appendOutput(escText(out).replace(/\n/g, '<br>'), isErr ? 'term-out-err' : 'term-out-data');
        }
        keepPromptVisible();
    };

    var updateBuffer = function () {
        if (inputTextEl) inputTextEl.textContent = inputEl.value;
    };

    var enableInteractive = function () {
        if (interactive || !inputEl) return;
        interactive = true;
        term.classList.add('term-live');

        var nukeAutofill = function () {
            /* re-asserting a random autocomplete value on focus stops
               browser suggestion dropdowns from appearing over the terminal */
            inputEl.setAttribute('autocomplete', 'term-' + Date.now());
            inputEl.setAttribute('autocorrect', 'off');
            inputEl.setAttribute('autocapitalize', 'off');
            inputEl.setAttribute('spellcheck', 'false');
            inputEl.setAttribute('aria-autocomplete', 'none');
        };
        nukeAutofill();
        inputEl.addEventListener('focus', nukeAutofill);

        /* cursor sits after typed text */
        updateBuffer();

        /* hint so visitors discover the shell */
        appendOutput('interactive shell ready — type <span class="t-hi">help</span> for available commands', 'term-out-data');
        keepPromptVisible();

        /* focus input on click/tap anywhere in the body (not the title bar) */
        if (termBody) {
            termBody.addEventListener('pointerdown', function () {
                inputEl.focus({ preventScroll: true });
            });
            termBody.addEventListener('click', function () {
                inputEl.focus({ preventScroll: true });
            });
        }
        inputEl.addEventListener('click', function (e) { e.stopPropagation(); });

        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleEnter();
            }
        });
        inputEl.addEventListener('input', updateBuffer);
        inputEl.addEventListener('keyup', updateBuffer);
        inputEl.addEventListener('blur', updateBuffer);

        /* register ANY key press to ensure buffer stays in sync (mobile) */
        inputEl.addEventListener('keypress', updateBuffer);
    };

    /* --- run once when in viewport --- */
    if (typeof IntersectionObserver !== 'undefined') {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    run();
                }
            });
        }, { threshold: 0.25 });
        observer.observe(term);
    } else {
        /* fallback for very old browsers */
        window.addEventListener('load', run);
        window.addEventListener('scroll', function () {
            if (!runOnce) run();
        });
    }
})();