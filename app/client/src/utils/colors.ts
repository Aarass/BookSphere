import { useGetMeQuery } from "@/features/user/userApi";

function brightness(hexColor: string) {
  const c = hexColor.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma;
}

export function isDark(hexColor: string) {
  return brightness(hexColor) < 40;
}

export function useMyColor(light: boolean = true) {
  const { data: me } = useGetMeQuery();
  if (light) {
    return `color-mix(in srgb, var(--background), ${me?.color ?? "var(--background)"} 30%)`;
  } else {
    return `color-mix(in srgb, var(--foreground), ${me?.color ?? "var(--foreground)"} 30%)`;
  }
}

export function tint(color: string, light: boolean = true) {
  if (light) {
    return `color-mix(in srgb, var(--background), ${color} 30%)`;
  } else {
    return `color-mix(in srgb, var(--foreground), ${color} 30%)`;
  }
}
