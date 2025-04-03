import { useQuery } from "@tanstack/react-query";

const fetchData = async () => {
  const res = await fetch("https://api.example.com/data");
  return res.json();
};

export const useData = () => {
  return useQuery({ queryKey: ["data"], queryFn: fetchData });
};
