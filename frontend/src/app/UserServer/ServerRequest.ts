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
