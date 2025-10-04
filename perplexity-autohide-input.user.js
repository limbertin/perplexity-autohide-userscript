// ==UserScript==
// @name         Perplexity Auto-hide Input & Header
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto-hide Perplexity input textbox and header, show on hover
// @author       You
// @match        https://www.perplexity.ai/*
// @match        https://perplexity.ai/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const HOVER_ZONE_HEIGHT = 120; // pixels from bottom to trigger show input
    const HEADER_HOVER_ZONE_HEIGHT = 80; // pixels from top to trigger show header
    const ANIMATION_DURATION = 300; // milliseconds

    // Settings with defaults
    let settings = {
        hideInput: GM_getValue('hideInput', true),
        hideHeader: GM_getValue('hideHeader', true)
    };

    // Register menu commands for toggles
    GM_registerMenuCommand(`${settings.hideInput ? '✅' : '❌'} Auto-hide Input Bar`, () => {
        settings.hideInput = !settings.hideInput;
        GM_setValue('hideInput', settings.hideInput);
        location.reload();
    });

    GM_registerMenuCommand(`${settings.hideHeader ? '✅' : '❌'} Auto-hide Header`, () => {
        settings.hideHeader = !settings.hideHeader;
        GM_setValue('hideHeader', settings.hideHeader);
        location.reload();
    });
    
    // Find the input container
    function findInputContainer() {
        return document.querySelector('div[class*="erp-sidecar:fixed"][class*="bottom-safeAreaInsetBottom"]');
    }

    // Find the header container
    function findHeaderContainer() {
        return document.querySelector('div[class*="bg-base"][class*="sticky-tabs-ref"][class*="top-0"]');
    }
    
    // Add CSS styles
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .perplexity-input-hidden {
                transform: translateY(100%) !important;
                opacity: 0.1 !important;
                transition: transform ${ANIMATION_DURATION}ms ease-in-out, opacity ${ANIMATION_DURATION}ms ease-in-out !important;
            }

            .perplexity-input-visible {
                transform: translateY(0) !important;
                opacity: 1 !important;
                transition: transform ${ANIMATION_DURATION}ms ease-in-out, opacity ${ANIMATION_DURATION}ms ease-in-out !important;
            }

            .perplexity-header-hidden {
                transform: translateY(-100%) !important;
                opacity: 0.1 !important;
                transition: transform ${ANIMATION_DURATION}ms ease-in-out, opacity ${ANIMATION_DURATION}ms ease-in-out !important;
            }

            .perplexity-header-visible {
                transform: translateY(0) !important;
                opacity: 1 !important;
                transition: transform ${ANIMATION_DURATION}ms ease-in-out, opacity ${ANIMATION_DURATION}ms ease-in-out !important;
            }

            .perplexity-hover-zone-bottom {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: ${HOVER_ZONE_HEIGHT}px;
                z-index: 9998;
                pointer-events: auto;
                background: transparent;
            }

            .perplexity-hover-zone-top {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: ${HEADER_HOVER_ZONE_HEIGHT}px;
                z-index: 9998;
                pointer-events: auto;
                background: transparent;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create hover zones
    function createHoverZones() {
        const zones = {};

        if (settings.hideInput) {
            const bottomZone = document.createElement('div');
            bottomZone.className = 'perplexity-hover-zone-bottom';
            document.body.appendChild(bottomZone);
            zones.bottom = bottomZone;
        }

        if (settings.hideHeader) {
            const topZone = document.createElement('div');
            topZone.className = 'perplexity-hover-zone-top';
            document.body.appendChild(topZone);
            zones.top = topZone;
        }

        return zones;
    }
    
    // Show/hide input
    function showInput(container) {
        container.classList.remove('perplexity-input-hidden');
        container.classList.add('perplexity-input-visible');
    }

    function hideInput(container) {
        container.classList.remove('perplexity-input-visible');
        container.classList.add('perplexity-input-hidden');
    }

    // Show/hide header
    function showHeader(container) {
        container.classList.remove('perplexity-header-hidden');
        container.classList.add('perplexity-header-visible');
    }

    function hideHeader(container) {
        container.classList.remove('perplexity-header-visible');
        container.classList.add('perplexity-header-hidden');
    }
    
    // Check if input has focus or content
    function isInputActive(container) {
        const textarea = container.querySelector('textarea');
        const input = container.querySelector('input[type="text"]');

        // Check if any input element within the container is focused
        const focusedElement = document.activeElement;
        const isInputFocused = container.contains(focusedElement) &&
                              (focusedElement.tagName === 'TEXTAREA' ||
                               focusedElement.tagName === 'INPUT' ||
                               focusedElement.contentEditable === 'true');

        if (textarea && (isInputFocused || textarea.value.trim())) {
            return true;
        }
        if (input && (isInputFocused || input.value.trim())) {
            return true;
        }

        return isInputFocused;
    }

    // Check if mouse is in bottom area of screen
    function isMouseInBottomArea(event) {
        const windowHeight = window.innerHeight;
        const mouseY = event.clientY;
        return mouseY > (windowHeight - HOVER_ZONE_HEIGHT);
    }
    
    // Initialize the auto-hide functionality
    function init() {
        console.log('Perplexity auto-hide script initializing...');

        // Add styles
        addStyles();

        // Create hover zones
        const hoverZones = createHoverZones();

        // Initialize input auto-hide
        if (settings.hideInput) {
            initInputAutoHide(hoverZones.bottom);
        }

        // Initialize header auto-hide
        if (settings.hideHeader) {
            initHeaderAutoHide(hoverZones.top);
        }

        // Setup observer for dynamic content
        setupObserver();

        console.log('Perplexity auto-hide script initialized');
    }

    // Initialize input auto-hide functionality
    function initInputAutoHide(hoverZone) {
        const container = findInputContainer();
        if (!container) {
            console.log('Perplexity input container not found, retrying...');
            setTimeout(() => initInputAutoHide(hoverZone), 1000);
            return;
        }

        console.log('Input auto-hide initialized');

        // Initially hide the input
        hideInput(container);

        let isHovering = false;
        let hideTimeout;

        // Show on hover zone enter
        hoverZone.addEventListener('mouseenter', () => {
            isHovering = true;
            clearTimeout(hideTimeout);
            showInput(container);
            console.log('Input shown - hover zone entered');
        });

        // Hide on hover zone leave (with delay)
        hoverZone.addEventListener('mouseleave', () => {
            isHovering = false;
            hideTimeout = setTimeout(() => {
                if (!isHovering && !isInputActive(container)) {
                    hideInput(container);
                    console.log('Input hidden - hover zone left');
                }
            }, 500); // 500ms delay before hiding
        });

        // Show on container hover
        container.addEventListener('mouseenter', () => {
            isHovering = true;
            clearTimeout(hideTimeout);
            showInput(container);
            console.log('Input shown - container hovered');
        });

        // Hide on container leave
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            hideTimeout = setTimeout(() => {
                if (!isHovering && !isInputActive(container)) {
                    hideInput(container);
                    console.log('Input hidden - container left');
                }
            }, 500);
        });

        // Always show when input is focused
        container.addEventListener('focusin', () => {
            clearTimeout(hideTimeout);
            showInput(container);
            console.log('Input shown - focused');
        });

        // Check if should hide when focus is lost
        container.addEventListener('focusout', () => {
            setTimeout(() => {
                if (!isHovering && !isInputActive(container)) {
                    hideInput(container);
                    console.log('Input hidden - focus lost');
                }
            }, 200);
        });

        // Simple click handler to hide input when clicking outside
        document.addEventListener('click', (event) => {
            // If clicking outside the container and not in bottom area
            if (!container.contains(event.target) && !isMouseInBottomArea(event)) {
                // Only hide if not currently typing
                if (!isInputActive(container)) {
                    clearTimeout(hideTimeout);
                    hideInput(container);
                    console.log('Input hidden - clicked outside');
                }
            }
        });
    }

    // Initialize header auto-hide functionality
    function initHeaderAutoHide(hoverZone) {
        const container = findHeaderContainer();
        if (!container) {
            console.log('Perplexity header container not found, retrying...');
            setTimeout(() => initHeaderAutoHide(hoverZone), 1000);
            return;
        }

        console.log('Header auto-hide initialized');

        // Initially hide the header
        hideHeader(container);

        let isHovering = false;
        let hideTimeout;

        // Show on hover zone enter
        hoverZone.addEventListener('mouseenter', () => {
            isHovering = true;
            clearTimeout(hideTimeout);
            showHeader(container);
        });

        // Hide on hover zone leave (with delay)
        hoverZone.addEventListener('mouseleave', () => {
            isHovering = false;
            hideTimeout = setTimeout(() => {
                if (!isHovering) {
                    hideHeader(container);
                }
            }, 500); // 500ms delay before hiding
        });

        // Show on container hover
        container.addEventListener('mouseenter', () => {
            isHovering = true;
            clearTimeout(hideTimeout);
            showHeader(container);
        });

        // Hide on container leave
        container.addEventListener('mouseleave', () => {
            isHovering = false;
            hideTimeout = setTimeout(() => {
                if (!isHovering) {
                    hideHeader(container);
                }
            }, 500);
        });
    }

    // Monitor for dynamic content changes
    function setupObserver() {
        const observer = new MutationObserver(() => {
            // Check if containers have changed and reinitialize if needed
            if (settings.hideInput) {
                const inputContainer = findInputContainer();
                if (inputContainer && !inputContainer.classList.contains('perplexity-input-hidden') && !inputContainer.classList.contains('perplexity-input-visible')) {
                    const hoverZones = createHoverZones();
                    if (hoverZones.bottom) initInputAutoHide(hoverZones.bottom);
                }
            }

            if (settings.hideHeader) {
                const headerContainer = findHeaderContainer();
                if (headerContainer && !headerContainer.classList.contains('perplexity-header-hidden') && !headerContainer.classList.contains('perplexity-header-visible')) {
                    const hoverZones = createHoverZones();
                    if (hoverZones.top) initHeaderAutoHide(hoverZones.top);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to load and initialize
    function startScript() {
        // Only run if at least one feature is enabled
        if (settings.hideInput || settings.hideHeader) {
            init();
        } else {
            console.log('Perplexity auto-hide: All features disabled');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }
})();
