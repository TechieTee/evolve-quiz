// types.ts
export interface Taxonomy {
    id: string;
    name: string;
  }

  export interface Service {
    content: string;
    id: string;
    title: string;
    link: string;
    taxonomy: Taxonomy[];
  }
  
  export interface BodyPart {
    id: number;
    name: string;
    slug: string;
    content: string;
    count: number;
    children: BodyPart[];
  }
  export interface Condition {
    id: number; 
    title: string;
 
    recommended_services?: {
      id: number;
      title: string;
      content: string;
      taxonomy: { name: string }[];
    }[];
  }
  export interface Area {
    id: number;
    name: string;
    slug: string;
    content: string;
    count: number;
    children: Area[];
  }
  
  export interface ApiError {
    message: string;
  }
  
  export type AreasResponse = Area[] | ApiError;