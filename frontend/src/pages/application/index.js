import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useRef, Suspense, useState } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import style from "./style.module.css"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three";

window.electronAPI.onLoadArgsFile((argsFile, foo) => {
  console.log("11111")
})

export const Model = ({ file, fileName, color }) => {
  const geomRef = useRef();
  const bedRef = useRef();
  const bed = useLoader(THREE.TextureLoader, "bed.png");
  const geom = useLoader(STLLoader, file)

  useEffect(() => {
    if (geomRef.current.rotation.x === 0) {
      bedRef.current.rotateX(-Math.PI / 2);
      geomRef.current.rotateX(-Math.PI / 2);
    }
  }, [])

  // useEffect(() => {
  //   geom.center()
  // }, [fileName])

  geom.center()
  // geom.position.set(0,0,0)
  geom.computeBoundingBox();

  // geomRef.current?.position.set(0, (geom?.boundingBox?.max.y - geom?.boundingBox?.min.y) / 2, 0);


  return (
    <>
      <mesh
        ref={geomRef}
        position={[
          0,
          (geom?.boundingBox?.max.z - geom?.boundingBox?.min.z) / 2,
          0,
        ]}
      >
        <primitive object={geom} attach="geometry" />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={bedRef}>
        <planeBufferGeometry attach="geometry" args={[220, 220]} />
        <meshBasicMaterial attach="material" map={bed} />
      </mesh>
    </>
  );
};

export const Helpers = ({ cameraPosition }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.x = cameraPosition[0];
    camera.position.y = cameraPosition[1];
    camera.position.z = cameraPosition[2];
  }, [camera.position, cameraPosition])

  return (
    <>
      <ambientLight />
      <pointLight position={[20, 20, 20]} />
      <pointLight position={[-20, -20, -20]} />
      <primitive object={new THREE.AxesHelper(2000)} />
    </>
  );
};

const Application = () => {
  const [file, setFile] = useState(undefined)
  const [fileName, setFileName] = useState(undefined)
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState([45, 45, 45])
  const [color, setColor] = useState("#ffaa00")

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    window.electronAPI.onLoadArgsFile((argsFile, foo) => {
      console.log("11111")
      setFile(argsFile.content);
      setFile(argsFile.fileName);
    })
  }, []);

  const onChange = event => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setFile(reader.result);
    }, false);
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
      setFileName(event.target.files[0].name)
    }
  }

  const onClickZoomIn = () => {
    setCameraPosition(value => [value[0] - 10, value[1] - 10, value[2] - 10])
  }

  const onClickZoomOut = () => {
    setCameraPosition(value => [value[0] + 10, value[1] + 10, value[2] + 10])
  }

  const onClickSideX = () => {
    setCameraPosition(value => [0, 0, 100])
  }

  const onClickSideY = () => {
    setCameraPosition(value => [0, 100, 0])
  }

  const onClickSideZ = () => {
    setCameraPosition(value => [100, 0, 0])
  }

  const onClickResetPosition = () => {
    setCameraPosition(value => [100, 100, 100])
  }

  const onClickChangeColor = value => {
    setColor(value)
  }

  return (
    <div ref={containerRef} className={style.mainWrapper}>
      <div className={style.controlsWrapper}>
        <div>
          <input className={style.chooseFile} type="file" onChange={onChange} />
        </div>
        <div>
          <button className={style.buttonStandard} onClick={onClickZoomIn}>+</button>
          <button className={style.buttonStandard} onClick={onClickZoomOut}>-</button>
        </div>
        <div>
          <button className={style.buttonStandard} onClick={onClickSideX}>X</button>
          <button className={style.buttonStandard} onClick={onClickSideY}>Y</button>
          <button className={style.buttonStandard} onClick={onClickSideZ}>Z</button>
          <button className={style.buttonStandard} onClick={onClickResetPosition}>Reset</button>
        </div>
        <div>
          <button className={style.buttonColor} style={{ backgroundColor: "#ffaa00" }} onClick={() => onClickChangeColor("#ffaa00")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#880000" }} onClick={() => onClickChangeColor("#880000")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#333333" }} onClick={() => onClickChangeColor("#333333")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#008844" }} onClick={() => onClickChangeColor("#008844")} />
        </div>
      </div>
      <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
        {fileName ? (
          <Suspense fallback={null}>
            <Model file={file} fileName={fileName} color={color} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Helpers cameraPosition={cameraPosition} />
          </Suspense>
        ) : <></>}
      </Canvas>
    </div>
  )
}

export default Application
