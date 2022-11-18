interface ILatLon {
  lat: string;
  lon: string;
}

interface Itrkpt {
  ele: string[];
  time: string[];
  $: ILatLon; /* $ is just the name xml2json uses for xml-attributes! */
}

export {
  ILatLon,
  Itrkpt
}

