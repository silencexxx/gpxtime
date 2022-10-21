interface ILatLon {
  lat: string;
  lon: string;
}

interface Itrkpt {
  ele: string[];
  time: string[];
  $: ILatLon;
}

export {
  ILatLon,
  Itrkpt
}

