/**
 * jspsych-html-keyboard-hiragana
 * Masanori Kobayashi
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 *
 **/


jsPsych.plugins["html-keyboard-japaneseTextInput"] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'html-keyboard-japaneseTextInput',
        description: '',
        parameters: {
            stimulus: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The HTML string to be displayed'
            },
            inputSystem: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'InputSystem',
                default: 'hiragana',
                description: 'Kana system will be displayed'
            },
            convertText: {
                type: jsPsych.plugins.parameterType.STRING,
                array: true,
                pretty_name: 'Default text',
                default: '<span class ="textCursor">|</span>',
                description: 'Text will be displayed before response.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed avobe the stimulus.'
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus duration',
                default: null,
                description: 'How long to hide the stimulus.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show trial before it ends.'
            },
            enter_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Enter ends trial',
                default: false,
                description: 'If true, trial will end when subject type enter key.'
            },

        }
    }

    plugin.trial = function (display_element, trial) {
        var romanResponse = '';
        var keyCharacter = '';

        var new_html = '<div id="jspsych-html-keyboard-japaneseTextInput-stimulus">' + trial.stimulus + '</div>';

        // add prompt
        if (trial.prompt !== null) {
            new_html += '<div id="jspsych-html-keyboard-japaneseTextInput-prompt">' + trial.prompt + '</div>';
        }

        // add Default text
        new_html += '<div id="jspsych-html-keyboard-japaneseTextInput-convertText">' + trial.convertText + '</div>'

        // draw
        display_element.innerHTML = new_html;

        // store response
        var response = {
            rt: null,
            key: null
        };

        var update_trial = function () {

            var update_html = '<div id="jspsych-html-keyboard-japaneseTextInput-stimulus">' + trial.stimulus + '</div>'

            if (trial.prompt != null) {
                update_html += '<div id="jspsych-html-keyboard-japaneseTextInput-prompt">' + trial.prompt + '</div>'
            }
            update_html += '<div id="jspsych-html-keyboard-japaneseTextInput-convertText">' + trial.convertText + '</div>'

            //draw
            display_element.innerHTML = update_html;

            // store response
            var response = {
                rt: null,
                key: null
            };
        }

        // function to end trial when it is time
        var end_trial = function () {

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // gather the data to store for the trial
            var trial_data = {
                "rt": response.rt,
                "stimulus": trial.stimulus,
                "textResponse": trial.convertText
            };

            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

        // function to handle responses by the subject
        var after_response = function (info) {
            //数字からアルファベットまでの場合
            response = info;
            keyCharacter = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key)
            if (keyCharacter == 'enter' && trial.enter_ends_trial == true) {
                end_trial();
            } else if (keyCharacter == 'backspace' | keyCharacter == 'delete') {
                romanResponse = romanResponse.slice(0, -1);
            } else if (keyCharacter.length == 1) {
                romanResponse += keyCharacter;
            }

            if (trial.inputSystem == 'hiragana') {
                trial.convertText = wanakana.toHiragana(romanResponse, {
                    customKanaMapping: {
                        n: 'n',
                        nn: 'ん'
                    }
                });
            } else if (trial.inputSystem == 'katakana') {
                trial.convertText = wanakana.toKatakana(romanResponse, {
                    customKanaMapping: {
                        n: 'n',
                        nn: 'ン'
                    }
                });
            }
            update_trial();
        };

        // start the response listener
        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: jsPsych.ALL_KEYS,
            rt_method: 'performance',
            persist: true,
            allow_held_key: false
        });

        // hide stimulus if stimulus_duration is set
        if (trial.stimulus_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function () {
                display_element.querySelector('#jspsych-html-keyboard-hiragana-stimulus').style.visibility = 'hidden';
            }, trial.stimulus_duration);
        }

        // end trial if trial_duration is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function () {
                end_trial();
            }, trial.trial_duration);
        }

    };
    return plugin;
})();