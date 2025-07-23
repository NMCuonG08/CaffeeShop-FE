export const checkTokenExpiration = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Debug logs
        console.log('Token payload:', payload);
        console.log('Token exp:', payload.exp);
        console.log('Current time:', currentTime);
        console.log('Token expired:', payload.exp < currentTime);
        
        return payload.exp < currentTime;
    } catch (error) {
        console.log('Error parsing token:', error);
        return true;
    }
}



