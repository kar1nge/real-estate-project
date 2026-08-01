import type { HeroSlide } from "../types/hero";

const API_URL = "http://127.0.0.1:8000/api/hero/";

export const getHeroSlides = async (): Promise<HeroSlide[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch Hero slides.");
  }

  const data = await response.json();

  return data.results;
};