/**
 * jspsych-html-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


document.addEventListener("DOMContentLoaded", function() {
    if (typeof jsPsych !== 'undefined') {
        // プラグインの定義
        class HtmlKeyboardHiraganaPlugin {
            constructor(jsPsych) {
                this.jsPsych = jsPsych;
            }

            static info = {
                name: 'html-keyboard-hiragana',
                parameters: {
                    stimulus: {
                        type: 'HTML_STRING',
                        pretty_name: 'Stimulus',
                        default: undefined,
                        description: 'The HTML string to be displayed'
                    },
                    inputBox: {
                        type: 'STRING',
                        pretty_name: 'Input Box',
                        default: '<span class="textCursor">|</span>',
                        description: 'Input box showing hiragana.'
                    },
                    prompt: {
                        type: 'STRING',
                        pretty_name: 'Prompt',
                        default: null,
                        description: 'Any content to display above the stimulus.'
                    },
                    stimulus_duration: {
                        type: 'INT',
                        pretty_name: 'Stimulus duration',
                        default: null,
                        description: 'How long to hide the stimulus.'
                    },
                    trial_duration: {
                        type: 'INT',
                        pretty_name: 'Trial duration',
                        default: null,
                        description: 'How long to show trial before it ends.'
                    },
                    enter_ends_trial: {
                        type: 'BOOL',
                        pretty_name: 'Enter ends trial',
                        default: false,
                        description: 'If true, trial will end when subject presses the Enter key.'
                    }
                }
            };

            trial(display_element, trial) {
                //ローマ字からひらがなへの変換
                //変換リスト
                const romanToHiraganaMap = {
                    'a': 'あ',
                    'i': 'い',
                    'u': 'う',
                    'e': 'え',
                    'o': 'お',
                    'ka': 'か',
                    'ki': 'き',
                    'ku': 'く',
                    'ke': 'け',
                    'ko': 'こ',
                    'sa': 'さ',
                    'si': 'し',
                    'su': 'す',
                    'se': 'せ',
                    'so': 'そ',
                    'ta': 'た',
                    'ti': 'ち',
                    'tu': 'つ',
                    'te': 'て',
                    'to': 'と',
                    'chi': 'ち',
                    'tsu': 'つ',
                    'na': 'な',
                    'ni': 'に',
                    'nu': 'ぬ',
                    'ne': 'ね',
                    'no': 'の',
                    'ha': 'は',
                    'hi': 'ひ',
                    'hu': 'ふ',
                    'he': 'へ',
                    'ho': 'ほ',
                    'fu': 'ふ',
                    'ma': 'ま',
                    'mi': 'み',
                    'mu': 'む',
                    'me': 'め',
                    'mo': 'も',
                    'ya': 'や',
                    'yi': 'い',
                    'yu': 'ゆ',
                    'ye': 'いぇ',
                    'yo': 'よ',
                    'ra': 'ら',
                    'ri': 'り',
                    'ru': 'る',
                    're': 'れ',
                    'ro': 'ろ',
                    'wa': 'わ',
                    'wyi': 'ゐ',
                    'wu': 'う',        
                    'wye': 'ゑ',
                    'wo': 'を',
                    'nn': 'ん',
                    'ga': 'が',
                    'gi': 'ぎ',
                    'gu': 'ぐ',
                    'ge': 'げ',
                    'go': 'ご',
                    'za': 'ざ',
                    'zi': 'じ',
                    'zu': 'ず',
                    'ze': 'ぜ',
                    'zo': 'ぞ',
                    'ji': 'じ',
                    'da': 'だ',
                    'di': 'ぢ',
                    'du': 'づ',
                    'de': 'で',
                    'do': 'ど',
                    'ba': 'ば',
                    'bi': 'び',
                    'bu': 'ぶ',
                    'be': 'べ',
                    'bo': 'ぼ',
                    'pa': 'ぱ',
                    'pi': 'ぴ',
                    'pu': 'ぷ',
                    'pe': 'ぺ',
                    'po': 'ぽ',
                    'kya': 'きゃ',
                    'kyu': 'きゅ',
                    'kyo': 'きょ',
                    'sya': 'しゃ',
                    'syu': 'しゅ',
                    'syo': 'しょ',
                    'sho': 'しょ',
                    'sha': 'しゃ',
                    'shu': 'しゅ',
                    'she': 'しぇ',
                    'shi': 'し',
                    'tya': 'ちゃ',
                    'tyi': 'ちぃ',
                    'tyu': 'ちゅ',
                    'tye': 'ちぇ',
                    'tyo': 'ちょ',
                    'cha': 'ちゃ',
                    'chu': 'ちゅ',
                    'che': 'ちぇ',
                    'cho': 'ちょ',
                    'nya': 'にゃ',
                    'nyi': 'にぃ',
                    'nyu': 'にゅ',
                    'nye': 'にぇ',
                    'nyo': 'にょ',
                    'hya': 'ひゃ',
                    'hyi': 'ひぃ',
                    'hyu': 'ひゅ',
                    'hye': 'ひぇ',
                    'hyo': 'ひょ',
                    'mya': 'みゃ',
                    'myi': 'みぃ',
                    'myu': 'みゅ',
                    'mye': 'みぇ',
                    'myo': 'みょ',
                    'rya': 'りゃ',
                    'ryi': 'りぃ',
                    'ryu': 'りゅ',
                    'rye': 'りぇ',
                    'ryo': 'りょ',
                    'gya': 'ぎゃ',
                    'gyi': 'ぎぃ',
                    'gyu': 'ぎゅ',
                    'gye': 'ぎぇ',
                    'gyo': 'ぎょ',
                    'zya': 'じゃ',
                    'zyi': 'じぃ',
                    'zyu': 'じゅ',
                    'zye': 'じぇ',
                    'zyo': 'じょ',
                    'ja': 'じゃ',
                    'ju': 'じゅ',
                    'je': 'じぇ',
                    'jo': 'じょ',
                    'jya': 'じゃ',
                    'jyi': 'じぃ',
                    'jyu': 'じゅ',
                    'jye': 'じぇ',
                    'jyo': 'じょ',
                    'dya': 'ぢゃ',
                    'dyi': 'ぢぃ',
                    'dyu': 'ぢゅ',
                    'dye': 'ぢぇ',
                    'dyo': 'ぢょ',
                    'bya': 'びゃ',
                    'byi': 'びぃ',
                    'byu': 'びゅ',
                    'bye': 'びぇ',
                    'byo': 'びょ',
                    'pya': 'ぴゃ',
                    'pyi': 'ぴぃ',
                    'pyu': 'ぴゅ',
                    'pye': 'ぴぇ',
                    'pyo': 'ぴょ',
                    'fa': 'ふぁ',
                    'fi': 'ふぃ',
                    'fe': 'ふぇ',
                    'fo': 'ふぉ',
                    'fya': 'ふゃ',
                    'fyu': 'ふゅ',
                    'fyo': 'ふょ',
                    'xa': 'ぁ',
                    'xi': 'ぃ',
                    'xu': 'ぅ',
                    'xe': 'ぇ',
                    'xo': 'ぉ',
                    'la': 'ぁ',
                    'li': 'ぃ',
                    'lu': 'ぅ',
                    'le': 'ぇ',
                    'lo': 'ぉ',
                    'lyu': 'ゅ',
                    'lya': 'ゃ',
                    'lyo': 'ょ',
                    'la': 'ぁ',
                    'li': 'ぃ',
                    'lu': 'ぅ',
                    'le': 'ぇ',
                    'lo': 'ぉ',
                    'xya': 'ゃ',
                    'xyu': 'ゅ',
                    'xyo': 'ょ',
                    'xtu': 'っ',
                    'xtsu': 'っ',
                    'wi': 'うぃ',
                    'we': 'うぇ',
                    'va': 'ヴぁ',
                    'vi': 'ヴぃ',
                    'vu': 'ヴ',
                    've': 'ヴぇ',
                    'vo': 'ヴぉ'
                };

            

                /*
                * roman -> hiragana
                *
                * @param (String) roman:
                * @return (String): hiragana
                */
                const romanToHiragana = (roman) => {
                    let hiragana = '';
                    for (let char of roman) {
                        hiragana += romanToHiraganaMap[char] || char;
                    }
                    return hiragana;
                };

                let romanResponse = '';
                let response = {
                    rt: null,
                    key: null
                };

                // 初期HTMLの生成
                let html = `<div id="jspsych-html-keyboard-hiragana-stimulus">${trial.stimulus}</div>`;
                if (trial.prompt) {
                    html += `<div id="jspsych-html-keyboard-hiragana-prompt">${trial.prompt}</div>`;
                }
                html += `<div id="jspsych-html-keyboard-hiragana-inputBox">${trial.inputBox}</div>`;

                display_element.innerHTML = html;

                const end_trial = () => {
                    this.jsPsych.pluginAPI.clearAllTimeouts();
                    this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

                    let trial_data = {
                        rt: response.rt,
                        stimulus: trial.stimulus,
                        hiraganaResponse: trial.inputBox
                    };

                    display_element.innerHTML = '';
                    this.jsPsych.finishTrial(trial_data);
                };

                const after_response = (info) => {
                    response = info;

                    if ((response.key >= 48 && response.key <= 90) || response.key === 189) {
                        romanResponse += this.jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(response.key);
                        trial.inputBox = romanToHiragana(romanResponse);
                    } else if (response.key === 8 || response.key === 46) {
                        romanResponse = romanResponse.slice(0, -1);
                        trial.inputBox = romanToHiragana(romanResponse);
                    } else if (response.key === 13 && trial.enter_ends_trial) {
                        end_trial();
                    }

                    display_element.querySelector('#jspsych-html-keyboard-hiragana-inputBox').innerHTML = trial.inputBox;
                };

                const keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: after_response,
                    valid_responses: this.jsPsych.ALL_KEYS,
                    rt_method: 'performance',
                    persist: true,
                    allow_held_key: false
                });

                if (trial.stimulus_duration !== null) {
                    this.jsPsych.pluginAPI.setTimeout(() => {
                        display_element.querySelector('#jspsych-html-keyboard-hiragana-stimulus').style.visibility = 'hidden';
                    }, trial.stimulus_duration);
                }

                if (trial.trial_duration !== null) {
                    this.jsPsych.pluginAPI.setTimeout(() => {
                        end_trial();
                    }, trial.trial_duration);
                }
            }
        }

        // プラグインの登録
        jsPsych.plugins['html-keyboard-hiragana'] = HtmlKeyboardHiraganaPlugin;
    } else {
        console.error('jsPsych is not loaded properly.');
    }
});