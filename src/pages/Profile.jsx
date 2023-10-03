import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem';

const Profile = () => {
    const auth = getAuth();
    const [loading, setLoading] = useState(true)
    const [listing, setListings] = useState(null)
    const [changeDetails, setChangeDetails] = useState(false)
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const { name, email } = formData;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')

            const q = query(listingsRef, where('useRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            console.log(listings)
            setListings(listings)
            setLoading(false)
        }
        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    }
    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name
                })
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name
                })
            }
        } catch (e) {
            toast.error('Could not update profile details')
        }
    }
    const onChange = (e) => {
        setFormData((prevStat) => ({
            [e.target.id]: e.target.value
        }))
    }

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            await deleteDoc(doc(db, 'listings', listingId));
            const updatedListings = listing.filter((listing) => listing !== listingId)
            setListings(updatedListings);
            toast.success('Successfully deleted listing');
        }
    }
    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)
    return (
        <div className='profile'>
            <header className='profileHeader'>
                <p className='pageHeader'>My Profile</p>
                <button type='button' className='logOut' onClick={onLogout}>Logout</button>
            </header>
            <main>
                <div className='profileDetailsHeader'>
                    <p className='profileDetailsText'>Personal Details</p>
                    <p className='changePersonalDetails' onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevStat) => !prevStat)
                    }}>
                        {changeDetails ? 'Done' : 'Change'}
                    </p>
                </div>
                <div className='profileCard'>
                    <form>
                        <input type='text' id='name' className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
                        <input type='text' id='email' className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />
                    </form>
                </div>
                <Link to="/create-listing" className='createListing'>
                    <img src={homeIcon} alt='home' />
                    <p>Sell or Rent your home</p>
                    <img src={arrowRight} alt='arrow right' />
                </Link>
                {!loading && listing?.length > 0 && (
                    <>
                        <p className='listingText'>Your Listings</p>
                        <ul className='listingsList'>
                            {listing.map((listing) => (
                                <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />

                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    )
}

export default Profile