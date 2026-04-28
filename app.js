const teams = [
  { key: "away", label: "先攻", defaultName: "ビジター" },
  { key: "home", label: "後攻", defaultName: "ホーム" },
];

const innings = Array.from({ length: 9 }, (_, index) => index + 1);
const defaultPlayers = [
  "ユリナ",
  "マリナ",
  "タイヨウ",
  "ハルカ",
  "ジュンナ",
  "ショウマ",
  "中村ハルト",
  "エイタ",
  "ヤマト",
  "タクミ",
  "ハルト",
  "ヒロト",
  "ルイ",
  "ヨウノスケ",
];
const positions = ["投", "捕", "一", "二", "三", "遊", "左", "中", "右", "DH", "控"];
const pitchLabels = {
  strike: "ストライク",
  ball: "ボール",
  foul: "ファール",
};

const resultMap = {
  single: { label: "単打", ab: 1, hit: 1, double: 0, triple: 0, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 0, hbp: 0, ob: 1 },
  double: { label: "二塁打", ab: 1, hit: 1, double: 1, triple: 0, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 0, hbp: 0, ob: 1 },
  triple: { label: "三塁打", ab: 1, hit: 1, double: 0, triple: 1, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 0, hbp: 0, ob: 1 },
  homerun: { label: "本塁打", ab: 1, hit: 1, double: 0, triple: 0, hr: 1, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 0, hbp: 0, ob: 1 },
  out: { label: "凡退", ab: 1, hit: 0, double: 0, triple: 0, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 0, hbp: 0, ob: 0 },
  swingK: { label: "空振り三振", ab: 1, hit: 0, double: 0, triple: 0, hr: 0, k: 1, swingK: 1, lookK: 0, sac: 0, bb: 0, hbp: 0, ob: 0 },
  lookK: { label: "見逃し三振", ab: 1, hit: 0, double: 0, triple: 0, hr: 0, k: 1, swingK: 0, lookK: 1, sac: 0, bb: 0, hbp: 0, ob: 0 },
  walk: { label: "四球", ab: 0, hit: 0, double: 0, triple: 0, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 1, hbp: 0, ob: 1 },
  hbp: { label: "死球", ab: 0, hit: 0, double: 0, triple: 0, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 0, bb: 0, hbp: 1, ob: 1 },
  sac: { label: "犠打", ab: 0, hit: 0, double: 0, triple: 0, hr: 0, k: 0, swingK: 0, lookK: 0, sac: 1, bb: 0, hbp: 0, ob: 0 },
};

const storageKey = "baseball-score-records-v1";
const scoreBody = document.querySelector("#scoreBody");
const resultText = document.querySelector("#resultText");
const totalRuns = document.querySelector("#totalRuns");
const clearButton = document.querySelector("#clearButton");
const sampleButton = document.querySelector("#sampleButton");
const exportButton = document.querySelector("#exportButton");
const saveGameButton = document.querySelector("#saveGameButton");
const newGameButton = document.querySelector("#newGameButton");
const gameDate = document.querySelector("#gameDate");
const gameName = document.querySelector("#gameName");
const venue = document.querySelector("#venue");
const notes = document.querySelector("#notes");
const plateForm = document.querySelector("#plateForm");
const battingTeam = document.querySelector("#battingTeam");
const battingOrder = document.querySelector("#battingOrder");
const playerName = document.querySelector("#playerName");
const playerList = document.querySelector("#playerList");
const pinchStatus = document.querySelector("#pinchStatus");
const plateResult = document.querySelector("#plateResult");
const steals = document.querySelector("#steals");
const stealsOther = document.querySelector("#stealsOther");
const plateMemo = document.querySelector("#plateMemo");
const pitcherName = document.querySelector("#pitcherName");
const pitchButtons = [...document.querySelectorAll(".pitch-button")];
const undoPitchButton = document.querySelector("#undoPitchButton");
const resetCountButton = document.querySelector("#resetCountButton");
const currentBalls = document.querySelector("#currentBalls");
const currentStrikes = document.querySelector("#currentStrikes");
const currentFouls = document.querySelector("#currentFouls");
const currentPitchTotal = document.querySelector("#currentPitchTotal");
const countStatus = document.querySelector("#countStatus");
const gamePitchTotal = document.querySelector("#gamePitchTotal");
const gameStrikeTotal = document.querySelector("#gameStrikeTotal");
const gameBallTotal = document.querySelector("#gameBallTotal");
const gameFoulTotal = document.querySelector("#gameFoulTotal");
const pitchSummaryBody = document.querySelector("#pitchSummaryBody");
const awayLineupBody = document.querySelector("#awayLineupBody");
const homeLineupBody = document.querySelector("#homeLineupBody");
const playerSummaryBody = document.querySelector("#playerSummaryBody");
const plateLogBody = document.querySelector("#plateLogBody");
const plateLogCount = document.querySelector("#plateLogCount");
const gameHistoryBody = document.querySelector("#gameHistoryBody");
const gameDetailPanel = document.querySelector("#gameDetailPanel");
const gameDetailTitle = document.querySelector("#gameDetailTitle");
const gameDetailContent = document.querySelector("#gameDetailContent");
const closeGameDetailButton = document.querySelector("#closeGameDetailButton");
const allPa = document.querySelector("#allPa");
const allHits = document.querySelector("#allHits");
const allOb = document.querySelector("#allOb");
const basePa = document.querySelector("#basePa");
const addedPa = document.querySelector("#addedPa");
const sortButtons = [...document.querySelectorAll(".sort-button")];

let plateRecords = [];
let pitchRecords = [];
let currentCount = { balls: 0, strikes: 0, fouls: 0, total: 0 };
let pitcherCounts = {};
let lineups = createEmptyLineups();
let gameHistory = [];
let summarySort = { key: "avg", direction: "desc" };
const baseRecords = Array.isArray(window.BASE_RECORDS) ? window.BASE_RECORDS : [];

