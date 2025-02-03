import "./App.css";
import LoginCover from "./components/LoginCover.tsx";

function App() {

    return (
        <>
            <div className={'container container-left'}>

                {window.location.href}
                <br/>
                {import.meta.env.VITE_CLIENT_ID}

                <a href='https://github.com/electron-vite/electron-vite-react' target='_blank'>Klick mich</a>

            </div>

            <div className={'container container-center'}>
                <LoginCover/>
            </div>

            <div className={'container container-right'}>

            </div>
        </>
    )
}

export default App