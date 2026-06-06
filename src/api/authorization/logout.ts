export async function logout() {
    let response: Response;
    try {
        response = await fetch('http://localhost:8080/user/logout', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            console.error("Error in response: " + await response.json());
        }
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("displayName");
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}