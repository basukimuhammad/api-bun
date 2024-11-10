import fetch from "node-fetch";
const latLonToTile = (lat, lon, zoom) => {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom));
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
};
export const weather = async (text) => {
  try {
    const weatherParams = new URLSearchParams({
      key: "897dba35c1d94f4cbea134758220207",
      q: text
    });
    const weatherUrl = `https://api.weatherapi.com/v1/current.json?${weatherParams.toString()}`;
    const response = await fetch(weatherUrl);
    const res = await response.json();
    if (res.error) throw res.error.message;
    const {
      location: {
        name,
        region,
        country,
        lat,
        lon,
        tz_id,
        localtime
      } = {},
      current: {
        last_updated,
        temp_c,
        temp_f,
        is_day,
        wind_mph,
        wind_kph,
        wind_dir,
        pressure_mb,
        pressure_in,
        precip_mm,
        precip_in,
        humidity,
        cloud,
        feelslike_c,
        feelslike_f,
        vis_km,
        vis_miles,
        uv,
        gust_mph,
        gust_kph,
        condition
      } = {}
    } = res;
    const iconUrl = condition?.icon ? /^https?:/.test(condition.icon) ? condition.icon : `https:${condition.icon}` : condition.icon;
    const tileUrl = latLonToTile(lat, lon, 12);
    return {
      result: res,
      iconUrl: iconUrl,
      tileUrl: tileUrl
    };
  } catch (e) {
    throw e;
  }
};
export const weatherDetail = {
  detail: {
    summary: 'Gets the weather',
    tags: ['info']
  }
};
