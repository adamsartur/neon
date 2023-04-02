import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap/dist/gsap";
import Draggable from "gsap/dist/Draggable";

gsap.registerPlugin(Draggable);

const Card = ({ setStartProximity, setStartRead }: any) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  const readAnimation = () => {
    const tl = gsap.timeline();
    tl.add([
      gsap.to(imageRef.current, {
        duration: 1,
        opacity: 0,
        ease: "power3.out",
        onComplete: () => {},
      }),
      gsap.to(descriptionRef.current, {
        duration: 1,
        opacity: 0,
        ease: "power3.out",
        onComplete: () => {},
      }),
      gsap.to(cardRef.current, {
        duration: 0.3,
        "--bg-opacity": 0,
        "--border-opacity": 0.3,
        "--box-shadow-opacity": 0.6,
        "--backdrop-blur": "2px",
        "pointer-events": "none",
        ease: "power3.out",
      }),
    ]);
    tl.to({}, { duration: 1 });
    tl.add([
      gsap.to(cardRef.current, {
        delay: 0.2,
        duration: 0.8,
        maxHeight: "100%",
        ease: "power3.out",
        "--bg-opacity": 0.6,
        "--border-opacity": 0.6,
        "--box-shadow-opacity": 0.2,
        "--backdrop-blur": "20px",
        "--saturate": "410%",
      }),
      gsap.to(cardRef.current, {
        duration: 1,
        x: 0,
        y: 0,
        width: "100%", // Set the desired width
        ease: "power3.out",
        "pointer-events": "auto",
      }),
      gsap.to(textRef.current, {
        duration: 1,
        opacity: 1,
        ease: "power3.out",
      }),
    ]);
    //height animation below not working
  };

  const blurLook = () => {
    gsap.to(imageRef.current, {
      duration: 1,
      opacity: 1,
      ease: "power3.out",
      onComplete: () => {},
    });
    gsap.to(descriptionRef.current, {
      duration: 1,
      opacity: 1,
      ease: "power3.out",
      onComplete: () => {},
    });
  };

  const onStop = (event: MouseEvent, data: { y: number }) => {
    if (data.y > 500) {
      data.y = 500;
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      Draggable.create(cardRef.current, {
        bounds: { minY: 0, maxY: 100, minX: 500, maxX: 0 },
        edgeResistance: 1,
        throwProps: true,
        onDragStart: () => {
          isDragging.current = true;
          gsap.to(cardRef.current, {
            duration: 0.1,
            rotateX: 0,
            rotateY: 0,
            ease: "power3.out",
          });
        },
        onDrag: (event) => {
          isDragging.current = false;
          const cardElement = cardRef.current;
          const { clientX, clientY } = event;
          const { innerWidth, innerHeight } = window;

          const xPos = clientX / innerWidth;
          const yPos = clientY / innerHeight;
          console.log(xPos);
          console.log(yPos);

          if (xPos >= 0.56) {
            // && yPos >= 0.44
            setStartProximity(true);
          } else {
            setStartProximity(false);
          }
        },
        onDragEnd: (event) => {
          isDragging.current = false;
          const cardElement = cardRef.current;
          const { clientX, clientY } = event;
          const { innerWidth, innerHeight } = window;

          const xPos = clientX / innerWidth;
          const yPos = clientY / innerHeight;

          console.log("drag_end");
          console.log(xPos);
          console.log(yPos);

          if (xPos >= 0.56) {
            // && yPos >= 0.44
            readAnimation();
          }
        },
        liveSnap: {
          points: [
            { x: 0, y: 0 },
            { x: 0, y: 60 },
          ],
          radius: 15,
        },
      });
    }
  }, [cardRef]);

  const handleClick = () => {};

  useEffect(() => {
    gsap.from(cardRef.current, {
      duration: 2,
      y: -1200,
      opacity: 1,
      immediateRender: true,
      ease: "power3.out",
    });
    gsap.to(cardRef.current, {
      duration: 2,
      delay: 3,
      y: 0,
      opacity: 1,
      immediateRender: true,
      ease: "power3.out",
    });
  }, []);
  const onMouseMove = (event: MouseEvent) => {
    if (isDragging.current) {
      return;
    }
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const xPos = clientX / innerWidth;
    const yPos = clientY / innerHeight;

    const tiltX = (yPos - 0.5) * 30;
    const tiltY = (xPos - 0.5) * -30;

    gsap.to(cardRef.current, {
      duration: 0.5,
      rotateX: tiltX,
      rotateY: tiltY,
      ease: "power3.out",
      transformPerspective: 1000,
      transformOrigin: "center center",
    });
  };

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      duration: 0.5,
      rotateX: 0,
      rotateY: 0,
      ease: "power3.out",
    });
  };

  useEffect(() => {
    const cardElement = cardRef.current;

    if (cardElement) {
      cardElement.addEventListener("mousemove", onMouseMove);
      cardElement.addEventListener("mouseleave", onMouseLeave);

      return () => {
        cardElement.removeEventListener("mousemove", onMouseMove);
        cardElement.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, []);
  return (
    <div
      className="p-[2rem] max-w-[720px] min-w-[300px] max-h-[400px] glass relative opacity-0"
      ref={cardRef}
    >
      <div className="card-img" ref={imageRef}>
        <Image
          src="/assets/profile.jpg"
          alt=""
          width={150}
          height={150}
          className="glass-img"
        />
      </div>

      <div className="pt-[180px] text-center" ref={descriptionRef}>
        <h1 className="font-bold text-primary">Artur Adams</h1>
        <div className="bg-transparent backdrop-blur-none p3">
          <h2 className="text-primary">Full Stack Developer</h2>
        </div>
      </div>

      <div className="pt-[180px] text-center hidden" ref={textRef}>
        <h1 className="font-bold text-primary">Artur Adams</h1>
        <div className="bg-transparent backdrop-blur-none p3">
          <h2 className="text-primary">Full Stack Developer</h2>
        </div>
      </div>

      {/* <div>
        <button onClick={handleClick}>Ver Perfil</button>
      </div> */}
    </div>
  );
};
export default Card;
