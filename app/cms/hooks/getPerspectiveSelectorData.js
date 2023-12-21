import axios from "axios";
import {useEffect, useState} from "react";

/** */
export function getPerspectiveSelectorContentData(locale) {
  const [isLoading, setIsLoading] = useState(true);
  const [perspectiveSelectorContentData, setPerspectiveSelectorContentData] = useState({});

  useEffect(() => {
    setIsLoading(true);

    fetchPerspectiveSelectorContentData(locale)
      .then(data => {
        setPerspectiveSelectorContentData(data.data);
        setIsLoading(false);
      });
  }, []);

  return [isLoading, perspectiveSelectorContentData];
}

/** */
export function getPerspectiveSelectorData(locale) {
  const [isLoading, setIsLoading] = useState(true);
  const [perspectiveSelectorData, setPerspectiveSelectorData] = useState({});

  useEffect(() => {
    setIsLoading(true);

    fetchPerspectiveSelectorData(locale)
      .then(data => {
        setPerspectiveSelectorData(data.data);
        setIsLoading(false);
      });
  }, []);

  return [isLoading, perspectiveSelectorData];
}

/**
 * Retrieves Perspective Selector section descriptions
 *
 * @param {string} lng
 * @returns {object}
 */
export function fetchPerspectiveSelectorContentData(lng) {
  return axios.get(`/api/perspective_selector/${lng}`)
    .then(response => response);
}

/**
 * Retrieves Perspective Selector section data
 *
 * @param {string} lng
 * @returns {object}
 */
export function fetchPerspectiveSelectorData(lng) {
  return axios.get(`/api/perspective_selector_data/getMembers?locale=${lng}`)
    .then(response => response);
}
