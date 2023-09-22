/// Formats a route under the current page's API.
export const route = (route: string): string => {
  if (window.location) {
    return `${window.location.protocol}//${window.location.hostname}:8080${route}`;
  }

  return "http://localhost";
};

export const uiRoute = (route: string): string => {
  if (window.location) {
    return `${window.location.protocol}//${window.location.hostname}${route}`;
  }

  return "http://localhost";
};

/// Converts a youtube or youtu.be link to an embed
export const getYtEmbed = (url: string): string =>
  "https://www.youtube.com/embed/" + url.split("v=")[1];
