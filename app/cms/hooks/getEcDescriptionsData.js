import axios from "axios";
import {useEffect, useState} from "react";

/** */
export function getEcDescriptionsData(locale) {
  const [isLoading, setIsLoading] = useState(true);
  const [ecDescription, setEcDescription] = useState({});

  useEffect(() => {
    setIsLoading(true);

    fetchEcDescriptionData(locale)
      .then(data => {
        setEcDescription(data.data);
        setIsLoading(false);
      });
  }, []);

  return [isLoading, ecDescription];
}

/**
 * Retrieves Economic Complexity section descriptions
 *
 * @param {string} lng
 * @returns {object}
 */
export function fetchEcDescriptionData(lng) {
  return axios.get(`/api/ec_descriptions/${lng}`)
    .then(response => response);
}
