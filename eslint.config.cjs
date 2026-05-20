const js = require('@eslint/js');
const globals = require('globals');

const appGlobals = {
    ActionEngine: 'readonly',
    AdapterBase: 'readonly',
    AdapterOBS: 'readonly',
    AdapterPRISM: 'readonly',
    AdapterStreamlabs: 'readonly',
    AdapterVMix: 'readonly',
    AdapterXSplit: 'readonly',
    CalibrationWizard: 'readonly',
    ComboTriggerUI: 'readonly',
    ConfigManager: 'readonly',
    Detector: 'readonly',
    Human: 'readonly',
    OBSWebSocket: 'readonly',
    PlatformBase: 'readonly',
    PlatformKick: 'readonly',
    PlatformStreamElements: 'readonly',
    PlatformStreamerBotKick: 'readonly',
    PlatformTrovo: 'readonly',
    PlatformTwitch: 'readonly',
    PlatformYouTube: 'readonly',
    TriggerEngine: 'readonly',
    TriggerHistory: 'readonly',
    TriggerUIBuilder: 'readonly',
    detectGassho: 'readonly',
    licenseManager: 'readonly'
};

const adapterGlobals = {
    AdapterBase: 'readonly',
    OBSWebSocket: 'readonly'
};

const platformGlobals = {
    PlatformBase: 'readonly'
};

module.exports = [
    {
        ignores: [
            'coverage/**',
            'dist/**',
            'node_modules/**'
        ]
    },
    {
        files: ['app.js', 'core/**/*.js', 'adapters/**/*.js', 'platforms/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: globals.browser
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                caughtErrors: 'none'
            }],
            'no-console': 'off'
        }
    },
    {
        files: ['app.js'],
        languageOptions: {
            globals: appGlobals
        }
    },
    {
        files: ['adapters/adapter-obs.js', 'adapters/adapter-streamlabs.js', 'adapters/adapter-vmix.js', 'adapters/adapter-xsplit.js'],
        languageOptions: {
            globals: adapterGlobals
        }
    },
    {
        files: ['platforms/platform-kick.js', 'platforms/platform-streamerbot-kick.js', 'platforms/platform-trovo.js', 'platforms/platform-twitch.js', 'platforms/platform-youtube.js'],
        languageOptions: {
            globals: platformGlobals
        }
    },
    {
        files: ['platforms/platform-streamelements.js'],
        languageOptions: {
            globals: platformGlobals
        }
    },
    {
        files: ['core/detector.js'],
        languageOptions: {
            globals: {
                Human: 'readonly'
            }
        }
    },
    {
        files: ['core/trigger-engine.js'],
        languageOptions: {
            globals: {
                detectGassho: 'readonly'
            }
        }
    }
];
