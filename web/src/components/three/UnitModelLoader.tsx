"use client";

import dynamic from "next/dynamic";

const UnitModel = dynamic(() => import("./UnitModel").then((m) => m.UnitModel), {
  ssr: false,
});

export function UnitModelLoader(props: { sqm: number; bedrooms: number; bathrooms: number }) {
  return <UnitModel {...props} />;
}