function makeNumberInput(className, label) {
  const input = document.createElement("input");
  input.className = className;
  input.type = "number";
  input.min = "0";
  input.max = "99";
  input.inputMode = "numeric";
  input.setAttribute("aria-label", label);
  input.addEventListener("input", updateTotals);
  input.addEventListener("change", saveState);
  return input;
}

function buildRows() {
  scoreBody.innerHTML = "";

  teams.forEach((team) => {
    const row = document.createElement("tr");
    row.dataset.team = team.key;

    const nameCell = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.className = "team-input";
    nameInput.type = "text";
    nameInput.value = team.defaultName;
    nameInput.setAttribute("aria-label", `${team.label}チーム名`);
    nameInput.addEventListener("input", updateTotals);
    nameInput.addEventListener("change", saveState);
    nameCell.append(nameInput);
    row.append(nameCell);

    innings.forEach((inning) => {
      const cell = document.createElement("td");
      cell.append(makeNumberInput("score-input inning-score", `${team.label} ${inning}回`));
      row.append(cell);
    });

    const runCell = document.createElement("td");
    runCell.className = "total runs-total";
    runCell.textContent = "0";
    row.append(runCell);

    const hitsCell = document.createElement("td");
    hitsCell.append(makeNumberInput("stat-input hits", `${team.label} 安打`));
    row.append(hitsCell);

    const errorsCell = document.createElement("td");
    errorsCell.append(makeNumberInput("stat-input errors", `${team.label} 失策`));
    row.append(errorsCell);

    scoreBody.append(row);
  });
}

function createEmptyLineup() {
  return Array.from({ length: 9 }, (_, index) => ({
    order: index + 1,
    starter: "",
    player: "",
    position: "",
    memo: "",
  }));
}

function createEmptyLineups() {
  return {
    away: createEmptyLineup(),
    home: createEmptyLineup(),
  };
}

function buildLineup({ syncActive = true } = {}) {
  buildLineupForTeam("away", awayLineupBody);
  buildLineupForTeam("home", homeLineupBody);
  buildBattingOrderOptions();
  if (syncActive) syncBatterFromOrder();
}

function buildLineupForTeam(teamKey, body) {
  body.innerHTML = "";

  lineups[teamKey].forEach((spot, index) => {
    const row = document.createElement("tr");

    const orderCell = document.createElement("td");
    orderCell.textContent = String(spot.order);
    row.append(orderCell);

    const playerCell = document.createElement("td");
    const starterInput = document.createElement("input");
    starterInput.type = "text";
    starterInput.value = spot.starter || spot.player;
    starterInput.setAttribute("list", "playerList");
    starterInput.setAttribute("aria-label", `${teamLabel(teamKey)} ${spot.order}番 先発`);
    starterInput.addEventListener("input", () => updateLineup(teamKey, index, "starter", starterInput.value));
    playerCell.append(starterInput);
    row.append(playerCell);

    const currentPlayerCell = document.createElement("td");
    const playerInput = document.createElement("input");
    playerInput.type = "text";
    playerInput.value = spot.player;
    playerInput.setAttribute("list", "playerList");
    playerInput.setAttribute("aria-label", `${teamLabel(teamKey)} ${spot.order}番 現在の打者`);
    playerInput.addEventListener("input", () => updateLineup(teamKey, index, "player", playerInput.value));
    currentPlayerCell.append(playerInput);
    row.append(currentPlayerCell);

    const positionCell = document.createElement("td");
    const positionSelect = document.createElement("select");
    positionSelect.setAttribute("aria-label", `${teamLabel(teamKey)} ${spot.order}番 ポジション`);
    positionSelect.innerHTML = `<option value="">選択</option>${positions
      .map((position) => `<option value="${position}">${position}</option>`)
      .join("")}`;
    positionSelect.value = spot.position;
    positionSelect.addEventListener("change", () => updateLineup(teamKey, index, "position", positionSelect.value));
    positionCell.append(positionSelect);
    row.append(positionCell);

    const memoCell = document.createElement("td");
    const memoInput = document.createElement("input");
    memoInput.type = "text";
    memoInput.value = spot.memo;
    memoInput.setAttribute("aria-label", `${teamLabel(teamKey)} ${spot.order}番 メモ`);
    memoInput.addEventListener("input", () => updateLineup(teamKey, index, "memo", memoInput.value));
    memoCell.append(memoInput);
    row.append(memoCell);

    const actionCell = document.createElement("td");
    const useButton = document.createElement("button");
    useButton.className = "detail-button lineup-use-button";
    useButton.type = "button";
    useButton.textContent = "打席へ";
    useButton.addEventListener("click", () => selectLineupSpot(teamKey, spot.order));
    actionCell.append(useButton);
    row.append(actionCell);

    body.append(row);
  });
}

function updateLineup(teamKey, index, key, value) {
  lineups[teamKey][index][key] = value;
  if (key === "starter" && !lineups[teamKey][index].player) {
    lineups[teamKey][index].player = value;
    buildLineup({ syncActive: battingTeam.value === teamKey && String(battingOrder.value) === String(lineups[teamKey][index].order) });
  } else {
    buildBattingOrderOptions();
    if (battingTeam.value === teamKey && String(battingOrder.value) === String(lineups[teamKey][index].order)) {
      syncBatterFromOrder();
    } else {
      updatePinchStatus();
    }
  }
  renderPlayerList(summarizeRecords());
  saveState();
}

function teamLabel(teamKey) {
  if (teamKey === "home") return "後攻";
  if (teamKey === "away") return "先攻";
  return "";
}

function buildBattingOrderOptions() {
  const selectedOrder = battingOrder.value || "1";
  battingOrder.innerHTML = lineups[battingTeam.value]
    .map((spot) => {
      const name = spot.player || spot.starter || "";
      return `<option value="${spot.order}">${spot.order}番${name ? ` ${escapeHtml(name)}` : ""}</option>`;
    })
    .join("");
  if ([...battingOrder.options].some((option) => option.value === selectedOrder)) {
    battingOrder.value = selectedOrder;
  }
}

