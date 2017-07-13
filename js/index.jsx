import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    class App extends React.Component {


        render() {
            return (
                <section>
                    <h1>Hello World</h1>
                </section>
            )
        }
    }

    ReactDOM.render(
        <App/>,
        document.querySelector('#app')
    );
});
