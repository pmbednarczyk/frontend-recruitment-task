import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    class App extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                answer: '',
            };
        }

        componentDidMount() {
            fetch(`http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`)
                .then(r => r.json())
                .then(data => {
                console.log(data);
                    this.setState({
                        answer: data.word
                    });
                });
        }

        render() {
            if (!this.state.answer) {
                return null;
            }
            return (

                <div className="container">
                    <h1>{this.state.answer}</h1>
                    <div className="body"></div>
                    <div className="missed-letters"></div>
                    <div className="answer"></div>
                </div>
            )
        }
    }
    const letters = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ";
    ReactDOM.render(
        <App/>,
        document.querySelector('#app')
    );
});
