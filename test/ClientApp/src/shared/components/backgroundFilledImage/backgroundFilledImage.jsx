import React from "react";
import Image from 'react-bootstrap/Image'
const BackgroundFilledImage = ({ pct }) => {
    const style = {
        background: `linear-gradient(transparent ${100 - pct}%, red ${100 - pct}%)`
    };
    return <Image height={48} width={48} rounded src="https://storageaccountcore2ad3a.blob.core.windows.net/logoimg/user.png"></Image>
}
export default BackgroundFilledImage