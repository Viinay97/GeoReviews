import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star, AccountCircle, PersonPinCircle, MyLocation } from '@material-ui/icons';
import './app.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const myStorage = window.localStorage;
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 28.6448,
        longitude: 77.2167,
        zoom: 4,
    });

    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get('/pins');
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getPins();
    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport(
            {...viewport, latitude: lat, longitude: long}
        )
    }

    const handleAddClick = (e) => {
        const {lng, lat} = e.lngLat;
        setNewPlace({
            long: lng,
            lat: lat,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long,
        }
        try {
            const res = await axios.post("/pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);
        }
    }

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            toast.info("Fetching your location!");
            navigator.geolocation.getCurrentPosition((position) => {
                toast.success("Location fetched successfully!");
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                setNewPlace({
                    long: lon,
                    lat: lat,
                });
            });
        }
    };

    const handleLogout = () => {
        alert("Are you sure you want to log out?");
        myStorage.removeItem("user");
        setCurrentUser(null);
    }

    return (
        <div className="App">
            <Map
                initialViewState={viewport}
                onViewportChange={(nextViewport) =>  setViewport(nextViewport)}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX}
                style={{width: '100vw', height: '100vh'}}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onDblClick={handleAddClick}
                transitionDuration='200'
            >
                {pins.map((p) => (
                    <>
                    <Marker 
                        longitude={p.long} 
                        latitude={p.lat} 
                        anchor="bottom"
                    >
                        <Room style={{ 
                                fontSize: viewport.zoom * 10, 
                                color: p.username === currentUser ? '#af0101': "#0039a6",
                                cursor: "pointer"
                             }}
                            onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                        />
                    </Marker>
                    {p._id === currentPlaceId && (
                        <Popup 
                            key={p._id}
                            longitude={p.long} 
                            latitude={p.lat}
                            anchor="left"
                            closeButton={true}
                            closeOnClick={false}
                            onClose={() => setCurrentPlaceId(null)}
                        >
                            <div className='card'>
                                <label>Place</label>
                                <h2 className='place'>{p.title}</h2>
                                <label>Review</label>
                                <p className='desc'>{p.desc}</p>
                                <label>Rating</label>
                                <div className="stars">
                                    {Array(p.rating).fill(<Star className='star'/>)}
                                </div>
                                <label>Information</label>
                                <span className='username'>Created by <b>{p.username}</b></span>
                                <span className='date'>{format(p.createdAt)}</span>
                            </div> 
                        </Popup>
                    )}
                    </>
                ))}
                {newPlace && (
                    <Popup 
                        longitude={newPlace.long} 
                        latitude={newPlace.lat}
                        anchor="left"
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => setCurrentPlaceId(null)}
                    >
                        <div className='card'>
                            <form className='pinForm' onSubmit={handleSubmit}>
                                <label>Title</label>
                                <input 
                                    placeholder="Enter a title"
                                    onChange={(e) => setTitle(e.target.value)} 
                                />
                                <label>Review</label>
                                <textarea 
                                    placeholder="Tell us about this place"
                                    onChange={(e) => setDesc(e.target.value)} 
                                />
                                <label>Rating</label>
                                <select onChange={(e) => setRating(e.target.value)}>
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                                <button className='submitButton' type='submit'>Add Pin</button>
                            </form>
                        </div>
                    </Popup>
                )}
                {currentUser ? (
                    <div>
                        <div className="userInfo">
                            <AccountCircle />
                            Welcome! <b>{currentUser}</b>
                        </div>
                        <button className="button logout" onClick={handleLogout}>Logout</button>
                        <button className='button location' onClick={handleLocationClick}>
                            <MyLocation style={{fontSize: '1.2rem', marginRight: '5px'}}/>
                            <p>Pin</p>
                        </button>
                    </div>
                ) : (
                    <div className="buttons">
                        <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
                        <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
                    </div>
                )}
                {showRegister && <Register setShowRegister={setShowRegister} />}
                {showLogin && (
                    <Login 
                        setShowLogin={setShowLogin} 
                        myStorage={myStorage} 
                        setCurrentUser={setCurrentUser} 
                    />
                )}
            <div className='appTitle'>
                <PersonPinCircle style={{fontSize:"2rem"}}/>
                Geo-Reviews
            </div>
        </Map>
        <ToastContainer 
            autoClose={3000}
            theme="dark"
        />
    </div>
  );
}

export default App;
