import React, { useState } from "react";

const useControl = () => {
    const [res, setRes] = useState(30);
    const [video, setVideo] = useState("");
    const [font, setFont] = useState(30);
    const [image, setImage] = useState("");
    const [bright, setBright] = useState(1);
    const [contrast, setContrast] = useState(1);
    const [gamma, setGamma] = useState(1);

    const videoChange = (e) => {
        setVideo("");
        const uploadVideo = e.target.files[0];
        console.log(uploadVideo);
        const reader = new FileReader();

        reader.onload = (e) => {
            const base64 = e.currentTarget.result;
            console.log(base64);
            setVideo(base64);
        };

        reader.readAsDataURL(uploadVideo);
    };

    const resChange = (e) => {
        setRes(e.target.value);
    };

    const fontChange = (e) => {
        setFont(e.target.value);
    };

    const brightChange = (e) => {
        setBright(e.target.value);
    };

    const contrastChange = (e) => {
        setContrast(e.target.value);
    };

    const gammaChange = (e) => {
        setGamma(e.target.value);
    };

    const imageChange = (e) => {
        setImage("");
        const uploadImage = e.target.files[0];
        console.log(uploadImage);
        const reader = new FileReader();

        reader.onload = (e) => {
            const base64 = e.currentTarget.result;
            console.log(base64);
            setImage(base64);
        };

        reader.readAsDataURL(uploadImage);
    };

    return { video, setVideo, videoChange, res, setRes, font, setFont, image, setImage, bright, setBright, contrast, setContrast, gamma, setGamma, resChange, fontChange, imageChange, brightChange, contrastChange, gammaChange };
};

export default useControl;
