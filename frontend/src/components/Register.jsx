import { Close, Room } from '@material-ui/icons';
import { useRef, useState } from 'react';
import './register.css';
import axios from 'axios';

export default function Register({setShowRegister}) {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            await axios.post('./users/register', newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    }

    return (
        <div className='registerContainer'>
            <div className='registerLogo'>
                <Room />
                Geo Reviews
            </div>
            <form onSubmit={ handleSubmit }>
                <input type="text" placeholder="Choose a username" ref={nameRef} />
                <input type="email" placeholder="Enter your email" ref={emailRef} />
                <input type="password" placeholder="Choose a password" ref={passwordRef} />
                <button className='registerBtn' type='submit'>Register</button>
                {success && 
                    <span className='success'>Success! You can login now!</span>
                }
                {error && 
                    <span className='failure'>Some error occured. Please try again!</span>
                }
                <Close className='registerCancel' style={{
                    fontSize:'1.1rem',
                }} onClick={() => setShowRegister(false)} />
            </form>
        </div>
    )
}