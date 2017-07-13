import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                answer: '',
                letters: [
                    {
                        value: '',
                        validation: null,
                    },
                ],
            };
        }


        pressedKeys = (e, letter, i) => {
            const lettersCopy = this.state.letters.slice();
            const charCode = (typeof e.which === "number") ? e.which : e.keyCode;
            const char = String.fromCharCode(charCode);


            lettersCopy.forEach((letter, i) => {
                console.log(`charCode: ${char}, letter:${letter.value}, validation: ${letter.validation}, lettersCopy[i].validation: ${lettersCopy[i].validation}, lettersCopy[i].value: ${lettersCopy[i].value}`);
                if (char === letter.value) {
                    lettersCopy[i].validation = true;
                    this.setState({
                        letters: lettersCopy,
                    });
                } else {
                    lettersCopy[i].validation = false;
                    this.setState({
                        letters: lettersCopy,
                    });
                }
            });
        };


        componentWillMount() {
            window.addEventListener("keypress", this.pressedKeys, false);
        }

        componentDidMount() {
            fetch(`http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
                .then(r => r.json())
                .then(data => {
                    console.log(data);
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
            window.removeEventListener("keypress", this.pressedKeys, false);
        }

        render() {

            if (!this.state.answer) {
                return null;
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
