import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                answer: '',
                wrongLetters: 0,
                letters: [
                    {
                        value: '',
                        validation: null,
                    },
                ],
            };
        }


        pressedKeys = (e) => {
            const lettersCopy = this.state.letters.slice();
            const charCode = (typeof e.which === "number") ? e.which : e.keyCode;
            const char = String.fromCharCode(charCode);

            lettersCopy.forEach((letter, i) => {
                if (char.toUpperCase() === letter.value.toUpperCase()) {
                    lettersCopy[i].validation = true;
                    this.setState({
                        letters: lettersCopy,
                    });
                }
            });

            const isWrongLetter = letter => {
                return (letter.value.toUpperCase() === char.toUpperCase());
            };
            if (!lettersCopy.some(isWrongLetter)) {
                this.setState({
                    wrongLetters: this.state.wrongLetters + 1,
                });
                console.log("ZLE! Po raz " + this.state.wrongLetters);
            }
        };


        componentWillMount() {
            window.addEventListener("keypress", this.pressedKeys, false);
        }

        componentDidMount() {
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
                        letters: lettersArray,
                    });
                });
        }

        componentWillUnmount() {
            window.removeEventListener("keydown", this.pressedKeys, false);
        }

        render() {

            if (!this.state.answer) {
                return <h1>Loading...</h1>;
            }

            const answerInput = this.state.letters.map((letter, i) => {
                return <div key={letter.value + i}>
                    <em>{(this.state.letters[i].validation === true) ? letter.value : null}</em>
                </div>
            });

            return (
                <div className="container">
                    <h1>{this.state.answer}</h1>
                    <div className="body"></div>
                    <div className="missed-letters"></div>
                    <div className="answer">{answerInput}</div>
                </div>
            )
        }
    }

    ReactDOM.render(
        <App/>,
        document.querySelector('#app')
    );
});
