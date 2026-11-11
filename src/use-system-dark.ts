import { useSyncExternalStore } from 'react';

const query = '(prefers-color-scheme: dark)';
let media: MediaQueryList | undefined;
const getMedia = () => (media ??= window.matchMedia(query));
const subscribe = (onChange: () => void) => {
  const current = getMedia();
  current.addEventListener('change', onChange);
  return () => current.removeEventListener('change', onChange);
};
const snapshot = () => getMedia().matches;
const serverSnapshot = () => false;

export function useSystemDark() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
