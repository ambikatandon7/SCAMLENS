import React, { useEffect } from 'react';

declare global {
  interface Window {
    botpress?: {
      init: (config: any) => void;
      open: () => void;
      close: () => void;
      toggle: () => void;
      on: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

/**
 * ============================================================================
 * BOTPRESS EMBED CONFIGURATION FOR SCAMLENS
 * ============================================================================
 * To update or replace your chatbot configuration, you can edit this object
 * or update the configUrl from Botpress Cloud:
 * https://files.bpcontent.cloud/2026/11/17/12/20261117124236-LKGSRCAQ.json
 */
export const BOTPRESS_CONFIG = {
  // Remote configuration URL from your Botpress shareable link
  configUrl: 'https://files.bpcontent.cloud/2026/11/17/12/20261117124236-LKGSRCAQ.json',
  
  // Official identifiers extracted directly from your Botpress configUrl
  botId: '640cdc8e-8e39-4a73-b6a3-aa322fa92932',
  clientId: 'ebd3f86a-0d2d-46b4-9896-d6418fea2d62',

  // Embedded baseline configuration (with SCAMLENS dark theme styling)
  configuration: {
    version: 'v2',
    botName: 'SCAMLENS',
    botDescription: 'Friendly guidance to help you recognize online scams and verify suspicious messages safely.',
    website: {},
    email: {},
    phone: {},
    termsOfService: {},
    privacyPolicy: {},
    feedbackEnabled: true,
    allowFileUpload: true,
    soundEnabled: true,
    conversationHistory: true,
    homePageEnabled: true,
    welcomeHeading: 'Stay safer online',
    welcomeSubtitle: 'Ask about scam warning signs or share a suspicious message without private information.',
    conversationStartersEnabled: false,
    conversationStarters: [],
    conversationStartersDisplayStyle: 'cards',
    citationsEnabled: true,

    // SCAMLENS Dark Cyber Aesthetics: Electric cyan accents & dark charcoal interface
    themeMode: 'dark',
    theme: 'dark',
    color: '#00f0ff',
    themeColor: '#00f0ff',
    radius: 1
  }
};

export const BotpressChatbot: React.FC = () => {
  useEffect(() => {
    const SCRIPT_ID = 'botpress-webchat-inject-script';

    const initializeBotpress = async () => {
      if (!window.botpress) return;

      let finalConfig = {
        botId: BOTPRESS_CONFIG.botId,
        clientId: BOTPRESS_CONFIG.clientId,
        configuration: { ...BOTPRESS_CONFIG.configuration }
      };

      // Try fetching latest remote config from Botpress cloud CDN
      try {
        const res = await fetch(BOTPRESS_CONFIG.configUrl);
        if (res.ok) {
          const remoteJson = await res.json();
          finalConfig = {
            botId: remoteJson.botId || BOTPRESS_CONFIG.botId,
            clientId: remoteJson.clientId || BOTPRESS_CONFIG.clientId,
            configuration: {
              ...(remoteJson.configuration || {}),
              // Enforce SCAMLENS dark cyber theme & electric blue accents
              themeMode: 'dark',
              theme: 'dark',
              color: '#00f0ff',
              themeColor: '#00f0ff',
              radius: 1
            }
          };
        }
      } catch (err) {
        console.warn('[Botpress] Could not fetch remote config, using embedded configuration:', err);
      }

      try {
        window.botpress.init(finalConfig);
      } catch (initErr) {
        console.warn('[Botpress] Initialization error:', initErr);
      }
    };

    // If script is already in the document, just initialize
    if (document.getElementById(SCRIPT_ID)) {
      if (window.botpress) {
        initializeBotpress();
      }
      return;
    }

    // Inject Botpress v2.2 official webchat script
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    script.async = true;
    script.onload = () => {
      initializeBotpress();
    };
    script.onerror = (e) => {
      console.warn('[Botpress] Failed to load inject.js:', e);
    };

    document.body.appendChild(script);

    return () => {
      // Do not remove on route transitions so chat history stays persistent across pages
    };
  }, []);

  return null;
};

export default BotpressChatbot;
