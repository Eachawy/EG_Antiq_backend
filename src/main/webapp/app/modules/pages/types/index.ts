export interface Era {
  id: string;
  nameEn: string;
  nameAr: string;
  from: string;
  to: string;
  Hijri_from: string;
  Hijri_to: string;
}

export interface MonumentsType {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface Dynasty {
  id: string;
  nameEn: string;
  nameAr: string;
  eraId: string;
  from: string;
  to: string;
  Hijri_from: string;
  Hijri_to: string;
}

export interface MonumentsEra {
  id: string;
  monumentId: string;
  eraId: string;
}

export interface DescriptionMonument {
  id: string;
  monumentId: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface Gallery {
  id: string;
  monumentId: string;
  images: string[];
}

export interface Monument {
  id: string;
  nameEn: string;
  nameAr: string;
  biographyEn: string;
  biographyAr: string;
  latitude: string;
  longitude: string;
  zoom: string;
  center: string;
  monumentImage: string;
  monumentDate: string;
  typeId: string;
  eraId: string;
  dynastyId: string;
  descriptionEn: string;
  descriptionAr: string;
}
