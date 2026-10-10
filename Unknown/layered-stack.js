/* Elastic Stack - digital badges arranged as a horizontal row of overlapping
   circular bubbles. Hovering one scales it up and elastically pushes the rest
   apart, then they spring back together on leave. Vanilla port of VengeanceUI's
   ElasticStack (shadcn-ready), using inline styles + spring easing so it needs
   no GSAP dependency. */
(function () {
    'use strict';

    var BADGES = [
        { src: 'badges/google.webp', width: 1000, height: 909, label: 'Google' },
        { src: 'badges/Postman - Postman API Fundamentals Student Expert - 2025-06-17.webp', width: 291, height: 291, label: 'Postman API Expert' },
        { src: 'badges/level 1.webp', width: 1000, height: 1000, label: 'Level 1' },
        { src: 'badges/google dmdm.webp', width: 1000, height: 1000, label: 'Google DMDM' },
        { src: 'badges/Community Competitor.webp', width: 56, height: 56, label: 'Community Competitor' },
        { src: 'badges/EWOC-26.webp', width: 200, height: 200, label: 'EWOC 26' },
        { src: 'badges/Kaggle Community.webp', width: 56, height: 56, label: 'Kaggle Community' },
        { src: "badges/Mentor's badge.webp", width: 1080, height: 1080, label: 'Mentor' },
        { src: 'badges/OPSWAT Introduction to Critical Infrastructure.webp', width: 680, height: 680, label: 'OPSWAT' },
        { src: 'badges/pull-shark-default-498c279a747d.webp', width: 296, height: 296, label: 'Pull Shark' },
        { src: 'badges/quickdraw-default--light-8f798b35341a.webp', width: 296, height: 296, label: 'Quickdraw' },
        { src: 'badges/swoc-26.webp', width: 1563, height: 1563, label: 'SWOC 26' },
        { src: 'badges/yolo-default-be0bbff04951.webp', width: 296, height: 296, label: 'YOLO' },
        { src: 'badges/starstruck-default--light-a594e2a027e0.webp', width: 296, height: 296, label: 'Starstruck' },
        { src: 'badges/blob.webp', width: 2048, height: 2048, label: 'Blob' },
        { src: 'badges/blob (1).webp', width: 2048, height: 2048, label: 'Blob 1' },
        { src: 'badges/blob (2).webp', width: 2048, height: 2048, label: 'Blob 2' },
        { src: 'badges/cka_from_cncfsite__281_29.webp', width: 600, height: 600, label: 'CKA' }
    ];

    var ACCENTS = ['#00ff41', '#00ffff', '#ffaa00', '#8a2be2', '#0080ff', '#ff0040'];

    function badgeSrcset(badge) {
        var widths = [320].filter(function (width) { return width < badge.width; });
        var base = badge.src.replace(/\.[^.]+$/, '');
        return widths.map(function (width) {
            var candidate = `${base}-${width}.webp`;
            return candidate.split('/').map(encodeURIComponent).join('/') + ` ${width}w`;
        }).join(', ');
    }

    var STYLES = `
        .elastic-stack {
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            padding: 3rem 1rem;
            width: 100%;
            max-width: 1080px;
            margin: 0 auto;
        }

        .elastic-stack-bubble {
            --badge-accent: #00ff41;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            isolation: isolate;
            border-radius: 50%;
            border: 3px solid rgba(0, 0, 0, 0.85);
            box-shadow:
                0 0 0 3px color-mix(in srgb, var(--badge-accent) 32%, transparent),
                0 18px 32px -12px rgba(0, 0, 0, 0.75);
            background: radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--badge-accent) 30%, #0e1c1c), #071218);
            overflow: hidden;
            transition: transform 700ms, box-shadow 700ms;
            cursor: pointer;
            will-change: transform;
        }

        .elastic-stack-bubble:hover {
            box-shadow:
                0 0 0 3px color-mix(in srgb, var(--badge-accent) 60%, transparent),
                0 24px 42px -14px rgba(0, 0, 0, 0.85),
                0 0 26px color-mix(in srgb, var(--badge-accent) 45%, transparent);
        }

        .elastic-stack-bubble img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            pointer-events: none;
            padding: 8%;
            box-sizing: border-box;
            filter: drop-shadow(0 0 6px color-mix(in srgb, var(--badge-accent) 40%, transparent));
        }

        .elastic-stack-label {
            position: absolute;
            inset: auto auto -2.1rem 50%;
            transform: translateX(-50%);
            width: max-content;
            max-width: 7.5rem;
            color: color-mix(in srgb, var(--badge-accent) 78%, white 22%);
            font-family: var(--portfolio-font, 'Cormorant Garamond', Georgia, serif);
            font-size: .72rem;
            font-weight: 700;
            letter-spacing: .06em;
            line-height: 1.2;
            text-align: center;
            text-transform: uppercase;
            opacity: 0;
            pointer-events: none;
            transition: opacity 250ms ease 350ms;
        }

        .elastic-stack-bubble:hover .elastic-stack-label {
            opacity: 1;
        }

        @media (max-width: 760px) {
            .elastic-stack { padding: 2.5rem .5rem 3rem; }
        }
    `;

    function springEasing() {
        return 'linear(0, 0.79 14.4%, 1.026 22.4%, 1.164 31.2%, 1.207 38.2%, 1.208 46.2%, 1.033 80%, 1)';
    }

    function initElasticStack() {
        var container = document.getElementById('badgeStack');
        if (!container || container.dataset.stackReady === 'true') return;
        container.dataset.stackReady = 'true';

        if (!document.getElementById('elastic-stack-styles')) {
            var style = document.createElement('style');
            style.id = 'elastic-stack-styles';
            style.textContent = STYLES;
            document.head.appendChild(style);
        }

        container.innerHTML = '';
        container.className = 'elastic-stack';
        container.setAttribute('role', 'list');
        container.setAttribute('aria-label', 'Digital badges');

        var total = BADGES.length;
        var ITEM_SIZE = 93.45;
        var OVERLAP = 35;
        var PUSH_FORCE = 15;
        var hoveredIndex = null;

        var bubbles = [];

        BADGES.forEach(function (badge, i) {
            var accent = ACCENTS[i % ACCENTS.length];

            var bubble = document.createElement('div');
            bubble.className = 'elastic-stack-bubble';
            bubble.setAttribute('role', 'listitem');
            bubble.setAttribute('aria-label', badge.label + ' badge');
            bubble.style.setProperty('--badge-accent', accent);
            bubble.style.width = bubble.style.height = ITEM_SIZE + 'px';
            bubble.style.marginLeft = (i === 0 ? 0 : -OVERLAP) + 'px';
            bubble.style.zIndex = i;
            bubble.style.transitionTimingFunction = springEasing();

            var image = document.createElement('img');
            image.src = badge.src.split('/').map(encodeURIComponent).join('/');
            image.srcset = badgeSrcset(badge);
            image.sizes = '(max-width: 760px) 17vw, 93px';
            image.alt = badge.label;
            image.width = badge.width;
            image.height = badge.height;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.addEventListener('error', function () {
                image.alt = badge.label + ' badge unavailable';
            });

            var label = document.createElement('span');
            label.className = 'elastic-stack-label';
            label.textContent = badge.label;

            bubble.appendChild(image);
            bubble.appendChild(label);
            container.appendChild(bubble);
            bubbles.push(bubble);

            bubble.addEventListener('mouseenter', function () {
                hoveredIndex = i;
                applyLayout(false);
            });
        });

        container.addEventListener('mouseleave', function () {
            hoveredIndex = null;
            applyLayout(false);
        });

        function hovered(i) {
            return hoveredIndex !== null && hoveredIndex === i;
        }

        function applyLayout() {
            bubbles.forEach(function (bubble, i) {
                var translateX = 0;
                var scale = 1;
                var zIndex = i;

                if (hoveredIndex !== null) {
                    if (i > hoveredIndex) {
                        translateX = Math.min(PUSH_FORCE * (total - i - 1), OVERLAP);
                    } else if (i < hoveredIndex) {
                        translateX = -Math.min(PUSH_FORCE * i, OVERLAP);
                    } else {
                        scale = 1.25;
                        zIndex = 100;
                    }
                }

                bubble.style.transform = 'translateX(' + translateX + 'px) scale(' + scale + ')';
                bubble.style.zIndex = zIndex;
            });
        }

        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            bubbles.forEach(function (bubble) {
                bubble.style.transition = 'none';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initElasticStack, { once: true });
    } else {
        initElasticStack();
    }
})();