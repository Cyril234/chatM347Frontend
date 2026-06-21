import type {RegisterRequest} from "../../types/authorization.ts";
import {apiUrl} from "../config.ts";

export async function register(body: RegisterRequest) {
    let response: Response;
    try {
        response = await fetch(apiUrl('/user'), {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error("Error in response.");
            return null;
        }

        const data = await response.json();

        window.location.href = "http://localhost:5173/home";

        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}