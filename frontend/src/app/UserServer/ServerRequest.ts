export const urlBackend = "http://localhost:3000/";
export const urlFrontend = "http://localhost:3001/";
export const sendToServer = (bodyContent: any) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyContent),
  };
};
export const sendToServerCookies = (
  bodyContent: any,
  id: string | undefined
) => {
  return {
    method: "POST",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyContent),
  };
};

export const sendFiles = (file: any) => {
  const body = new FormData();
  body.append("file", file);
  return {
    method: "POST",
    credentials: "include" as RequestCredentials,
    // headers: {
    //   Cookie: `id=${id}`,
    // },
    body: body,
  };
};

export const getUserFromServer = (id: string) => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=${id}`,
    },
  };
};
export const getFromServerCookie = () => {
  return {
    method: "GET",
    credentials: "include" as RequestCredentials,
  };
};
export const getFromServer = () => {
  return {
    method: "GET",
    credentials: "include" as RequestCredentials,
    headers: {
      "Content-Type": "application/json",
    },
  };
};
