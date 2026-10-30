import type { HeroSlide } from "../types/hero";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}hero/`;

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch Hero slides.");
  }

  const data = await response.json();

  return data.results;
};
