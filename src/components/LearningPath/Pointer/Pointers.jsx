import React, { useMemo, useRef, useEffect } from "react";
import Units from "../Unit/Units";

const Pointers = ({ pointers, CurrentProgress }) => {
  const containerRef = useRef(null);

  const reversedPointer = useMemo(() => {
    return Array.isArray(pointers) ? [...pointers].reverse() : [];
  }, [pointers]);

  // Update scroll position on component mount and whenever the units change
  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }, [reversedPointer]);

  return (
    <div ref={containerRef} className="overflow" style={{ maxHeight: "500vh" }}>
      {reversedPointer.map((pointer, index) => (
        <>
          <Units units={pointer?.units} CurrentProgress={CurrentProgress} />
        </>
      ))}
    </div>
  );
};

export default Pointers;
