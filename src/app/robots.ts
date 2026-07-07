import type { MetadataRoute } from "next";

// Portal interno e privado: nenhuma página deve ser indexada.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
