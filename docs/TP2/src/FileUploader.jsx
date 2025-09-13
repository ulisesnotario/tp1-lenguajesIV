import { useState } from "react";
import "./FileUploader.css";

function FileUploader() {
    const [fileInfo, setFileInfo] = useState(null);
    const [error, setError] = useState(null);

    function humanSize(bytes) {
        const units = ["B", "KB", "MB", "GB"];
        let u = 0, n = bytes;
        while (n >= 1024 && u < units.length - 1) {
            n /= 1024;
            u++;
        }
        return `${n.toFixed(n < 10 ? 2 : 0)} ${units[u]}`;
    }

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError(`El archivo ${file.name} no es una imagen.`);
            setFileInfo(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(`La imagen ${file.name} supera el límite de 5 MB.`);
            setFileInfo(null);
            return;
        }

        const url = URL.createObjectURL(file);

        setFileInfo({
            name: file.name,
            type: file.type,
            size: humanSize(file.size),
            lastModified: new Date(file.lastModified).toLocaleString(),
            url,
        });
        setError(null);
    };

    return (
        <div className="uploader">
            <h2>Subir imagen</h2>
            <input type="file" onChange={handleFile} />

            {error && <p className="error">{error}</p>}

            {fileInfo && (
                <div className="preview">
                    <img src={fileInfo.url} alt="Preview" />
                    <p><strong>Nombre:</strong> {fileInfo.name}</p>
                    <p><strong>Tipo:</strong> {fileInfo.type}</p>
                    <p><strong>Tamaño:</strong> {fileInfo.size}</p>
                    <p><strong>Última modificación:</strong> {fileInfo.lastModified}</p>
                </div>
            )}
        </div>
    );
}

export default FileUploader;
