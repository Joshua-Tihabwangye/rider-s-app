declare module "leaflet";
declare module "react-leaflet";
declare module "leaflet/dist/images/marker-icon-2x.png";
declare module "leaflet/dist/images/marker-icon.png";
declare module "leaflet/dist/images/marker-shadow.png";

interface ImportMetaEnv {
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