function syncBatterFromOrder() {
  const spot = currentLineupSpot();
  if (!spot) return;
  playerName.value = spot.player || spot.starter || "";
  updatePinchStatus();
}

function currentLineupSpot() {
  return lineups[battingTeam.value]?.find((spot) => String(spot.order) === String(battingOrder.value));
}

function selectLineupSpot(teamKey, order) {
  battingTeam.value = teamKey;
  buildBattingOrderOptions();
  battingOrder.value = String(order);
  syncBatterFromOrder();
  document.querySelector("#plateSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  saveState();
}

function updatePinchStatus() {
  const spot = currentLineupSpot();
  const current = playerName.value.trim();
  const starter = spot?.starter?.trim() || "";
  const isPinch = Boolean(starter && current && starter !== current);
  pinchStatus.textContent = isPinch ? `代打: ${starter} → ${current}` : "通常";
  pinchStatus.classList.toggle("active", isPinch);
}

function readScore(row) {
  return [...row.querySelectorAll(".inning-score")].reduce((sum, input) => {
    return sum + Number(input.value || 0);
  }, 0);
}

function teamName(row) {
  return row.querySelector(".team-input").value.trim() || "未入力";
}

function updateTotals() {
  const rows = [...scoreBody.querySelectorAll("tr")];
  const scores = rows.map((row) => {
    const runs = readScore(row);
    row.querySelector(".runs-total").textContent = String(runs);
    return { name: teamName(row), runs };
  });

  totalRuns.textContent = `${scores[0].runs} - ${scores[1].runs}`;
  resultText.className = "";

  if (scores[0].runs === 0 && scores[1].runs === 0) {
    resultText.textContent = "未入力";
    return;
  }

  if (scores[0].runs === scores[1].runs) {
    resultText.textContent = "引き分け";
    resultText.classList.add("tie");
    return;
  }

  const winner = scores[0].runs > scores[1].runs ? scores[0] : scores[1];
  resultText.textContent = `${winner.name} 勝利`;
  resultText.classList.add("winner");
}

function formatRate(numerator, denominator) {
  if (!denominator) return ".000";
  return (numerator / denominator).toFixed(3).replace(/^0/, "");
}

function calculateRate(numerator, denominator) {
  if (!denominator) return 0;
  return numerator / denominator;
}

function currentGameLabel() {
  const name = gameName.value.trim();
  const date = gameDate.value;
  if (name && date) return `${name} ${date}`;
  return name || date || "未入力の試合";
}

function addPlateRecord(event) {
  event.preventDefault();

  const name = playerName.value.trim();
  if (!name) return;

  const result = resultMap[plateResult.value];
  const lineupSpot = currentLineupSpot() || findLineupSpot(name);
  const starter = lineupSpot?.starter?.trim() || "";
  const isPinchHitter = Boolean(starter && name !== starter);
  const record = {
    id: Date.now(),
    source: "added",
    game: currentGameLabel(),
    gameDate: gameDate.value,
    team: battingTeam.value,
    batter: name,
    battingOrder: lineupSpot?.order || "",
    position: lineupSpot?.position || "",
    starter,
    isPinchHitter,
    resultKey: plateResult.value,
    result: `${isPinchHitter ? "代打 " : ""}${result.label}`,
    pa: 1,
    ab: result.ab,
    hit: result.hit,
    double: result.double,
    triple: result.triple,
    hr: result.hr,
    k: result.k,
    swingK: result.swingK,
    lookK: result.lookK,
    sac: result.sac,
    bb: result.bb,
    hbp: result.hbp,
    steal: Number(steals.value || 0),
    stealOther: Number(stealsOther.value || 0),
    ob: result.ob,
    memo: plateMemo.value.trim(),
  };

  plateRecords.unshift(record);
  playerName.value = "";
  moveToNextBatter(battingTeam.value, lineupSpot?.order);
  steals.value = "0";
  stealsOther.value = "0";
  plateMemo.value = "";
  renderRecords();
  saveState();
}

function moveToNextBatter(teamKey, currentOrder) {
  const filledLineup = lineups[teamKey].filter((spot) => spot.player.trim() || spot.starter.trim());
  if (!filledLineup.length) return;

  const nextSpot =
    filledLineup.find((spot) => spot.order > currentOrder) ||
    filledLineup.find((spot) => spot.order === Math.min(...filledLineup.map((spot) => spot.order)));

  if (nextSpot) {
    battingOrder.value = String(nextSpot.order);
    playerName.value = nextSpot.player || nextSpot.starter;
    updatePinchStatus();
  }
}

function summarizeRecords() {
  const empty = () => ({
    pa: 0,
    ab: 0,
    hit: 0,
    double: 0,
    triple: 0,
    hr: 0,
    k: 0,
    swingK: 0,
    lookK: 0,
    sac: 0,
    bb: 0,
    hbp: 0,
    steal: 0,
    stealOther: 0,
    ob: 0,
  });

  return allRecords().reduce((summary, record) => {
    summary[record.batter] = summary[record.batter] || empty();
    Object.keys(summary[record.batter]).forEach((key) => {
      summary[record.batter][key] += Number(record[key] || 0);
    });
    return summary;
  }, {});
}

function renderPlayerList(summary) {
  const lineupNames = Object.values(lineups)
    .flat()
    .flatMap((spot) => [spot.starter?.trim(), spot.player?.trim()])
    .filter(Boolean);
  const pitcherNames = pitchRecords.map((pitch) => pitch.pitcher).filter(Boolean);
  const names = [...new Set([...defaultPlayers, ...lineupNames, ...pitcherNames, ...Object.keys(summary)])].sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
  playerList.innerHTML = names.map((name) => `<option value="${escapeHtml(name)}"></option>`).join("");
}

function renderRecords() {
  const summary = summarizeRecords();
  renderPlayerList(summary);

  const totals = allRecords().reduce(
    (sum, row) => {
      sum.pa += row.pa;
      sum.hit += row.hit;
      sum.ob += row.ob;
      return sum;
    },
    { pa: 0, hit: 0, ob: 0 },
  );
  const baseTotal = baseRecords.reduce((sum, row) => sum + Number(row.pa || 0), 0);
  const addedTotal = plateRecords.reduce((sum, row) => sum + Number(row.pa || 0), 0);
  basePa.textContent = String(baseTotal);
  addedPa.textContent = String(addedTotal);
  allPa.textContent = String(totals.pa);
  allHits.textContent = String(totals.hit);
  allOb.textContent = String(totals.ob);

  const rows = Object.entries(summary)
    .map(([name, row]) => {
      const obDenominator = row.ab + row.bb + row.hbp + row.sac;
      const totalBases = row.hit + row.double + row.triple * 2 + row.hr * 3;
      const obp = calculateRate(row.ob, obDenominator);
      return {
        name,
        row,
        avg: calculateRate(row.hit, row.ab),
        obp,
        ops: obp + calculateRate(totalBases, row.ab),
        kRate: calculateRate(row.k, row.ab),
      };
    })
    .sort(compareSummaryRows);
  updateSortButtons();

  playerSummaryBody.innerHTML = rows.length
    ? rows
        .map(({ name, row }) => {
          const obDenominator = row.ab + row.bb + row.hbp + row.sac;
          const totalBases = row.hit + row.double + row.triple * 2 + row.hr * 3;
          const obp = calculateRate(row.ob, obDenominator);
          const ops = obp + calculateRate(totalBases, row.ab);
          return `
            <tr>
              <td>${escapeHtml(name)}</td>
              <td>${formatRate(row.hit, row.ab)}</td>
              <td>${formatRate(row.ob, obDenominator)}</td>
              <td>${ops.toFixed(3).replace(/^0/, "")}</td>
              <td>${row.ob}</td>
              <td>${row.pa}</td>
              <td>${row.ab}</td>
              <td>${row.hit}</td>
              <td>${row.double}</td>
              <td>${row.triple}</td>
              <td>${row.hr}</td>
              <td>${row.bb}</td>
              <td>${row.hbp}</td>
              <td>${row.k}</td>
              <td>${formatRate(row.k, row.ab)}</td>
              <td>${row.steal}</td>
            </tr>
          `;
        })
        .join("")
    : `<tr class="empty-row"><td colspan="16">まだ打席記録がありません</td></tr>`;

  const logRecords = allRecords();
  if (plateLogCount) plateLogCount.textContent = `${logRecords.length}件`;
  plateLogBody.innerHTML = logRecords.length
    ? logRecords
        .map((record) => `
          <tr>
            <td>${escapeHtml(record.game)}</td>
            <td>${escapeHtml(teamLabel(record.team || ""))}</td>
            <td>${escapeHtml(record.battingOrder || "")}</td>
            <td>${escapeHtml(record.batter)}</td>
            <td>${escapeHtml(record.position || "")}</td>
            <td>${escapeHtml(record.result)}</td>
            <td>${record.pa}</td>
            <td>${record.ab}</td>
            <td>${record.hit}</td>
            <td>${record.k}</td>
            <td>${record.bb}</td>
            <td>${record.hbp}</td>
            <td>${record.sac}</td>
            <td>${record.steal}</td>
            <td>${record.ob}</td>
            <td>${escapeHtml(record.source === "base" ? "基データ" : record.memo)}</td>
          </tr>
        `)
        .join("")
    : `<tr class="empty-row"><td colspan="16">打席を追加するとここに履歴が出ます</td></tr>`;

  renderGameHistory();
  renderPitchCounts();
}

function compareSummaryRows(a, b) {
  const direction = summarySort.direction === "asc" ? 1 : -1;
  const key = summarySort.key;

  if (key === "name") {
    return a.name.localeCompare(b.name, "ja") * direction;
  }

  const primary = (Number(a[key] ?? a.row[key] ?? 0) - Number(b[key] ?? b.row[key] ?? 0)) * direction;
  if (primary !== 0) return primary;

  const hitTieBreak = b.row.hit - a.row.hit;
  if (hitTieBreak !== 0) return hitTieBreak;

  const paTieBreak = b.row.pa - a.row.pa;
  if (paTieBreak !== 0) return paTieBreak;

  return a.name.localeCompare(b.name, "ja");
}

function updateSortButtons() {
  sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === summarySort.key;
    button.classList.toggle("active", isActive);
    button.classList.toggle("asc", isActive && summarySort.direction === "asc");
    button.classList.toggle("desc", isActive && summarySort.direction === "desc");
    button.setAttribute(
      "aria-label",
      `${button.textContent.trim()}で${isActive && summarySort.direction === "desc" ? "低い順" : "高い順"}に並び替え`,
    );
  });
}

