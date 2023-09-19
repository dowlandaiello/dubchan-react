/// Formats a route under the current page's API.
export const route = (route: string): string =>
  `${window.location.protocol}//${window.location.hostname}:8080${route}`;

/// A link to a local route.
export const uiRoute = (route: string): string =>
  `${window.location.origin}${route}`;

/// Converts a youtube or youtu.be link to an embed
export const getYtEmbed = (url: string): string =>
  "https://www.youtube.com/embed/" + url.split("v=")[1];
