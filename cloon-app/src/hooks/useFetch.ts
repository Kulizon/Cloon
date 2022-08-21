import { useState, useCallback } from "react";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();

  const getData = useCallback(async (url: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", options?: any) => {
    let receivedData;
    try {
      setLoading(true);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        ...options,
      });
      receivedData = await response.json();
      setData(receivedData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
    }
    return receivedData;
  }, []);

  return [loading, error, data, getData];
};

export default useFetch;
