import Head from "next/head";
import Image from "next/image";
import {
  Inter,
  Pacifico,
  Bungee,
  Monoton,
  Megrim,
  Orbitron,
  Sacramento,
} from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "@/styles/Home.module.css";
import Card from "@/components/Card";

const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"] });
const bungee = Bungee({ subsets: ["latin"], weight: ["400"] });
const monoton = Monoton({ subsets: ["latin"], weight: ["400"] });
const megrim = Megrim({ subsets: ["latin"], weight: ["400"] });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400"] });
const sacramento = Sacramento({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const [startProximity, setStartProximity] = useState(null);
  const [startRead, setStartRead] = useState(null);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative bg-primary">
        <div className="bg-hero bg-cover bg-no-repeat bg-center intro snap-y">
          <section className="container relative w-full h-screen mx-auto p-[4rem] z-1 flex justify-center">
            <Card
              setStartProximity={setStartProximity}
              setStartRead={setStartRead}
            />
            <Reader startProximity={startProximity} startRead={startRead} />
          </section>
        </div>
        <div className="bg-background2 bg-cover bg-no-repeat bg-center  snap-y">
          {/* <div className="blur blur-bg"></div> */}
          <section className="w-full h-screen mx-auto p-[4rem] z-1">
            <h1 className={`${bungee.className} glow`}>Artur Adams</h1>
          </section>
        </div>
        <div className="bg-hero-pattern  snap-y">
          {/* <div className="blur blur-bg"></div> */}
          <section className="w-full h-screen mx-auto p-[4rem] z-1">
            <h1 className={`${bungee.className} glow`}>Artur Adams</h1>
          </section>
        </div>
      </div>
    </>
  );
}

export const Reader = ({ startRead, startProximity }: any) => {
  const readerRef = useRef(null);
  const borderRef = useRef(null);
  const readerImgRef = useRef(null);
  // useEffect(() => {
  //   if (readerRef.current && startRead) {
  //     const readerLedSpans = readerRef.current.querySelectorAll(".reader-led");
  //     const readerProgressSpan =
  //       readerRef.current.querySelector(".reader-progress");
  //   }
  // }, [readerRef, startRead]);
  useEffect(() => {
    gsap.to(readerImgRef.current, {
      delay: 2.2,
      duration: 0.2,
      opacity: 1,
      ease: "power3.out",
    });
  }, []);

  useEffect(() => {
    console.log("start-proximity");
    if (borderRef && startProximity) {
      console.log("start-proximity2");
      gsap.to(borderRef.current, {
        duration: 1,
        borderColor: "blue",
        opacity: 0.8,
        ease: "power3.out",
      });
    } else {
      gsap.to(borderRef.current, {
        duration: 1,
        opacity: 0.4,
        borderColor: "white",
        ease: "power3.out",
      });
    }
  }, [readerRef, startProximity]);

  const handleProximity = () => {
    gsap.to(borderRef.current, {
      duration: 1,
      borderColor: "blue",
      ease: "power3.out",
    });
  };
  const handleRead = () => {};

  return (
    <div
      ref={readerRef}
      className="absolute bottom-1/2 right-[30px] w-[130px] flex opacity-[0.92]"
    >
      {/* <span
        ref={borderRef}
        className="reader-border blur border-[15px] left-[-10px] top-[-10px] absolute h-[370px] w-[270px] rounded-tl-[25px] rounded-tr-[25px] rounded-bl-[18px] rounded-br-[18px]"
      ></span>
      <span className="reader-progress border-[7px] absolute w-[164px] h-[1px] left-[43px] rounded-xl top-[18px] z-[1]"></span>
      <span className="reader-led border-[5px] absolute w-[16px] h-[1px] rounded-xl right-[42px] top-[165px] z-[1]"></span>
      <span className="reader-led border-[5px] absolute w-[16px] h-[1px] rounded-xl right-[25px] top-[165px] z-[1]"></span>
      <span className="reader-led border-[5px] absolute w-[16px] h-[1px] rounded-xl right-[8px] top-[165px] z-[1]"></span> */}
      <Image
        alt=""
        src={"/assets/neonreader.png"}
        width={250}
        height={350}
        ref={readerImgRef}
        className="z-[2] reader-img opacity-[0]"
      />
    </div>
  );
};