function changeSummarySort(event) {
  const key = event.currentTarget.dataset.sort;
  if (!key) return;

  if (summarySort.key === key) {
    summarySort = { key, direction: summarySort.direction === "desc" ? "asc" : "desc" };
  } else {
    summarySort = { key, direction: key === "name" ? "asc" : "desc" };
  }
  renderRecords();
}

function allRecords() {
  return [...plateRecords, ...baseRecords];
}

function emptyPitchCount() {
  return { balls: 0, strikes: 0, fouls: 0, total: 0 };
}

function normalizePitcherName(name) {
  return String(name || "").trim();
}

function fallbackPitcherName() {
  return normalizePitcherName(
    Object.values(lineups)
      .flat()
      .find((spot) => spot.position === positions[0])?.player,
  );
}

function activePitcherName() {
  const pitcher = normalizePitcherName(pitcherName.value) || fallbackPitcherName();
  if (pitcher) pitcherName.value = pitcher;
  return pitcher;
}

function countForPitcher(pitcher) {
  return { ...emptyPitchCount(), ...(pitcherCounts[normalizePitcherName(pitcher)] || {}) };
}

function setCountForPitcher(pitcher, count) {
  const key = normalizePitcherName(pitcher);
  if (!key) return;
  pitcherCounts[key] = { ...emptyPitchCount(), ...count };
}

