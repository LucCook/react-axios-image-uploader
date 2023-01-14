import {useState} from 'react'
import {axios} from 'axios'

function ImageUploader() {
    const [imgUrl, setImgUrl] = useState('')
    const [imgBase64, setImgBase64] = useState('')

    function encodeImageFileAsURL(element) {
        
        const file = element.target.files[0];
        const reader = new FileReader();
        reader.onloadend = function() {
          setImgBase64(reader.result)
        }
        reader.readAsDataURL(file)
      }
    
    function postImage(url, imgSrc) {
        //imgSrc can be either a url link to an image hosted online, or a base64 string returned from encodeImageFileAsURL
    
        /*
        NOTE: PostgreSQL has data size limits on the strings that can be put into text fields.
        This limit is fairly low at only 65Kb.
        
        Possible solutions are to store larger images by splitting the string to store in multiple columns in a specific images table
    
        OR
    
        Compress the image in the browser to a useable size, using some built in methods that I don't have working knowledge of yet

        The ideal solution would probably be a combination of the two, to compress images down to a few hundred Kb at most, then splitting this string up to avoid over-compression 

        Both of these solutions would still have a max image size limit, which can be enforced by validating the size property of element.target.files[0]
        */ 
        const objectToPost ={
            "image": imgSrc
        }
        return axios.post(url, objectToPost).then(({data}) => {
            return data
        })
    }
    
    function handleSubmit(e) {
        postImage('URL to submit to', (imgBase64 || imgUrl)) 
        // Uses the first truthy value from imgBase64 or imgUrl
    }

    return <div>
                <input type="file" accept="image/*" onChange={(e) => {encodeImageFileAsURL(e)}}/>
                <input type="text" value={imgUrl} placeholder="image url" onChange={(e) => {
                        setImgUrl(e.target.value)
                    }}/>
                <button onClick={(e) => {handleSubmit(e)}}>Upload Image</button>
            </div>
}

export default ImageUploader 
