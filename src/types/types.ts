// types.ts
export interface Taxonomy {
    id: string;
    name: string;
  }
  
  export interface Service {
    description: string;
    id: string;
    title: string;
    link: string;
    taxonomy: Taxonomy[];
  }
  
  export interface Condition {
    id: string;
    title: string;
    link: string;
    recommended_services: Service[];
  }
  
  export interface Area {
    id: number;
    name: string;
    slug: string;
    description: string;
    count: number;
    children: Area[];
  }
  
  export interface ApiError {
    message: string;
  }
  
  export type AreasResponse = Area[] | ApiError;