function syncCurrentCountFromPitcher() {
  const pitcher = normalizePitcherName(pitcherName.value);
  currentCount = pitcher ? countForPitcher(pitcher) : emptyPitchCount();
  renderPitchCounts();
}

function findLineupSpot(name) {
  return Object.values(lineups)
    .flat()
    .find((spot) => spot.player.trim() === name.trim() || spot.starter.trim() === name.trim());
}

function addPitch(event) {
  const pitcher = activePitcherName();
  if (!pitcher) {
    pitcherName.focus();
    return;
  }

  currentCount = countForPitcher(pitcher);
  const countBefore = { ...currentCount };
  applyPitchToCount(event.currentTarget.dataset.pitch);
  setCountForPitcher(pitcher, currentCount);

  pitchRecords.push({
    id: Date.now() + Math.random(),
    game: currentGameLabel(),
    gameDate: gameDate.value,
    pitcher,
    type: event.currentTarget.dataset.pitch,
    countBefore,
    countAfter: { ...currentCount },
  });
  renderPitchCounts();
  saveState();
}

function undoPitch() {
  const removed = pitchRecords.pop();
  if (removed) {
    pitcherName.value = removed.pitcher || pitcherName.value;
    currentCount = { ...emptyPitchCount(), ...(removed.countBefore || {}) };
    setCountForPitcher(removed.pitcher, currentCount);
  } else {
    currentCount = emptyPitchCount();
  }
  renderPitchCounts();
  saveState();
}

function applyPitchToCount(type) {
  currentCount.total += 1;

  if (type === "ball") {
    currentCount.balls += 1;
  }

  if (type === "strike") {
    currentCount.strikes += 1;
  }

  if (type === "foul") {
    currentCount.fouls += 1;
    if (currentCount.strikes < 2) {
      currentCount.strikes += 1;
    }
  }
}

function resetCount() {
  const pitcher = normalizePitcherName(pitcherName.value);
  currentCount = emptyPitchCount();
  if (pitcher) setCountForPitcher(pitcher, currentCount);
  renderPitchCounts();
  saveState();
}

function summarizePitches() {
  return pitchRecords.reduce((summary, pitch) => {
    summary[pitch.pitcher] = summary[pitch.pitcher] || { total: 0, strike: 0, ball: 0, foul: 0 };
    summary[pitch.pitcher].total += 1;
    summary[pitch.pitcher][pitch.type] += 1;
    return summary;
  }, {});
}

function pitchTotals(records = pitchRecords) {
  return records.reduce(
    (totals, pitch) => {
      totals.total += 1;
      totals[pitch.type] += 1;
      return totals;
    },
    { total: 0, strike: 0, ball: 0, foul: 0 },
  );
}

function renderPitchCounts() {
  const totals = pitchTotals();
  currentBalls.textContent = String(currentCount.balls);
  currentStrikes.textContent = String(currentCount.strikes);
  currentFouls.textContent = String(currentCount.fouls);
  currentPitchTotal.textContent = String(currentCount.total);
  countStatus.textContent = countStatusText();
  gamePitchTotal.textContent = String(totals.total);
  gameStrikeTotal.textContent = String(totals.strike);
  gameBallTotal.textContent = String(totals.ball);
  gameFoulTotal.textContent = String(totals.foul);

  const rows = Object.entries(summarizePitches()).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0], "ja"));
  pitchSummaryBody.innerHTML = rows.length
    ? rows
        .map(([pitcher, row]) => `
          <tr>
            <td>${escapeHtml(pitcher)}</td>
            <td>${row.total}</td>
            <td>${row.strike}</td>
            <td>${row.ball}</td>
            <td>${row.foul}</td>
            <td>${pitcherCountText(pitcher)}</td>
          </tr>
        `)
        .join("")
    : `<tr class="empty-row"><td colspan="6">投球を記録するとここに投手別集計が出ます</td></tr>`;
}

function countStatusText() {
  if (currentCount.balls >= 4) return "四球です。次の打者を押すとカウントを戻せます。";
  if (currentCount.strikes >= 3) return "三振です。次の打者を押すとカウントを戻せます。";
  return `${currentCount.balls}ボール ${currentCount.strikes}ストライク`;
}

function pitcherCountText(pitcher) {
  const count = countForPitcher(pitcher);
  if (!count.total) return "-";
  return `${count.balls}B ${count.strikes}S / ${count.total}球`;
}

function currentScoreSnapshot() {
  return [...scoreBody.querySelectorAll("tr")].map((row) => ({
    team: row.dataset.team,
    name: row.querySelector(".team-input").value,
    innings: [...row.querySelectorAll(".inning-score")].map((input) => input.value),
    runs: readScore(row),
    hits: row.querySelector(".hits").value,
    errors: row.querySelector(".errors").value,
  }));
}

function scoreLabel(rows = currentScoreSnapshot()) {
  if (rows.length < 2) return "";
  return `${rows[0].name || "ビジター"} ${rows[0].runs} - ${rows[1].runs} ${rows[1].name || "ホーム"}`;
}

function saveCurrentGame() {
  const snapshot = currentScoreSnapshot();
  const pitches = pitchTotals();
  const savedGame = {
    id: Date.now(),
    date: gameDate.value,
    name: currentGameLabel(),
    venue: venue.value.trim(),
    notes: notes.value.trim(),
    score: scoreLabel(snapshot),
    pitchTotal: pitches.total,
    pitchSummary: pitches,
    scoreRows: snapshot,
    lineups: structuredClone(lineups),
    records: structuredClone(plateRecords),
    pitchRecords: structuredClone(pitchRecords),
  };

  const existingIndex = gameHistory.findIndex((game) => game.name === savedGame.name);
  if (existingIndex >= 0) {
    gameHistory[existingIndex] = savedGame;
  } else {
    gameHistory.unshift(savedGame);
  }
  renderGameHistory();
  saveState();
}

