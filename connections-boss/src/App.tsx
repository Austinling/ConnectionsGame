import { useState } from "react";
import { StageBackground } from "./Stage";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <StageBackground />
    </>
  );
}

export default App;
