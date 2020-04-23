import React, { useState } from 'react';
import ImageUploader from "react-images-upload";

const BillUpload = props => {
    const [pictures, setPictures] = useState([]);

    const onDrop = picture => {
        picture && props.setBillFile(picture);
        setPictures([...pictures, picture]);
    };

    return(
        <ImageUploader
            {...props}
            withIcon={true}
            withPreview={true}
            singleImage={true}
            onChange={onDrop}
            withLabel={true}
            imgExtension={[".jpg",".jpeg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
        />
    )
}

export default BillUpload;