import { Close, Room } from '@material-ui/icons';
import { useRef, useState } from 'react';
import './login.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({setShowLogin, myStorage, setCurrentUser}) {

    const [error, setError] = useState(false);

    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await axios.post('./users/login', user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser(res.data.username);
            toast("Login Successful!");
            setShowLogin(false);
            setError(false);
        } catch (err) {
            setError(true);
        }
    }

    return (
        <div className='loginContainer'>
            <div className='loginLogo'>
                <Room />
                Geo Reviews
            </div>
            <form onSubmit={ handleSubmit }>
                <input type="text" placeholder="Enter your username" ref={nameRef} />
                <input type="password" placeholder="Enter your password" ref={passwordRef} />
                <button className='loginBtn' type='submit'>Login</button>
                {error && 
                    <span className='failure'>Some error occured. Please try again!</span>
                }
                <Close className='loginCancel' style={{
                    fontSize:'1.1rem',
                }} onClick={() => setShowLogin(false)} />
            </form>
            <ToastContainer 
                autoClose={3000}
                theme="dark"
            />
        </div>
    )
}