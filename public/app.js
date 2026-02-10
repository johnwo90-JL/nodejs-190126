const storageKeys = {
    accessToken: "demo.auth.accessToken",
    refreshToken: "demo.auth.refreshToken"
};

const elements = {
    apiBase: document.querySelector("#api-base"),
    loginForm: document.querySelector("#login-form"),
    email: document.querySelector("#email"),
    password: document.querySelector("#password"),
    refreshBtn: document.querySelector("#refresh-btn"),
    logoutPostBtn: document.querySelector("#logout-post-btn"),
    logoutGetBtn: document.querySelector("#logout-get-btn"),
    accessToken: document.querySelector("#access-token"),
    refreshToken: document.querySelector("#refresh-token"),
    wsStatus: document.querySelector("#ws-status"),
    wsUseAccessToken: document.querySelector("#use-access-token"),
    wsConnectBtn: document.querySelector("#ws-connect-btn"),
    wsDisconnectBtn: document.querySelector("#ws-disconnect-btn"),
    wsMessage: document.querySelector("#ws-message"),
    wsSendBtn: document.querySelector("#ws-send-btn"),
    eventLog: document.querySelector("#event-log")
};

let socket = null;

function formatTimestamp() {
    return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function logEvent(message) {
    const line = `[${formatTimestamp()}] ${message}`;
    elements.eventLog.textContent = `${line}\n${elements.eventLog.textContent}`.trim();
}

function getApiBase() {
    const fromInput = elements.apiBase.value.trim();

    if (!fromInput) {
        return window.location.origin;
    }

    return fromInput.replace(/\/+$/, "");
}

function readTokens() {
    return {
        accessToken: localStorage.getItem(storageKeys.accessToken) || "",
        refreshToken: localStorage.getItem(storageKeys.refreshToken) || ""
    };
}

function writeTokens(tokens) {
    if (tokens.accessToken) {
        localStorage.setItem(storageKeys.accessToken, tokens.accessToken);
    }

    if (tokens.refreshToken) {
        localStorage.setItem(storageKeys.refreshToken, tokens.refreshToken);
    }

    syncTokenViews();
}

function clearTokens() {
    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.refreshToken);
    syncTokenViews();
}

function syncTokenViews() {
    const { accessToken, refreshToken } = readTokens();

    elements.accessToken.value = accessToken;
    elements.refreshToken.value = refreshToken;
}

function setWsStatus(connected) {
    elements.wsStatus.textContent = connected ? "Connected" : "Disconnected";
    elements.wsStatus.classList.toggle("connected", connected);
}

async function requestJson(path, options = {}) {
    const method = options.method || "GET";
    const headers = {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
    };

    const response = await fetch(`${getApiBase()}${path}`, {
        method,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    const rawBody = await response.text();
    let data = null;

    if (rawBody) {
        try {
            data = JSON.parse(rawBody);
        } catch (err) {
            data = rawBody;
        }
    }

    return {
        ok: response.ok,
        status: response.status,
        data
    };
}

function buildWsUrl() {
    const { accessToken } = readTokens();
    const apiBase = getApiBase();
    const wsBase = apiBase.startsWith("https://")
        ? apiBase.replace("https://", "wss://")
        : apiBase.replace("http://", "ws://");

    const wsUrl = new URL("/ws", `${wsBase}/`);

    if (elements.wsUseAccessToken.checked && accessToken) {
        wsUrl.searchParams.set("token", accessToken);
    }

    return wsUrl.toString();
}

function closeWebSocket() {
    if (!socket) {
        return;
    }

    socket.close();
    socket = null;
    setWsStatus(false);
}

async function onLoginSubmit(event) {
    event.preventDefault();

    const payload = {
        email: elements.email.value.trim(),
        password: elements.password.value
    };

    try {
        const result = await requestJson("/auth/login", {
            method: "POST",
            body: payload
        });

        if (!result.ok) {
            logEvent(`Login failed (${result.status})`);
            return;
        }

        writeTokens(result.data);
        logEvent("Login succeeded and tokens stored");
    } catch (err) {
        logEvent(`Login request failed: ${err.message}`);
    }
}

async function onRefreshClick() {
    const { refreshToken } = readTokens();

    if (!refreshToken) {
        logEvent("No refresh token available");
        return;
    }

    try {
        const result = await requestJson("/auth/refresh", {
            method: "POST",
            body: { refreshToken }
        });

        if (!result.ok) {
            logEvent(`Refresh failed (${result.status})`);
            return;
        }

        writeTokens(result.data);
        logEvent("Refresh succeeded with new token pair");
    } catch (err) {
        logEvent(`Refresh request failed: ${err.message}`);
    }
}

async function onLogoutPostClick() {
    const { refreshToken } = readTokens();

    try {
        const result = await requestJson("/auth/logout", {
            method: "POST",
            body: refreshToken ? { refreshToken } : {}
        });

        if (!result.ok && result.status !== 204) {
            logEvent(`POST logout failed (${result.status})`);
            return;
        }

        clearTokens();
        closeWebSocket();
        logEvent("POST logout completed");
    } catch (err) {
        logEvent(`POST logout failed: ${err.message}`);
    }
}

async function onLogoutGetClick() {
    const { refreshToken } = readTokens();
    const query = refreshToken ? `?refreshToken=${encodeURIComponent(refreshToken)}` : "";

    try {
        const result = await requestJson(`/auth/logout${query}`, {
            method: "GET"
        });

        if (!result.ok && result.status !== 204) {
            logEvent(`GET logout failed (${result.status})`);
            return;
        }

        clearTokens();
        closeWebSocket();
        logEvent("GET logout completed");
    } catch (err) {
        logEvent(`GET logout failed: ${err.message}`);
    }
}

function onWsConnectClick() {
    closeWebSocket();

    try {
        const wsUrl = buildWsUrl();
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            setWsStatus(true);
            logEvent(`WebSocket connected: ${wsUrl}`);
        };

        socket.onmessage = (event) => {
            logEvent(`WS <= ${event.data}`);
        };

        socket.onerror = () => {
            logEvent("WebSocket error");
        };

        socket.onclose = () => {
            setWsStatus(false);
            socket = null;
            logEvent("WebSocket disconnected");
        };
    } catch (err) {
        logEvent(`WebSocket connect failed: ${err.message}`);
    }
}

function onWsSendClick() {
    const message = elements.wsMessage.value.trim();

    if (!message) {
        logEvent("WS message is empty");
        return;
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        logEvent("WebSocket is not connected");
        return;
    }

    socket.send(message);
    elements.wsMessage.value = "";
    logEvent(`WS => ${message}`);
}

function initialize() {
    elements.apiBase.value = window.location.origin;
    syncTokenViews();
    setWsStatus(false);

    elements.loginForm.addEventListener("submit", onLoginSubmit);
    elements.refreshBtn.addEventListener("click", onRefreshClick);
    elements.logoutPostBtn.addEventListener("click", onLogoutPostClick);
    elements.logoutGetBtn.addEventListener("click", onLogoutGetClick);
    elements.wsConnectBtn.addEventListener("click", onWsConnectClick);
    elements.wsDisconnectBtn.addEventListener("click", closeWebSocket);
    elements.wsSendBtn.addEventListener("click", onWsSendClick);

    window.addEventListener("beforeunload", () => {
        closeWebSocket();
    });

    logEvent("Ready");
}

initialize();
