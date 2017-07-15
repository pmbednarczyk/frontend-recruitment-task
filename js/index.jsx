import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                answer: '',
                wrongLettersCounter: 0,
                missedLetters: [],
                letters: [
                    {
                        value: '',
                        validation: null,
                    },
                ],
            };
        }

        // Core function responsible for pressing keys
        pressedKeys = (e) => {
            const lettersCopy = this.state.letters.slice();
            const charCode = (typeof e.which === "number") ? e.which : e.keyCode;
            const char = String.fromCharCode(charCode);

            // If letter pressed is correct
            lettersCopy.forEach((letter, i) => {
                if (char.toUpperCase() === letter.value.toUpperCase()) {
                    lettersCopy[i].validation = true;
                    this.setState({
                        letters: lettersCopy,
                    });
                }
            });

            // If letter is wrong
            const isWrongLetter = letter => {
                return (letter.value.toUpperCase() === char.toUpperCase());
            };
            if (!lettersCopy.some(isWrongLetter) && this.state.wrongLettersCounter < 11) {
                this.state.missedLetters.push(char.toUpperCase());
                this.setState({
                    wrongLettersCounter: this.state.wrongLettersCounter + 1,
                });
            }
        };

        // Generating hangman parts
        getHangmanParts = () => {
            const hangmanPart = [...this.state.missedLetters].map((letter, i) => {
                console.log(i);
                return <div
                    key={letter + i}
                    className={`hangman__part${i + 1}`}
                    style={{display: this.state.wrongLettersCounter > i ? 'block' : 'none'}}>
                </div>
            });
            return hangmanPart
        };

        // Generating new word after game is over (I believe it could be done in an easier way).
        handleNewWordClick = () => {
            fetch(`http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=8&maxLength=12&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
                .then(r => r.json())
                .then(data => {
                    const lettersArray = [...data.word].map((letter) => {
                        return {
                            value: letter,
                            validation: null,
                        }
                    });
                    this.setState({
                        answer: data.word,
                        wrongLettersCounter: 0,
                        missedLetters: [],
                        letters: lettersArray,
                    });
                });
        };

        //Attaching global event listener
        componentWillMount() {
            window.addEventListener("keypress", this.pressedKeys, false);
        }

        //Fetching random word
        componentDidMount() {
            fetch(`http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=8&maxLength=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
                .then(r => r.json())
                .then(data => {
                    const lettersArray = [...data.word].map((letter) => {
                        return {
                            value: letter,
                            validation: null,
                        }
                    });
                    this.setState({
                        answer: data.word,
                        letters: lettersArray,
                    });
                });
        }

        //Removing global event listener
        componentWillUnmount() {
            window.removeEventListener("keydown", this.pressedKeys, false);
        }

        render() {
            // Show this if random word is not generated
            if (!this.state.answer) {
                return <h1 className="loading">Loading...</h1>;
            }

            // Creating empty board for letters, it gets filed if letter is correct
            const answerInput = this.state.letters.map((letter, i) => {
                return <div className="answer__single-letter" key={letter.value + i}>
                    <em>{(this.state.letters[i].validation === true) ? letter.value : null}</em>
                </div>
            });

            return (
                // I was considering dividing it into components, but IMO there's no need.
                <div className="container">
                    <div className="answer small">{answerInput}</div>
                    <div className="missed-letters">
                        <h2 className="missed-letters__header">You missed:</h2>
                        <span className="missed-letters__single-letters">{this.state.missedLetters}</span>
                    </div>
                    <div className="hangman__bar"></div>
                    <div className={`hangman ${this.state.wrongLettersCounter >= 11 ? "hangman-swing" : ''}`}>
                        {this.getHangmanParts()}
                    </div>
                    <div className="answer desktop">{answerInput}</div>
                    <div className="game-over"
                         style={{display: this.state.wrongLettersCounter >= 11 ? "flex" : "none"}}>
                        <h3 className="game-over__header">GAME OVER</h3>
                        <span className="game-over__button" onClick={this.handleNewWordClick}>NEW WORD</span>
                    </div>
                </div>
            )
        }
    }

    ReactDOM.render(
        <App/>,
        document.querySelector('#app')
    );
});
