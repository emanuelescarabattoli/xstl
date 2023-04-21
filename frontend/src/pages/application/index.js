import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useRef, Suspense, useState, useLayoutEffect } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import style from "./style.module.css"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three";

const Line = ({ start, end, color }) => {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)))
  }, [start, end])
  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </line>
  )
}

export const Model = ({ file, fileName, color }) => {
  const geom = useLoader(STLLoader, file)
  const geomRef = useRef();

  useEffect(() => {
    if (geomRef.current.rotation.x === 0) {
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

  const points = [];
  points.push(new THREE.Vector3(100, 100, 0));
  points.push(new THREE.Vector3(0, 100, 10));
  points.push(new THREE.Vector3(100, 50, 100));

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
    </>
  );
};

export const Helpers = ({ cameraPosition, isBedVisible, isAxesVisible }) => {
  const { camera } = useThree();
  const logo = useLoader(THREE.TextureLoader, "logo.png");
  const logoRef = useRef();

  useEffect(() => {
    if (logoRef.current.rotation.x === 0) {
      logoRef.current.rotateX(-Math.PI / 2);
    }
  }, [])

  useEffect(() => {
    camera.position.x = cameraPosition[0];
    camera.position.y = cameraPosition[1];
    camera.position.z = cameraPosition[2];
  }, [camera.position, cameraPosition])

  return (
    <>
      <ambientLight />
      <pointLight position={[200, 200, 200]} intensity={.75} />
      <pointLight position={[-200, 200, -200]} intensity={.75} />
      <pointLight position={[200, 200, -200]} intensity={.75} />
      <pointLight position={[-200, 200, 200]} intensity={.75} />
      <group visible={isAxesVisible}>
        <primitive object={new THREE.AxesHelper(2000)} />
      </group>
      <group visible={isBedVisible}>
        <mesh ref={logoRef} position={[65, .1, 80]}>
          <planeBufferGeometry attach="geometry" args={[50, 20]} />
          <meshBasicMaterial attach="material" map={logo} transparent />
        </mesh>
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[220, 1, 220]} />
          <meshStandardMaterial color="#336592" />
        </mesh>
        <Line start={[-100, .01, -100]} end={[-100, .01, 100]} color="#4282bc" />
        <Line start={[-90, .01, -100]} end={[-90, .01, 100]} color="#4282bc" />
        <Line start={[-80, .01, -100]} end={[-80, .01, 100]} color="#4282bc" />
        <Line start={[-70, .01, -100]} end={[-70, .01, 100]} color="#4282bc" />
        <Line start={[-70, .01, -100]} end={[-70, .01, 100]} color="#4282bc" />
        <Line start={[-60, .01, -100]} end={[-60, .01, 100]} color="#4282bc" />
        <Line start={[-50, .01, -100]} end={[-50, .01, 100]} color="#4282bc" />
        <Line start={[-40, .01, -100]} end={[-40, .01, 100]} color="#4282bc" />
        <Line start={[-30, .01, -100]} end={[-30, .01, 100]} color="#4282bc" />
        <Line start={[-20, .01, -100]} end={[-20, .01, 100]} color="#4282bc" />
        <Line start={[-10, .01, -100]} end={[-10, .01, 100]} color="#4282bc" />
        <Line start={[0, .01, -100]} end={[0, .01, 100]} color="#4282bc" />
        <Line start={[10, .01, -100]} end={[10, .01, 100]} color="#4282bc" />
        <Line start={[20, .01, -100]} end={[20, .01, 100]} color="#4282bc" />
        <Line start={[30, .01, -100]} end={[30, .01, 100]} color="#4282bc" />
        <Line start={[40, .01, -100]} end={[40, .01, 100]} color="#4282bc" />
        <Line start={[50, .01, -100]} end={[50, .01, 100]} color="#4282bc" />
        <Line start={[60, .01, -100]} end={[60, .01, 100]} color="#4282bc" />
        <Line start={[70, .01, -100]} end={[70, .01, 100]} color="#4282bc" />
        <Line start={[80, .01, -100]} end={[80, .01, 100]} color="#4282bc" />
        <Line start={[90, .01, -100]} end={[90, .01, 100]} color="#4282bc" />
        <Line start={[100, .01, -100]} end={[100, .01, 100]} color="#4282bc" />
        <Line start={[-100, .01, 100]} end={[100, .01, 100]} color="#4282bc" />
        <Line start={[-100, .01, 100]} end={[100, .01, 100]} color="#4282bc" />
        <Line start={[-100, .01, 90]} end={[100, .01, 90]} color="#4282bc" />
        <Line start={[-100, .01, 80]} end={[100, .01, 80]} color="#4282bc" />
        <Line start={[-100, .01, 70]} end={[100, .01, 70]} color="#4282bc" />
        <Line start={[-100, .01, 60]} end={[100, .01, 60]} color="#4282bc" />
        <Line start={[-100, .01, 50]} end={[100, .01, 50]} color="#4282bc" />
        <Line start={[-100, .01, 40]} end={[100, .01, 40]} color="#4282bc" />
        <Line start={[-100, .01, 30]} end={[100, .01, 30]} color="#4282bc" />
        <Line start={[-100, .01, 20]} end={[100, .01, 20]} color="#4282bc" />
        <Line start={[-100, .01, 10]} end={[100, .01, 10]} color="#4282bc" />
        <Line start={[-100, .01, 0]} end={[100, .01, 0]} color="#4282bc" />
        <Line start={[-100, .01, -10]} end={[100, .01, -10]} color="#4282bc" />
        <Line start={[-100, .01, -20]} end={[100, .01, -20]} color="#4282bc" />
        <Line start={[-100, .01, -30]} end={[100, .01, -30]} color="#4282bc" />
        <Line start={[-100, .01, -40]} end={[100, .01, -40]} color="#4282bc" />
        <Line start={[-100, .01, -50]} end={[100, .01, -50]} color="#4282bc" />
        <Line start={[-100, .01, -60]} end={[100, .01, -60]} color="#4282bc" />
        <Line start={[-100, .01, -70]} end={[100, .01, -70]} color="#4282bc" />
        <Line start={[-100, .01, -80]} end={[100, .01, -80]} color="#4282bc" />
        <Line start={[-100, .01, -90]} end={[100, .01, -90]} color="#4282bc" />
        <Line start={[-100, .01, -100]} end={[100, .01, -100]} color="#4282bc" />
      </group>
    </>
  );
};

const Application = () => {
  const [file, setFile] = useState("cube.stl")
  const [fileName, setFileName] = useState("cube.stl")
  const [isBedVisible, setIsBedVisible] = useState(true)
  const [isAxesVisible, setIsAxesVisible] = useState(false)
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraPosition, setCameraPosition] = useState([45, 45, 45])
  const [color, setColor] = useState("#cc8800")

  useEffect(() => {
    const getArgvFile = async () => {
      const argsFile = await window.electronAPI.getArgvFile()
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log(reader.result)
        setFile(reader.result);
        setFileName(argsFile.name)
      }, false);
      reader.readAsDataURL(new Blob([argsFile.content], { type: "model/stl" }));
    }
    const container = containerRef.current;
    const canvas = canvasRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    getArgvFile()
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
    setCameraPosition(() => [0, 0, 1100])
  }

  const onClickSideY = () => {
    setCameraPosition(() => [0, 100, 0])
  }

  const onClickSideZ = () => {
    setCameraPosition(() => [100, 0, 0])
  }

  const onClickResetPosition = () => {
    setCameraPosition(() => [100, 100, 100])
  }

  const onClickChangeColor = value => {
    setColor(value)
  }

  const onClickZoomBed = () => setIsBedVisible(value => !value)
  const onClickZoomAxes = () => setIsAxesVisible(value => !value)

  return (
    <div ref={containerRef} className={style.mainWrapper}>
      <div className={style.controlsWrapper}>
        <div>
          <input className={style.chooseFile} type="file" onChange={onChange} />
        </div>
        <div>
          <button className={style.buttonStandard} onClick={onClickZoomBed}>Bed</button>
          <button className={style.buttonStandard} onClick={onClickZoomAxes}>Axes</button>
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
          <button className={style.buttonColor} style={{ backgroundColor: "#cc8800" }} onClick={() => onClickChangeColor("#cc8800")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#770000" }} onClick={() => onClickChangeColor("#770000")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#111111" }} onClick={() => onClickChangeColor("#111111")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#007700" }} onClick={() => onClickChangeColor("#007700")} />
          <button className={style.buttonColor} style={{ backgroundColor: "#000077" }} onClick={() => onClickChangeColor("#000077")} />
        </div>
      </div>
      <Canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}>
        {fileName ? (
          <Suspense fallback={null}>
            <Model file={file} fileName={fileName} color={color} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <Helpers cameraPosition={cameraPosition} isBedVisible={isBedVisible} isAxesVisible={isAxesVisible} />
          </Suspense>
        ) : <></>}
      </Canvas>
    </div>
  )
}

export default Application
