import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — Dynamic Meta Tags & Virtual Routing (History API)
 *
 * Updates the browser URL, page title, and meta description
 * whenever the user enters/exits a 3D room. Also handles the
 * browser back/forward buttons for seamless navigation.
 */

// UPDATE THIS to the real deployed origin when publishing the Creative site.
// Keep it in sync with the canonical URL in index.html.
const SITE_ORIGIN = 'https://gooichand-github-io.vercel.app';

// The path this app is served under. It matches the Vite `base` in vite.config.js:
// '/Creative/' when deployed as a folder on the shared host, '/' for a root deploy.
const BASE_PATH = import.meta.env.BASE_URL || '/';

const ROOM_META = {
    null: {
        path: '',
        title: 'Gopichand Dandimeni — Creative 3D Portfolio',
        description: 'Interactive 3D portfolio by Gopichand Dandimeni. Explore Cyber Security & Digital Forensics projects, WebGL experiments and hand-drawn gallery cards in an immersive 3D space.',
    },
    about: {
        path: 'about',
        title: 'About Me — Gopichand Dandimeni',
        description: 'Learn about Gopichand Dandimeni — a Cybersecurity & Digital Forensics specialist who builds immersive 3D web experiences with React, Three.js, and GSAP.',
    },
    gallery: {
        path: 'gallery',
        title: 'Gallery & Projects — Gopichand Dandimeni',
        description: 'Browse the interactive 3D gallery of projects by Gopichand Dandimeni. Each project is displayed as a hand-drawn card you can flip and explore.',
    },
    studio: {
        path: 'studio',
        title: 'The Studio — Gopichand Dandimeni',
        description: 'Explore Gopichand\'s studio — GitHub repos, security research, and field notes displayed on floating monitors in an immersive 3D space.',
    },
    contact: {
        path: 'contact',
        title: 'Contact — Gopichand Dandimeni',
        description: 'Get in touch with Gopichand Dandimeni. Find social media links and contact information in this interactive 3D contact room.',
    },
};

// Map (base-relative) URL paths back to room IDs for deep linking.
const PATH_TO_ROOM = {
    '': null,
    about: 'about',
    gallery: 'gallery',
    studio: 'studio',
    contact: 'contact',
};

/**
 * Returns the room ID that the initial URL points to (for deep linking).
 * Call this once at app startup to determine if we need to auto-teleport.
 */
export function getInitialRoomFromUrl() {
    let path = window.location.pathname;
    if (BASE_PATH !== '/' && path.startsWith(BASE_PATH)) {
        path = path.slice(BASE_PATH.length);
    } else if (path.startsWith('/')) {
        path = path.slice(1);
    }
    path = path.replace(/\/+$/, '');
    return PATH_TO_ROOM[path] !== undefined ? PATH_TO_ROOM[path] : null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined); // Track what we last pushed to avoid duplicates

    // Update document meta and URL when room changes
    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = ROOM_META[roomKey] || ROOM_META['null'];
        const url = `${BASE_PATH}${meta.path}`;

        // Update the page title
        document.title = meta.title;

        // Update meta description
        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        // Update OG meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `${SITE_ORIGIN}${url}`);

        // Update canonical link to ensure virtual routes are correctly indexable as separate pages
        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', `${SITE_ORIGIN}${url}`);
        }

        // Push to browser history (only if not handling a popstate event and room actually changed)
        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            // Use replaceState for the very first load, pushState for subsequent navigations
            if (lastPushedRoom.current === undefined) {
                window.history.replaceState({ room: currentRoom }, '', url);
            } else {
                window.history.pushState({ room: currentRoom }, '', url);
            }
            lastPushedRoom.current = currentRoom;
        }

        isHandlingPopState.current = false;
    }, [currentRoom]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom === null) {
                // Going back to corridor — we don't teleport, just need to trigger exit
                // The SceneContext requestExit will handle the animation
                // For now, we update meta immediately
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                // Teleport to the target room
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}
