import React, { useState } from 'react'
import './PostCheck.css'

const PostCheck = () => {

  const [postToCheck, setPostToCheck] = useState("");
  const [postConfirmation, setPostConfirmation] = useState(null)
  // const [postToTweet, setPostToTweet] = useState("");

  const checkPost = async (postToCheck) => {
    if(postToCheck.trim() === ""){
      alert("No Text Entered");
      return;
    }

    const prompt = `Check "${postToCheck}" for grammartical error and correct and start the result with "The correct sentence is: "`

    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        }),
    });

    const data = await response.json();
    // console.log(data);
    
    if (data.candidates && data.candidates.length > 0) {
      setPostConfirmation(data.candidates[0].content.parts[0].text);
  } else {
      setPostConfirmation("I have nothing to say at the moment");
  }
} catch (error) {
  console.error("Error checking post:", error);
  setPostConfirmation("Failed to perform check");
}
  }

  const tweetPost = (postConfirmation, postToCheck) => {
    const post = postConfirmation;
    const post2 =postToCheck;


    const postToTweet = post.match(/The correct sentence is:\s*"([^"]+)"/);
    if (postToTweet) {
      const text = encodeURIComponent(postToTweet[1]);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
      
    } else{
      const text = post2;
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    }
  }



  return (
    <div className='post-check'>
      <div className="check-btn">
        <button onClick={()=>checkPost(postToCheck)}>CHECK</button>
      </div>
      <div className="post-input">
        <textarea value={postToCheck} onChange={(e) => setPostToCheck(e.target.value)} name="post-input-box" placeholder='Paste your post to check error' id=""></textarea>
      </div>
      {postConfirmation && (
        <div className='postConfirmation'>
          <h3>Post Confirmation:</h3>
          <p className='postConfirmationText'>{postConfirmation}</p>
        </div>
      )
      }
      {postConfirmation && (
        <button 
        className="tweet-btn" 
        onClick={() => {tweetPost(postConfirmation, postToCheck)}}
      >
        TWEET
      </button>
      )}
    </div>
  )
}

export default PostCheck