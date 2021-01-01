import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle); 
  const [openSignIn, setOpensignIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const handleOpen = () => {
    setOpen(true);
  };
  const [user, setUser] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions
      unsubscribe();
    }

  }, [user, username]);

 //UseEffect Runs a piece of code based on a specific condition
/*
 useEffect(() =>{
  //this is where the code runs
 }, [posts])
 thsi will run every single time post change
*/

useEffect(() =>{
  //this is where the code runs
  db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    // every time a new post is added, this code fires..
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })));

  })
 }, []);
/*
 const handleClose = () => {
  setOpen(false);
 };
 */

const signUp = (event) => {
  event.preventDefault();
  auth
  .createUserWithEmailAndPassword(email, password)
  .then((authUser) => {
    return authUser.user.updateProfile({
      displayName: username
    
    })
  })
  .catch((error) => alert(error.message))
  setOpen(false);
}

const signIn = (event) => {
  event.preventDefault();
  auth.signInWithEmailAndPassword(email, password)
  .catch((error) => alert(error.message))
  setOpensignIn(false);
}

  return (
    <div className="app"> 
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        //onclose is listener so if  we click some where outside the model , model get close
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <centre>
            <img
              className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
            </centre>
            <Input
              placeholder ="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder ="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder ="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={ signUp }>Signup</Button>
          </form> 
        </div>
        
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpensignIn(false)}
        //onclose is listener so if  we click some where outside the model , model get close
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <centre>
            <img
              className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
            />
            </centre>
            <Input
              placeholder ="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder ="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form> 
        </div>
        
      </Modal>

      {/*Header*/}
      <div className="app__header">
        <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />

      {user ? (
        <Button onClick={() => auth.signOut()}>LogOut</Button>
      ): (
         <div className="app__loginContainer">
           <Button onClick={() => setOpensignIn(true)}>Sign IN</Button>
           <Button onClick={handleOpen}>signUp</Button>
        </div>
      )}

      </div>  
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B9OmOLlFpIe/'
            //clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ): (
            <h3></h3>
        )}

    </div>
  );
}

export default App;
