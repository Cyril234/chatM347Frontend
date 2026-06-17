import {apiUrl} from "../config.ts";

export async function logout() {
    let response: Response;
    try {
        response = await fetch(apiUrl('/user/logout'), {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            console.error("Error in response: " + await response.json());
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}