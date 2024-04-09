"use client";
import { Router } from "next/router";
import { useEffect } from "react";

export const FacebookPixel = () => {
  useEffect(() => {
    void import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("pixel ID here");
        ReactPixel.pageView();

        Router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
  });
  return null;
};
