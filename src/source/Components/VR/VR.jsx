import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import * as SPLAT from "gsplat";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import FPSStats from "react-fps-stats";
import { hideLoading, updateLoadingProgress } from "../../../js/utils";
import { useNavigate } from "react-router-dom";
import { useVariables } from "../../context/variableContext";
import qrcode from "../../assets/qr-code-grt.png";
import { Splat as SplatComponent } from "@react-three/drei";

import "../../css/gsplat.css";
import "../../css/loader.css";
import "../../css/style.css";
import Box from "./Box";
import RotatingSplat from "./RotatingSplat";

const ErrorBoundary = lazy(() => import("../Errorboundary/ErrorBoundary"));
// const SplatComponent = lazy(() =>
//   import("@react-three/drei").then((module) => ({ default: module.Splat }))
// );

const VR = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(1);
  const autorotateAngleRef = useRef(0);
  const viewSpaceContainerRef = useRef(null);
  const { XRDelta, YRDelta, ZRDelta, jewelType } = useVariables();
  const [isHovered, setIsHovered] = useState(false);

  const timeRef = useRef(0); // To track elapsed time
  let autorotate = true;
  const autorotateSpeed = 0.005;
  let splat;
  let url;

  const selectedJewel = JSON.parse(
    sessionStorage.getItem("selectedJewel") || "{}"
  );

  const queryParams = new URLSearchParams(window.location.search);
  // const isDevMode = queryParams.get("mode") === "dev";

  url = `https://gaussian-splatting-production.s3.ap-south-1.amazonaws.com/${selectedJewel.name}/${selectedJewel.name}.splat`;

  // Function to detect if the device is a mobile
  // const isMobileDevice = () => {
  //   return (
  //     typeof window.orientation !== "undefined" ||
  //     navigator.userAgent.indexOf("IEMobile") !== -1
  //   );
  // };

  const isMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    const isMobileUserAgent = /android|avantgo|blackberry|bb|meego|midp|mmp|mobile|tablet|palm|phone|p(ixi|re)\/|opera m(ob|in)i|plucker|pocket|psp|symbian|smartphone|s(ymbian|eries60|amsung|anyo|ony-ericsson)|windows ce|windows phone|webos|wireless|xda|xiino/i.test(userAgent) ||
                             /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    
    const isSmallScreen = window.innerWidth <= 768; //800 && window.innerHeight <= 600;
    
    return isMobileUserAgent || isSmallScreen;
  };

  // Function to detect if the mode is 'dev' in the URL
  const isDevMode = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("mode") === "dev";
  };

  useEffect(() => {
    timeRef.current = 0;
    if (!SPLAT || !canvasRef.current || !selectedJewel) return;

    const scene = new SPLAT.Scene();
    const camera = new SPLAT.Camera();
    const renderer = new SPLAT.WebGLRenderer(canvasRef.current);

    const controls = new SPLAT.OrbitControls(camera, renderer.canvas);

    controls.minAngle = 10;
    controls.maxAngle = 50;
    controls.minZoom = 4;
    controls.maxZoom = 20;

    SPLAT.Loader.LoadAsync(url, scene, (progress) => {
      updateLoadingProgress(progress * 100);
      setLoadingProgress(progress * 100);
    }).then((loadedObject) => {
      if (loadingProgress === 100) {
        hideLoading();
      }
      splat = loadedObject;

      const frame = () => {
        if (autorotate) {
          autorotateAngleRef.current += autorotateSpeed;

          const baseTheta = 0,
            basePhi = 0,
            baseGama = 0;
          const XRDelta = 0,
            YRDelta = 0;

          const rotation = new SPLAT.Vector3(
            baseTheta + XRDelta,
            basePhi + YRDelta + autorotateAngleRef.current,
            baseGama
          );
          splat.rotation = SPLAT.Quaternion.FromEuler(rotation);
        }

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    });

    return () => {
      if (renderer) renderer.dispose();
    };
  }, [selectedJewel]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleClick = () => {
    if (isMobileDevice() || isDevMode()) {
    // if (isMobileDevice() || isDevMode() || selectedJewel.type === "earring" || selectedJewel.type === "ring") {
      // console.log(selectedJewel.type,"jeweltype",jewelType)
      // if(selectedJewel.type === "earring"){
      //   navigate(`/face-ar?id=${selectedJewel.name}`)
      // }
      navigate("/AR");
    }
    else
      setShowModal(true)
  };

  // const scale = selectedJewel
  //   ? jewelType === "bangle"
  //     ? 0.8
  //     : jewelType === "ring"
  //     ? 0.5
  //     : 1
  //   : 1;

  const scale = window.innerWidth < 768 ? 0.8 : 1.3;
  window.onpopstate = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      navigate("/");
    } else {
      window.location.replace("/");
    }
  };

  return (
    <div ref={viewSpaceContainerRef} id="viewspacecontainer">
      <div className="ar-toggle-container" id="ar-toggle-container">
        {/* {isDevMode && isMobileDevice ? (
          <div className="FPSStats">
            <FPSStats />
          </div>
        ) : null} */}

        <button
          className="tryon-button"
          id="desktop-viewar"
          onClick={handleClick}
        >
          Try On
        </button>
        <h2 id="updatenote">{selectedJewel.label}</h2>
        <div className="gsplatButtonDiv">
          <span className="gsplatSoundEffect"></span>
          <span className="gsplatBackgroundEffect"></span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150%",
          height: "150%",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
            <Canvas
              dpr={1.5}
              shadows
              gl={{ localClippingEnabled: true }}
              camera={{
                fov: 75,
                position: [0, 0, 7],
                frustumCulled: true,
                near: 0.25,
                far: 100,
              }}
            >
              <group position={[0, -0.5, 0]}>
                <OrbitControls
                  minDistance={2} //for mobile it is needed
                  maxDistance={5}
                  autoRotate={true}
                  // autoRotate={isHovered ? false : true}
                  autoRotateSpeed={2}
                  enableDamping={false}
                  enablePan={false}
                />
                <AdaptiveDpr pixelated={true} />
                <RotatingSplat
                  url={url}
                  scale={scale * selectedJewel.size}
                  rotation={
                    selectedJewel.type === "ring"
                      ? [0.015, 0, 0]
                      : [0.015, -3.55, 1.6]
                  }
                  isHovered={isHovered}
                  setIsHovered={setIsHovered}
                />
                <Box size={scale} />
              </group>
            </Canvas>
          </ErrorBoundary>
        </Suspense>
        {showModal && (
          <div className="modal-wrapper" onClick={handleModalClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <span className="close" onClick={handleModalClose}>&times;</span>
                <h1>Best experienced on phone</h1>
                <p>Scan this QR code or visit <span style={{ fontWeight: "bold", color: "black" }}>grt.jar4u.com</span> on your phone to try on the items</p>
                {/* <p>Scan this QR code with your phone to virtually try on this item</p> */}
                <img id="qrCodeImage" src={qrcode} alt="QR Code" />
                {/* <p>or visit <span style={{ fontWeight: "bold", color: "black" }}>grt.jar4u.com</span> on your phone</p> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VR;
