export async function post(url: string, body: unknown, auth: boolean) {

    try {
        let response: Response;
        if (auth) {
            console.log("auth true")
            response = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
        }else{
            console.log("auth false")

            response = await fetch(url, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("answer:", data);
        return data;
    } catch (error) {
        console.error("Error sending:", error);
    }
}

export async function get(url: string, auth: boolean) {
    try {
        let response: Response;

        if (auth) {
            response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
        } else {
            response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
        }

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP-Error: ${response.status}: ${text}`);
        }

        const json = JSON.parse(text);

        console.log("answer:", json);

        return json;
    } catch (error) {
        console.error("Error sending:", error);
        throw error;
    }
}