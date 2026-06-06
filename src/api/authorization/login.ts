import type {LoginRequest} from "../../types/authorization.ts";

export async function login(body: LoginRequest) {
    let response: Response;
    try {
        response = await fetch('http://localhost:8080/user/login', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error("Error in response: " + await response.json());
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}