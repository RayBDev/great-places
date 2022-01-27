export type Location = {
  /** The latitude of the location */
  lat: number;
  /** The longitude of the location */
  lng: number;
};

export type Place = {
  /** The unique ID of the place */
  id: number;
  /** The title of the place */
  title: string;
  /** The image uri of the place */
  imageUri: string;
  /** The address of the place */
  address: string;
} & Location;
