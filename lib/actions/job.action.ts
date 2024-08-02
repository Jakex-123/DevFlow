import { JobFilterParams } from "./shared.types";

export const getLocation = async () => {
  try {
    const res = await fetch("http://ip-api.com/json/?fields=country");
    const location = await res.json();
    return location.country;
  } catch (error) {
    console.log(error);
  }
};

export const getCountries = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const countries = await res.json();
    return countries;
  } catch (error) {
    console.log(error);
  }
};

export const getJobs = async (filters:JobFilterParams) => {
    const { query, page } = filters

  const url =
    `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${process.env.NEXT_PUBLIC_RAPID_API_KEY}`,
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.data
  } catch (error) {
    console.error(error);
  }
};
