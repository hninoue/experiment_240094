/**
 * jspsych-html-keyboard-hiragana
 * Masanori Kobayashi
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 *
 **/

var jsPsychHtmlKeyboardJapaneseTextInputPlugin = (function (jspsych) {
    "use strict";

    // プラグイン情報の定義
    const info = {
        name: "jsPsychHtmlKeyboardJapaneseTextInput",
        description: '',
        parameters: {
            stimulus: {
                type: "string",
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The HTML string to be displayed'
            },
            inputSystem: {
                type: "string",
                pretty_name: 'InputSystem',
                default: 'hiragana',
                description: 'Kana system will be displayed'
            },
            convertText: {
                type: "string",
                array: true,
                pretty_name: 'Default text',
                default: '<span class ="textCursor">|</span>',
                description: 'Text will be displayed before response.'
            },
            prompt: {
                type: "string",
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed avobe the stimulus.'
            },
            stimulus_duration: {
                type: "int",
                pretty_name: 'Stimulus duration',
                default: null,
                description: 'How long to hide the stimulus.'
            },
            trial_duration: {
                type: "int",
                pretty_name: 'Trial duration',
                default: null,
                description: 'How long to show trial before it ends.'
            },
            enter_ends_trial: {
                type: "bool",
                pretty_name: 'Enter ends trial',
                default: false,
                description: 'If true, trial will end when subject type enter key.'
            }
        }
    };

    // プラグイン本体
    class HtmlKeyboardJapaneseTextInputPlugin {
        constructor(jsPsych) {
            this.jsPsych = jsPsych;
        }


        trial(display_element, trial) {
            var romanResponse = '';
            var keyCharacter = '';

            var new_html = '<div id="jspsych-html-keyboard-japaneseTextInput-stimulus">${trial.stimulus}</div>';

            // add prompt
            if (trial.prompt !== null) {
                new_html += '<div id="jspsych-html-keyboard-japaneseTextInput-prompt">${trial.prompt}</div>';
            }

            // add Default text
            new_html += '<div id="jspsych-html-keyboard-japaneseTextInput-convertText">${trial.convertText}</div>'

            // draw
            display_element.innerHTML = new_html;

            // store response
            var response = {
                rt: null,
                key: null
            };

            var update_trial = () => {

                var update_html = '<div id="jspsych-html-keyboard-japaneseTextInput-stimulus">${trial.stimulus}</div>'

                if (trial.prompt != null) {
                    update_html += '<div id="jspsych-html-keyboard-japaneseTextInput-prompt">${trial.prompt}</div>'
                }
                update_html += '<div id="jspsych-html-keyboard-japaneseTextInput-convertText">${trial.convertText}</div>'

                //draw
                display_element.innerHTML = update_html;

                // store response
                var response = {
                    rt: null,
                    key: null
                };
            };

            // function to end trial when it is time
            var end_trial = () => {

                // kill any remaining setTimeout handlers
                this.jsPsych.pluginAPI.clearAllTimeouts();

                // kill keyboard listeners
                if (typeof keyboardListener !== 'undefined') {
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
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
                this.jsPsych.finishTrial(trial_data);
            };

            // function to handle responses by the subject
            var after_response = (info) => {
                //数字からアルファベットまでの場合
                response = info;
                keyCharacter = this.jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
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
            var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: this.jsPsych.ALL_KEYS,
                rt_method: 'performance',
                persist: true,
                allow_held_key: false
            });

            // hide stimulus if stimulus_duration is set
            if (trial.stimulus_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    display_element.querySelector('#jspsych-html-keyboard-hiragana-stimulus').style.visibility = 'hidden';
                }, trial.stimulus_duration);
            }

            // end trial if trial_duration is set
            if (trial.trial_duration !== null) {
                this.jsPsych.pluginAPI.setTimeout(() => {
                    end_trial();
                }, trial.trial_duration);
            }
        }
    }
  
    // プラグイン情報の追加
    jsPsychHtmlKeyboardJapaneseTextInputPlugin.info = info;

    return jsPsychHtmlKeyboardJapaneseTextInputPlugin;

    })(jsPsych);