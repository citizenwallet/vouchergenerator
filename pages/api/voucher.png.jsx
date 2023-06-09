import * as React from "react";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

const fetchFont = async (fontPath) => {
  if (!fontPath.href) {
    console.error("Invalid fontPath", fontPath);
    return;
  } else {
    console.log("fontPath.href is set", fontPath.href);
  }
  try {
    const res = await fetch(fontPath);
    return await res.arrayBuffer();
  } catch (e) {
    console.log("fetch error:", e);
  }
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const goodfor = searchParams.get("goodfor");
  const date = searchParams.get("date");
  const contract_address = searchParams.get("contract_address");
  const tokenid = searchParams.get("tokenid");
  const signature = searchParams.get("signature");

  const qrcodeData = `https://${process.env.APP_URL}/#/vouchers/${contract_address}/${tokenid}`;

  const fonts = [
    {
      name: "Typewriter",
      data: await fetchFont(
        new URL("../../assets/TYPEWR__.TTF", import.meta.url)
      ),
      style: "normal",
    },
    {
      name: "MICR E",
      data: await fetchFont(
        new URL("../../assets/micrenc.ttf", import.meta.url)
      ),
      style: "normal",
    },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          backgroundImage: `url("http://localhost:3000/voucher.jpg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          backgroundPosition: "center center",
          position: "relative",
        }}
      >
        <img
          src={`${
            process.env.VERCEL_URL
              ? "https://" + process.env.VERCEL_URL
              : "http://localhost:3000"
          }/api/qrcode.png?data=${encodeURIComponent(qrcodeData)}`}
          width={100}
          height={100}
          style={{
            position: "absolute",
            top: 65,
            right: 20,
          }}
        />

        <div
          style={{
            fontSize: "1.2em",
            position: "absolute",
            left: 700,
            top: 182,
          }}
        >
          {goodfor}
        </div>

        <div
          style={{
            fontSize: "1.2em",
            position: "absolute",
            left: 700,
            top: 248,
          }}
        >
          {from}
        </div>

        <div
          style={{
            fontSize: "1.2em",
            position: "absolute",
            left: 700,
            top: 318,
          }}
        >
          {date}
        </div>

        <div
          tw=""
          style={{
            fontSize: "1.2em",
            position: "absolute",
            left: 700,
            top: 388,
          }}
        >
          {signature}
        </div>
      </div>
    ),
    {
      width: 1250,
      height: 492, // should be 550
      fonts,
    }
  );
}
