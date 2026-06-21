import type {LoginRequest} from "../../types/authorization.ts";
import {apiUrl} from "../config.ts";

export async function login(body: LoginRequest) {
    let response: Response;
    try {
        response = await fetch(apiUrl('/user/login'), {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error in response:", errorData);
            return null;
        }

        const data = await response.json();

        window.location.href = "http://localhost:5173/home";

        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}