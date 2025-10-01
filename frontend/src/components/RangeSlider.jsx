// ...existing code...
import React, { useState, useEffect, useRef } from "react";
import "./rangeSlider.css";

const PriceRangeSlider = ({ min = 0, max = 1000, step = 1, value = [min, max], onChange }) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const range = useRef(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (onChange) onChange([minVal, maxVal]);
  }, [minVal, maxVal, onChange]);

  useEffect(() => {
    if (!range.current) return;
    const percent1 = ((minVal - min) / (max - min)) * 100;
    const percent2 = ((maxVal - min) / (max - min)) * 100;
    range.current.style.background = `linear-gradient(90deg, #eee ${percent1}%, #000000ff ${percent1}%, #000000ff ${percent2}%, #eee ${percent2}%)`;
  }, [minVal, maxVal, min, max]);

  // handlers to prevent page scroll/selection while dragging
  const onTouchMovePrevent = (e) => {
    // prevent scrolling while dragging the slider
    if (dragging.current) e.preventDefault();
  };
  const onMouseMovePrevent = (e) => {
    if (dragging.current) e.preventDefault();
  };

  const startNoSelect = () => {
    document.body.classList.add("no-select");
    dragging.current = true;
    // add listeners that are non-passive so preventDefault works
    window.addEventListener("touchmove", onTouchMovePrevent, { passive: false });
    window.addEventListener("mousemove", onMouseMovePrevent);
  };

  const stopNoSelect = () => {
    document.body.classList.remove("no-select");
    dragging.current = false;
    window.removeEventListener("touchmove", onTouchMovePrevent, { passive: false });
    window.removeEventListener("mousemove", onMouseMovePrevent);
  };

  useEffect(() => {
    // ensure we always clean up if pointer leaves the window
    window.addEventListener("mouseup", stopNoSelect);
    window.addEventListener("touchend", stopNoSelect);
    window.addEventListener("touchcancel", stopNoSelect);
    return () => {
      stopNoSelect();
      window.removeEventListener("mouseup", stopNoSelect);
      window.removeEventListener("touchend", stopNoSelect);
      window.removeEventListener("touchcancel", stopNoSelect);
    };
  }, []);

  const onMinChange = (v) => setMinVal(Math.min(Number(v), maxVal - step));
  const onMaxChange = (v) => setMaxVal(Math.max(Number(v), minVal + step));

  return (
    <div
      className="prs-container"
      onMouseDown={startNoSelect}
      onTouchStart={startNoSelect}
      onMouseUp={stopNoSelect}
      onTouchEnd={stopNoSelect}
    >
      <div className="prs-values">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>

      <div className="prs-slider">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => onMinChange(e.target.value)}
          className="thumb thumb--left"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => onMaxChange(e.target.value)}
          className="thumb thumb--right"
        />
        <div className="prs-range" ref={range} />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
// ...existing code...