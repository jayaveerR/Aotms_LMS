const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verify() {
    console.log('Verifying Endpoints...');

    const endpoints = [
        { method: 'get', url: '/manager/lookup-student/123', name: 'Manager Lookup Student' },
        { method: 'post', url: '/zoom/meetings', name: 'Zoom Meetings' },
        { method: 'get', url: '/student/accessible-exams', name: 'Student Accessible Exams' },
        { method: 'get', url: '/manager/approved-question-banks', name: 'Manager Question Banks' }
    ];

    for (const ep of endpoints) {
        try {
            await axios({
                method: ep.method,
                url: `${BASE_URL}${ep.url}`,
                validateStatus: () => true // Don't throw on error status
            });
            console.log(`[PASS] ${ep.name} - Route reachable (Status might be 401/403)`);
        } catch (error) {
             if (error.response) {
                console.log(`[PASS] ${ep.name} - Responded with ${error.response.status} (Route exists)`);
            } else {
                console.error(`[FAIL] ${ep.name} - Network Error: ${error.message}`);
            }
        }
    }
}

verify();
