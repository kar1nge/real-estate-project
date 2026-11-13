export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  button_text: string;
  button_link: string;
  order: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}
