import React, { useState, useRef, useEffect } from "react";

// Reference images according to your corrected spelling and structure
const backgrounds = [
  { label: "Blank", value: "" },
  { label: "20 Beaches", value: "backgrounds/20beaches_background.png" },
  { label: "Chucky", value: "backgrounds/chucky_background.png" },
  { label: "Raceone", value: "backgrounds/raceone_background.png" },
  { label: "Sss", value: "backgrounds/sss_background.png" },
  { label: "Warw", value: "backgrounds/warw_background.png" }
];

const banners = [
  { label: "Blank", value: "" },
  { label: "20 Beaches", value: "banner/20beaches_banner.png" },
  { label: "Chucky", value: "banner/chucky_banner.png" },
  { label: "Raceone", value: "banner/raceone_banner.png" },
  { label: "Sss", value: "banner/sss_banner.png" },
  { label: "Warw", value: "banner/warw_banner.png" }
];

const countdownOptions = [3, 5, 10, 20];
const WINNERS_KEY = "random-draw-winners";

function readWinners() {
  try {
    return JSON.parse(localStorage.getItem(WINNERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveWinners(list) {
  localStorage.setItem(WINNERS_KEY, JSON.stringify(list));
}

export default function RandomNameDrawApp() {
  const [namesRaw, setNamesRaw] = useState("");
  const [names, setNames] = useState([]);
  const [countdown, setCountdown] = useState(countdownOptions[0]);
  const [bg, setBg] = useState(backgrounds[0].value);
  const [banner, setBanner] = useState(banners[0].value);
  const [winner, setWinner] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timer, setTimer] = useState(countdown);
  const [winners, setWinners] = useState(readWinners());
  const namesInputRef = useRef();

  useEffect(() => {
    setTimer(countdown);
  }, [countdown]);

  useEffect(() => {
    saveWinners(winners);
  }, [winners]);

  useEffect(() => {
    const arr = namesRaw
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setNames(arr);
  }, [namesRaw]);

  function handleDraw() {
    if (names.length === 0) return;
    setIsDrawing(true);
    setTimer(countdown);
    setWinner(null);
    const countdownInterval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(countdownInterval);
          const available = names.filter((n) => !winners.includes(n));
          let pick = available.length
            ? available[Math.floor(Math.random() * available.length)]
            : names[Math.floor(Math.random() * names.length)];
          setWinner(pick);
          setWinners((w) => (pick && !w.includes(pick) ? [...w, pick] : w));
          setIsDrawing(false);
          return countdown;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleRedraw() {
    if (names.length === 0) return;
    const exclude = winner ? [...winners, winner] : winners;
    const available = names.filter((n) => !exclude.includes(n));
    if (available.length === 0) return;
    setIsDrawing(true);
    setTimer(countdown);
    setWinner(null);
    const countdownInterval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(countdownInterval);
          const pick =
            available[Math.floor(Math.random() * available.length)];
          setWinner(pick);
          setWinners((w) => (pick && !w.includes(pick) ? [...w, pick] : w));
          setIsDrawing(false);
          return countdown;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleClearWinners() {
    setWinners([]);
  }

  function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNamesRaw(event.target.result);
    };
    reader.readAsText(file);
  }

  function downloadSample() {
    const sample = "Alice\nBob\nCharlie\nDana";
    const blob = new Blob([sample], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_names.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Bulletproof background style logic
  let bgStyle = {};
  if (bg) {
    if (bg.endsWith(".jpg") || bg.endsWith(".png")) {
      bgStyle.backgroundImage = `url(${process.env.PUBLIC_URL + "/" + bg})`;
      bgStyle.backgroundSize = "cover";
      bgStyle.backgroundPosition = "center";
    } else {
      bgStyle.background = bg;
    }
  }

  return (
    <div className="rnd-app" style={bgStyle}>
      <div className="rnd-controls">
        <h2>Random Name Draw</h2>
        <label>
          Paste Names (one per line):
          <textarea
            ref={namesInputRef}
            rows={6}
            value={namesRaw}
            onChange={(e) => setNamesRaw(e.target.value)}
            disabled={isDrawing}
            placeholder="Enter one name per line..."
          />
        </label>
        <div>
          <button onClick={downloadSample} style={{marginRight:8}}>Download Sample List</button>
          <input
            type="file"
            accept=".txt"
            style={{ display: "inline" }}
            onChange={handleFileUpload}
            disabled={isDrawing}
          />
        </div>
        <div style={{marginTop:12}}>
          <label>
            Countdown (seconds):{" "}
            <select
              value={countdown}
              onChange={(e) => setCountdown(Number(e.target.value))}
              disabled={isDrawing}
            >
              {countdownOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label style={{marginLeft:16}}>
            Background:{" "}
            <select
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              disabled={isDrawing}
            >
              {backgrounds.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label style={{marginLeft:16}}>
            Banner:{" "}
            <select
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              disabled={isDrawing}
            >
              {banners.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{marginTop:18}}>
          <button
            onClick={handleDraw}
            disabled={isDrawing || names.length === 0}
            style={{ fontWeight: "bold", fontSize: "1.1em" }}
          >
            Draw!
          </button>
          <button
            onClick={handleRedraw}
            disabled={isDrawing || !winner || names.length === 0}
            style={{
              marginLeft: 10,
              opacity: 0.6,
              fontSize: "0.9em",
              padding: "0.2em 1em",
            }}
            title="Redraw (omit last winner)"
          >
            ↻
          </button>
        </div>
      </div>

      <div className="rnd-display">
        {banner && (
          banner.endsWith(".png") || banner.endsWith(".jpg") ?
            <img
              className="rnd-banner"
              src={process.env.PUBLIC_URL + "/" + banner}
              alt="Banner"
              style={{maxWidth: "100%", maxHeight: 80}}
            />
            :
            <div className="rnd-banner">{banner}</div>
        )}
        {isDrawing ? (
          <div className="rnd-countdown">Drawing in... {timer}</div>
        ) : winner ? (
          <div className="rnd-winner">
            <span>🎉</span>
            <span>{winner}</span>
            <span>🎉</span>
          </div>
        ) : (
          <div className="rnd-wait">Click Draw!</div>
        )}
      </div>

      <div className="rnd-winners">
        <h4>Winners</h4>
        {winners.length === 0 ? (
          <div>No winners yet.</div>
        ) : (
          <ol>
            {winners.map((w, i) => (
              <li key={w + i}>{w}</li>
            ))}
          </ol>
        )}
        <button onClick={handleClearWinners} style={{marginTop:4}}>Clear Winners</button>
      </div>
    </div>
  );
}
