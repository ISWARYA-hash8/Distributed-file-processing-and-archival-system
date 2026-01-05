export const saveToken = (token) => {
	// Normalize possible shapes: string, { token: string }, { accessToken: string }
	if (!token) return;
	let raw = token;
	if (typeof token === "object") {
		if (typeof token.token === "string") raw = token.token;
		else if (typeof token.accessToken === "string") raw = token.accessToken;
		else if (typeof token.data === "string") raw = token.data;
		else raw = JSON.stringify(token);
	}
	localStorage.setItem("token", raw);
};

export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");
export const isLoggedIn = () => !!getToken();
