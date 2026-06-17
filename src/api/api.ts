export async function post(url: string, body: unknown) {
    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error sending:", error);
    }
}

export async function get(url: string) {
    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include",
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}: ${text}`);
        }

        return JSON.parse(text);
    } catch (error) {
        console.error("Error sending:", error);
        throw error;
    }
}

export async function delet(url: string) {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "include",
        });

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}: ${text}`);
        }

        return await JSON.parse(text);
    } catch (error) {
        console.error("Error sending:", error);
        throw error;
    }
}