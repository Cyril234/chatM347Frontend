export async function post(url: string, body: unknown, auth: boolean) {

    console.log("****************api.ts****************");
    console.log(body)

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
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }

        const data = await response.json();
        console.log("Antwort:", data);
        return data;
    } catch (error) {
        console.error("Fehler beim Senden:", error);
    }
}

export async function get(url: string, auth: boolean) {
    try {
        let response: Response;

        if (auth) {
            console.log("auth true");

            response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
        } else {
            console.log("auth false");

            response = await fetch(url, {
                method: "GET",
                credentials: "include",
            });
        }

        const text = await response.text();

        console.log("Status:", response.status);
        console.log("Raw response:", text);

        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}: ${text}`);
        }

        const json = JSON.parse(text);

        console.log("Antwort:", json);

        return json;
    } catch (error) {
        console.error("Fehler beim Senden:", error);
        throw error;
    }
}