function renderGameHistory() {
  gameHistoryBody.innerHTML = gameHistory.length
    ? gameHistory
        .map((game) => `
          <tr>
            <td>${escapeHtml(game.date || "")}</td>
            <td>${escapeHtml(game.name || "")}</td>
            <td>${escapeHtml(game.score || "")}</td>
            <td>${escapeHtml(game.venue || "")}</td>
            <td>${Number(game.pitchTotal || 0)}</td>
            <td>${Number(game.records?.length || 0)}</td>
            <td>
              <button class="detail-button" type="button" data-game-id="${game.id}">詳細</button>
            </td>
          </tr>
        `)
        .join("")
    : `<tr class="empty-row"><td colspan="7">試合保存を押すとここに履歴が残ります</td></tr>`;

  gameHistoryBody.querySelectorAll(".detail-button").forEach((button) => {
    button.addEventListener("click", () => showGameDetail(button.dataset.gameId));
  });
}

function showGameDetail(gameId) {
  const game = gameHistory.find((item) => String(item.id) === String(gameId));
  if (!game) return;

  gameDetailTitle.textContent = game.name || "試合詳細";
  gameDetailContent.innerHTML = `
    <div class="detail-grid">
      <div><span>日付</span><strong>${escapeHtml(game.date || "")}</strong></div>
      <div><span>スコア</span><strong>${escapeHtml(game.score || "")}</strong></div>
      <div><span>球場</span><strong>${escapeHtml(game.venue || "")}</strong></div>
      <div><span>投球数</span><strong>${Number(game.pitchTotal || 0)}</strong></div>
    </div>
    <div class="detail-section">
      <h3>打順・ポジション</h3>
      <div class="table-wrap">
        <table class="lineup-table">
          <thead><tr><th>打順</th><th>先発</th><th>ポジション</th><th>代打</th><th>メモ</th></tr></thead>
          <tbody>${renderDetailLineup(game.lineups || game.lineup || [])}</tbody>
        </table>
      </div>
    </div>
    <div class="detail-section">
      <h3>打席記録</h3>
      <div class="table-wrap">
        <table class="records-table">
          <thead><tr><th>打順</th><th>打者</th><th>守備</th><th>結果</th><th>打数</th><th>安打</th><th>三振</th><th>四球</th><th>死球</th><th>盗塁</th><th>メモ</th></tr></thead>
          <tbody>${renderDetailRecords(game.records || [])}</tbody>
        </table>
      </div>
    </div>
    <div class="detail-section">
      <h3>投球記録</h3>
      <div class="table-wrap">
        <table class="pitch-table">
          <thead><tr><th>投手</th><th>投球数</th><th>ストライク</th><th>ボール</th><th>ファール</th></tr></thead>
          <tbody>${renderDetailPitchSummary(game.pitchRecords || [])}</tbody>
        </table>
      </div>
    </div>
    <div class="detail-section">
      <h3>メモ</h3>
      <p>${escapeHtml(game.notes || "なし")}</p>
    </div>
  `;
  gameDetailPanel.classList.remove("hidden");
  gameDetailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderDetailLineup(savedLineup) {
  const rows = (Array.isArray(savedLineup) ? savedLineup : [...(savedLineup.away || []), ...(savedLineup.home || [])]).filter(
    (spot) => spot.starter || spot.player || spot.position || spot.memo,
  );
  if (!rows.length) return `<tr class="empty-row"><td colspan="5">打順の保存はありません</td></tr>`;
  return rows
    .map((spot) => `
      <tr>
        <td>${escapeHtml(spot.order || "")}</td>
        <td>${escapeHtml(spot.starter || spot.player || "")}</td>
        <td>${escapeHtml(spot.position || "")}</td>
        <td>${escapeHtml(spot.player && spot.starter && spot.player !== spot.starter ? `代打 ${spot.player}` : "")}</td>
        <td>${escapeHtml(spot.memo || "")}</td>
      </tr>
    `)
    .join("");
}

function renderDetailRecords(records) {
  if (!records.length) return `<tr class="empty-row"><td colspan="11">打席記録はありません</td></tr>`;
  return records
    .map((record) => `
      <tr>
        <td>${escapeHtml(record.battingOrder || "")}</td>
        <td>${escapeHtml(record.batter || "")}</td>
        <td>${escapeHtml(record.position || "")}</td>
        <td>${escapeHtml(record.result || "")}</td>
        <td>${Number(record.ab || 0)}</td>
        <td>${Number(record.hit || 0)}</td>
        <td>${Number(record.k || 0)}</td>
        <td>${Number(record.bb || 0)}</td>
        <td>${Number(record.hbp || 0)}</td>
        <td>${Number(record.steal || 0)}</td>
        <td>${escapeHtml(record.memo || "")}</td>
      </tr>
    `)
    .join("");
}

function renderDetailPitchSummary(records) {
  const summary = records.reduce((rows, pitch) => {
    rows[pitch.pitcher] = rows[pitch.pitcher] || { total: 0, strike: 0, ball: 0, foul: 0 };
    rows[pitch.pitcher].total += 1;
    rows[pitch.pitcher][pitch.type] += 1;
    return rows;
  }, {});
  const rows = Object.entries(summary);
  if (!rows.length) return `<tr class="empty-row"><td colspan="5">投球記録はありません</td></tr>`;
  return rows
    .map(([pitcher, row]) => `
      <tr>
        <td>${escapeHtml(pitcher)}</td>
        <td>${row.total}</td>
        <td>${row.strike}</td>
        <td>${row.ball}</td>
        <td>${row.foul}</td>
      </tr>
    `)
    .join("");
}

function resetCurrentGame() {
  if (!confirm("現在入力中の試合スコア、打順、追加した打席記録を消して新しい試合を始めます。よろしいですか？")) {
    return;
  }
  resetCurrentGameFields();
  saveState();
}

function resetCurrentGameFields() {
  document.querySelectorAll("input, textarea").forEach((field) => {
    if (field.id === "gameDate") {
      field.valueAsDate = new Date();
      return;
    }
    field.value = "";
  });

  document.querySelector('[data-team="away"] .team-input').value = "ビジター";
  document.querySelector('[data-team="home"] .team-input').value = "ホーム";
  steals.value = "0";
  stealsOther.value = "0";
  plateRecords = [];
  pitchRecords = [];
  currentCount = emptyPitchCount();
  pitcherCounts = {};
  lineups = createEmptyLineups();
  buildLineup();
  updateTotals();
  renderRecords();
  renderPitchCounts();
}

function saveState() {
  const rows = [...scoreBody.querySelectorAll("tr")].map((row) => ({
    team: row.dataset.team,
    name: row.querySelector(".team-input").value,
    innings: [...row.querySelectorAll(".inning-score")].map((input) => input.value),
    hits: row.querySelector(".hits").value,
    errors: row.querySelector(".errors").value,
  }));

  const payload = {
    gameDate: gameDate.value,
    venue: venue.value,
    gameName: gameName.value,
    notes: notes.value,
    rows,
    lineups,
    plateRecords,
    pitchRecords,
    currentCount,
    pitcherCounts,
    gameHistory,
    battingTeam: battingTeam.value,
    battingOrder: battingOrder.value,
    activePitcher: pitcherName.value,
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return false;

  try {
    const payload = JSON.parse(raw);
    gameDate.value = payload.gameDate || "";
    venue.value = payload.venue || "";
    gameName.value = payload.gameName || "";
    notes.value = payload.notes || "";
    plateRecords = Array.isArray(payload.plateRecords) ? payload.plateRecords : [];
    pitchRecords = Array.isArray(payload.pitchRecords) ? payload.pitchRecords : [];
    pitcherCounts = normalizePitcherCounts(payload.pitcherCounts, pitchRecords);
    pitcherName.value = payload.activePitcher || "";
    if (normalizePitcherName(pitcherName.value) && !pitcherCounts[normalizePitcherName(pitcherName.value)]) {
      setCountForPitcher(pitcherName.value, payload.currentCount || emptyPitchCount());
    }
    currentCount = normalizePitcherName(pitcherName.value)
      ? countForPitcher(pitcherName.value)
      : { ...emptyPitchCount(), ...(payload.currentCount || {}) };
    lineups = normalizeLineups(payload.lineups || payload.lineup);
    gameHistory = Array.isArray(payload.gameHistory) ? payload.gameHistory : [];
    battingTeam.value = payload.battingTeam || "away";

    (payload.rows || []).forEach((savedRow) => {
      const row = document.querySelector(`[data-team="${savedRow.team}"]`);
      if (!row) return;
      row.querySelector(".team-input").value = savedRow.name || "";
      row.querySelectorAll(".inning-score").forEach((input, index) => {
        input.value = savedRow.innings?.[index] || "";
      });
      row.querySelector(".hits").value = savedRow.hits || "";
      row.querySelector(".errors").value = savedRow.errors || "";
    });
    buildBattingOrderOptions();
    battingOrder.value = payload.battingOrder || "1";
    return true;
  } catch {
    return false;
  }
}

function normalizeLineup(savedLineup) {
  return createEmptyLineup().map((spot, index) => ({
    ...spot,
    ...(savedLineup[index] || {}),
    starter: savedLineup[index]?.starter || savedLineup[index]?.player || "",
    player: savedLineup[index]?.player || savedLineup[index]?.starter || "",
    order: index + 1,
  }));
}

function normalizeLineups(saved) {
  if (Array.isArray(saved)) {
    return { away: normalizeLineup(saved), home: createEmptyLineup() };
  }
  return {
    away: normalizeLineup(saved?.away || []),
    home: normalizeLineup(saved?.home || []),
  };
}

function normalizePitcherCounts(savedCounts, records) {
  const counts = {};
  if (savedCounts && typeof savedCounts === "object") {
    Object.entries(savedCounts).forEach(([pitcher, count]) => {
      const name = normalizePitcherName(pitcher);
      if (name) counts[name] = { ...emptyPitchCount(), ...(count || {}) };
    });
  }

  records.forEach((pitch) => {
    const name = normalizePitcherName(pitch.pitcher);
    if (name && pitch.countAfter) {
      counts[name] = { ...emptyPitchCount(), ...pitch.countAfter };
    }
  });

  return counts;
}

function clearForm() {
  if (!confirm("保存済みの試合履歴以外の現在入力中データをクリアします。よろしいですか？")) {
    return;
  }
  resetCurrentGameFields();
  localStorage.removeItem(storageKey);
  saveState();
}

function fillSample() {
  const away = document.querySelector('[data-team="away"]');
  const home = document.querySelector('[data-team="home"]');
  away.querySelector(".team-input").value = "港スターズ";
  home.querySelector(".team-input").value = "東町クラブ";

  [0, 1, 0, 2, 0, 0, 1, 0, 0].forEach((score, index) => {
    away.querySelectorAll(".inning-score")[index].value = score || "";
  });
  [1, 0, 0, 0, 2, 0, 0, 0, 2].forEach((score, index) => {
    home.querySelectorAll(".inning-score")[index].value = score || "";
  });

  away.querySelector(".hits").value = "8";
  away.querySelector(".errors").value = "1";
  home.querySelector(".hits").value = "9";
  home.querySelector(".errors").value = "0";
  venue.value = "市民球場";
  gameName.value = "春季大会 1回戦";
  notes.value = "9回裏にサヨナラ。";
  lineups = {
    away: [
      { order: 1, starter: "マリナ", player: "マリナ", position: "遊", memo: "" },
      { order: 2, starter: "タイヨウ", player: "タイヨウ", position: "二", memo: "" },
      { order: 3, starter: "ハルカ", player: "ハルカ", position: "中", memo: "" },
      { order: 4, starter: "ヤマト", player: "ヤマト", position: "一", memo: "" },
      { order: 5, starter: "ジュンナ", player: "ジュンナ", position: "捕", memo: "" },
      { order: 6, starter: "ショウマ", player: "ショウマ", position: "三", memo: "" },
      { order: 7, starter: "エイタ", player: "エイタ", position: "左", memo: "" },
      { order: 8, starter: "中村ハルト", player: "中村ハルト", position: "右", memo: "" },
      { order: 9, starter: "ユリナ", player: "ユリナ", position: "投", memo: "" },
    ],
    home: [
      { order: 1, starter: "東町1番", player: "東町1番", position: "中", memo: "" },
      { order: 2, starter: "東町2番", player: "東町2番", position: "二", memo: "" },
      { order: 3, starter: "東町3番", player: "東町3番", position: "投", memo: "" },
      { order: 4, starter: "東町4番", player: "東町4番", position: "捕", memo: "" },
      { order: 5, starter: "東町5番", player: "東町5番", position: "一", memo: "" },
      { order: 6, starter: "東町6番", player: "東町6番", position: "三", memo: "" },
      { order: 7, starter: "東町7番", player: "東町7番", position: "左", memo: "" },
      { order: 8, starter: "東町8番", player: "東町8番", position: "右", memo: "" },
      { order: 9, starter: "東町9番", player: "東町9番", position: "遊", memo: "" },
    ],
  };
  buildLineup();
  plateRecords = [
    makeSampleRecord("ハルカ", "double", 0, 0, "左中間二塁打"),
    makeSampleRecord("マリナ", "walk", 1, 1, "四球から盗塁"),
    makeSampleRecord("タイヨウ", "swingK", 0, 0, ""),
    makeSampleRecord("ジュンナ", "single", 0, 0, "センター前"),
    makeSampleRecord("ヤマト", "homerun", 0, 0, "本塁打"),
  ];
  pitchRecords = [
    makePitchRecord("ユリナ", "strike"),
    makePitchRecord("ユリナ", "ball"),
    makePitchRecord("ユリナ", "foul"),
    makePitchRecord("ユリナ", "strike"),
    makePitchRecord("ユリナ", "ball"),
    makePitchRecord("タイヨウ", "strike"),
  ];
  currentCount = { balls: 2, strikes: 2, fouls: 1, total: 5 };
  pitcherName.value = "ユリナ";
  pitcherCounts = {};
  setCountForPitcher(pitcherName.value, currentCount);
  setCountForPitcher(pitchRecords.at(-1)?.pitcher, { balls: 0, strikes: 1, fouls: 0, total: 1 });
  updateTotals();
  renderRecords();
  renderPitchCounts();
  saveState();
}

function makePitchRecord(pitcher, type) {
  return {
    id: Date.now() + Math.random(),
    game: currentGameLabel(),
    gameDate: gameDate.value,
    pitcher,
    type,
  };
}

function makeSampleRecord(batter, key, steal, stealOther, memo) {
  const result = resultMap[key];
  const lineupSpot = findLineupSpot(batter);
  return {
    id: Date.now() + Math.random(),
    source: "added",
    game: currentGameLabel(),
    gameDate: gameDate.value,
    batter,
    battingOrder: lineupSpot?.order || "",
    position: lineupSpot?.position || "",
    resultKey: key,
    result: result.label,
    pa: 1,
    ab: result.ab,
    hit: result.hit,
    double: result.double,
    triple: result.triple,
    hr: result.hr,
    k: result.k,
    swingK: result.swingK,
    lookK: result.lookK,
    sac: result.sac,
    bb: result.bb,
    hbp: result.hbp,
    steal,
    stealOther,
    ob: result.ob,
    memo,
  };
}

function exportCsv() {
  const headers = [
    "試合",
    "日付",
    "チーム",
    "打順",
    "区分",
    "打者",
    "ポジション",
    "打席",
    "打数",
    "安打",
    "二塁打",
    "三塁打",
    "本塁打",
    "三振",
    "空振り三振",
    "見逃し三振",
    "犠打",
    "四球",
    "死球",
    "盗塁",
    "盗塁13塁以外",
    "出塁",
    "メモ",
  ];
  const rows = allRecords().map((record) => [
    record.game,
    record.gameDate || "",
    record.team === "home" ? "後攻" : record.team === "away" ? "先攻" : "",
    record.battingOrder || "",
    record.isPinchHitter ? "代打" : "",
    record.batter,
    record.position || "",
    record.pa,
    record.ab,
    record.hit,
    record.double,
    record.triple,
    record.hr,
    record.k,
    record.swingK,
    record.lookK,
    record.sac,
    record.bb,
    record.hbp,
    record.steal,
    record.stealOther,
    record.ob,
    record.memo,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `選手の記録_${gameDate.value || "未日付"}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

buildRows();
if (!loadState()) {
  gameDate.valueAsDate = new Date();
}
buildLineup();
updateTotals();
renderRecords();

clearButton.addEventListener("click", clearForm);
sampleButton.addEventListener("click", fillSample);
exportButton.addEventListener("click", exportCsv);
saveGameButton.addEventListener("click", saveCurrentGame);
newGameButton.addEventListener("click", resetCurrentGame);
plateForm.addEventListener("submit", addPlateRecord);
closeGameDetailButton.addEventListener("click", () => gameDetailPanel.classList.add("hidden"));
battingTeam.addEventListener("change", () => {
  battingOrder.value = "1";
  buildBattingOrderOptions();
  syncBatterFromOrder();
  saveState();
});
battingOrder.addEventListener("change", () => {
  syncBatterFromOrder();
  saveState();
});
playerName.addEventListener("input", updatePinchStatus);
pitchButtons.forEach((button) => button.addEventListener("click", addPitch));
undoPitchButton.addEventListener("click", undoPitch);
resetCountButton.addEventListener("click", resetCount);
pitcherName.addEventListener("input", syncCurrentCountFromPitcher);
sortButtons.forEach((button) => button.addEventListener("click", changeSummarySort));
[gameDate, venue, gameName, notes, pitcherName].forEach((field) => field.addEventListener("change", saveState));
