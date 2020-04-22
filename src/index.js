import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: yellow[900],
        },
        secondary: {
            main: yellow[200],
        },
    },
});

function AppWithTheme() {
    return (
        <ThemeProvider theme={theme}><App/></ThemeProvider>
    );
}

ReactDOM.render(
  <AppWithTheme />, document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
