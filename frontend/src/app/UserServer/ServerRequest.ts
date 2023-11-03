export const url = "http://localhost:3000/";

export const sendToServer = (bodyContent: any) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyContent),
  };
};
export const sendToServerCookies = (bodyContent: any, id: string) => {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTM4ZjQzMTQ5MmRjZGM3NWUwYTFmYWEiLCJpYXQiOjE2OTg0MTcwMzQsImV4cCI6MTY5ODUwMzQzNH0.Knmayy5Aehxop2Ie87cAib7EOVxaus8A4TZ6ySerxNU`,
    },
    body: JSON.stringify(bodyContent),
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
