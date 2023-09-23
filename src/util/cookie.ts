export const addIdentity = (username: string, token: string) => {
  document.cookie += `${username}:${token}`;
};
