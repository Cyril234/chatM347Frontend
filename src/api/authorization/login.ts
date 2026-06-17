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
            console.error("Error in response: " + await response.json());
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}