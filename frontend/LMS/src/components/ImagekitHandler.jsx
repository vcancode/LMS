import React, { useRef, useState } from "react";
import {
    upload,
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
} from "@imagekit/react";

const UploadAndPlayVideo = () => {
    const fileInputRef = useRef(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [progress, setProgress] = useState(0);

    // Fetch ImageKit authentication from backend
    const getAuthParams = async () => {
        const res = await fetch("http://localhost:5000/auth"); // your backend auth route
        if (!res.ok) throw new Error("Failed to get auth");
        return res.json();
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput?.files?.length) return alert("Select a file");

        const file = fileInput.files[0];

        let auth;
        try {
            auth = await getAuthParams();
        } catch (err) {
            console.error("Auth error:", err);
            return;
        }

        try {
            const response = await upload({
                file,
                fileName: file.name,
                publicKey: auth.publicKey,
                token: auth.token,
                expire: auth.expire,
                signature: auth.signature,
                onProgress: (evt) => setProgress((evt.loaded / evt.total) * 100),
            });

            console.log("Upload response:", response.url);
        } catch (err) {
            if (err instanceof ImageKitAbortError) console.error("Upload aborted");
            else if (err instanceof ImageKitInvalidRequestError) console.error("Invalid request");
            else if (err instanceof ImageKitUploadNetworkError) console.error("Network error");
            else if (err instanceof ImageKitServerError) console.error("Server error");
            else console.error("Unknown error:", err);
        }
    };

    return (
        <div>
            <input type="file" ref={fileInputRef} accept="video/mp4" />
            <button onClick={handleUpload}>Upload Video</button>
            <p>Upload progress: {progress.toFixed(2)}%</p>

            {videoUrl && (
                <video
                    src={videoUrl}
                    controls
                    width={600}
                    height={400}
                    style={{ backgroundColor: "black" }}
                />
            )}
        </div>
    );
};

export default UploadAndPlayVideo;
