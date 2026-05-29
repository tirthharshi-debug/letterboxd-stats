import axios from 'axios';

const api = axios.create({
    baseURL: 'https://letterboxd-stats-vuaq.onrender.com/api',
    timeout: 30000, // 30s — uploads are fast now since processing is background
});

export async function uploadZip(file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (onUploadProgress && e.total) {
                onUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
        },
    });
    return response.data; // Now includes { success, message, job_id }
}

export async function getProgress(jobId) {
    const url = jobId ? `/progress/${jobId}` : '/progress';
    const response = await api.get(url);
    return response.data;
}

export async function getResults(jobId) {
    const url = jobId ? `/results/${jobId}` : '/results';
    const response = await api.get(url);
    return response.data;
}

export async function getCacheStats() {
    const response = await api.get('/cache-stats');
    return response.data;
}

export async function healthCheck() {
    const response = await api.get('/health');
    return response.data;
}
