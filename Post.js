import React,  { useState, useEffect } from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import firebase from 'firebase';
//import { Button } from '@material-ui/core';

function Post( {postId, user, username, caption, imageUrl} ) {

    const [comments, SetComments] = useState([]);
    const [comment, SetComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy("timestamp","desc")
            .onSnapshot((snapshot) => {
                SetComments(snapshot.docs.map(doc => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        SetComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg" 
                />
                <h3>{username}</h3>
            </div>

            <img className="post__image" alt={username} src={imageUrl} />

            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
                      
            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                    <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>
            {user && (

                <form className="post__commentBox">
                <input 
                    className="post__input"
                    type="text"
                    placeholder="Add a comment"
                    value={comment}
                    onChange={(e) => SetComment(e.target.value)}
                />

                <button 
                    className="post__button"
                    disabled={!comments}
                    type="submit"
                    onClick={postComment}
                >
                Post
                </button>
                </form>

            )}
            
        </div>

    )
}

export default Post
