import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const site = {
  name: "Arise",
  url: "https://arise-homes.example",
  email: "hello@arise-homes.example",
  phone: "+351 21 000 0000",
  tagline: "Architect-designed homes to rent in Lisbon, Barcelona, Cape Town, Dubai and Paris.",
};
