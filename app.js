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
const GOOGLE_CLIENT_ID = "834735313249-8saeorvms46cs3oldo23d5vtdke9s0jr.apps.googleusercontent.com";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const DRIVE_SYNC_FILE = "baseball-score-app-data.json";
const DRIVE_PUBLIC_VIEW_FILE = "baseball-score-public-view.json";
const DRIVE_MIME = "application/json";
const NUMERIC_BATTER_CLEANUP_GAME = "井田ふたば";
const scoreBody = document.querySelector("#scoreBody");
const resultText = document.querySelector("#resultText");
const totalRuns = document.querySelector("#totalRuns");
const clearButton = document.querySelector("#clearButton");
const sampleButton = document.querySelector("#sampleButton");
const exportButton = document.querySelector("#exportButton");
const driveSaveButton = document.querySelector("#driveSaveButton");
const driveLoadButton = document.querySelector("#driveLoadButton");
const shareViewButton = document.querySelector("#shareViewButton");
const gamePdfButton = document.querySelector("#gamePdfButton");
const rankingImageButton = document.querySelector("#rankingImageButton");
const driveStatus = document.querySelector("#driveStatus");
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
const statInclude = document.querySelector("#statInclude") || { checked: true, addEventListener() {} };
const plateSubmitButton = document.querySelector("#plateSubmitButton");
const cancelPlateEditButton = document.querySelector("#cancelPlateEditButton");
const pitcherName = document.querySelector("#pitcherName");
const pitchButtons = [...document.querySelectorAll(".pitch-button")];
const undoPitchButton = document.querySelector("#undoPitchButton");
const resetCountButton = document.querySelector("#resetCountButton");
const addOutButton = document.querySelector("#addOutButton") || { addEventListener() {} };
const undoOutButton = document.querySelector("#undoOutButton") || { addEventListener() {} };
const currentBalls = document.querySelector("#currentBalls");
const currentStrikes = document.querySelector("#currentStrikes");
const currentFouls = document.querySelector("#currentFouls");
const currentPitchTotal = document.querySelector("#currentPitchTotal");
const currentOutsDisplay = document.querySelector("#currentOuts") || { textContent: "0" };
const countStatus = document.querySelector("#countStatus");
const matchupPitcher = document.querySelector("#matchupPitcher");
const matchupBatter = document.querySelector("#matchupBatter");
const matchupStrikeRate = document.querySelector("#matchupStrikeRate");
const gamePitchTotal = document.querySelector("#gamePitchTotal");
const gameStrikeTotal = document.querySelector("#gameStrikeTotal");
const gameBallTotal = document.querySelector("#gameBallTotal");
const gameFoulTotal = document.querySelector("#gameFoulTotal");
const gameStrikeRate = document.querySelector("#gameStrikeRate");
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
let currentOuts = 0;
let pitcherCounts = {};
let lineups = createEmptyLineups();
let gameHistory = [];
let summarySort = { key: "avg", direction: "desc" };
let googleTokenClient = null;
let googleAccessToken = "";
let viewOnlyMode = false;
let editingPlateRecordId = null;
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
  updateMatchupDisplay();
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

function addTeamHit(teamKey, amount) {
  if (!amount) return;
  const hitInput = document.querySelector(`[data-team="${teamKey}"] .hits`);
  if (!hitInput) return;
  hitInput.value = String(Math.max(0, Number(hitInput.value || 0) + Number(amount || 0)));
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

function buildPlateRecordFromForm(existingRecord = {}) {
  const name = playerName.value.trim();
  if (!name) return null;

  const result = resultMap[plateResult.value];
  const lineupSpot = currentLineupSpot() || findLineupSpot(name);
  const starter = lineupSpot?.starter?.trim() || "";
  const isPinchHitter = Boolean(starter && name !== starter);
  return {
    ...existingRecord,
    id: existingRecord.id ?? Date.now(),
    source: existingRecord.source || "added",
    game: existingRecord.game || currentGameLabel(),
    gameDate: existingRecord.gameDate || gameDate.value,
    team: battingTeam.value,
    countStats: statInclude.checked,
    batter: name,
    battingOrder: lineupSpot?.order || battingOrder.value || "",
    position: lineupSpot?.position || existingRecord.position || "",
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
}

function addPlateRecord(event) {
  event.preventDefault();

  const existingIndex = plateRecords.findIndex((record) => String(record.id) === String(editingPlateRecordId));
  const existingRecord = existingIndex >= 0 ? plateRecords[existingIndex] : null;
  if (editingPlateRecordId !== null && !existingRecord) {
    alert("修正する打席が見つかりませんでした。もう一度、打席履歴から選び直してください。");
    finishPlateEdit();
    return;
  }
  const record = buildPlateRecordFromForm(existingRecord || {});
  if (!record) return;

  if (existingRecord) {
    plateRecords[existingIndex] = record;
    addTeamHit(existingRecord.team, -Number(existingRecord.hit || 0));
    addTeamHit(record.team, Number(record.hit || 0));
    finishPlateEdit();
    renderRecords();
    saveState();
    setDriveStatus("打席を更新しました");
    return;
  }

  plateRecords.unshift(record);
  addTeamHit(record.team, record.hit);
  playerName.value = "";
  moveToNextBatter(record.team, Number(record.battingOrder || battingOrder.value || 1));
  steals.value = "0";
  stealsOther.value = "0";
  plateMemo.value = "";
  renderRecords();
  saveState();
}

function resultKeyForRecord(record) {
  if (record?.resultKey && resultMap[record.resultKey]) return record.resultKey;
  const label = String(record?.result || "").replace(/^代打\s*/, "");
  return Object.entries(resultMap).find(([, value]) => value.label === label)?.[0] || "out";
}

function startPlateEdit(recordId) {
  const record = plateRecords.find((item) => String(item.id) === String(recordId));
  if (!record) {
    alert("この打席は現在入力中の試合に読み込むと修正できます。試合履歴の「編集」から開いてください。");
    return;
  }

  editingPlateRecordId = record.id;
  battingTeam.value = record.team || "away";
  buildBattingOrderOptions();
  battingOrder.value = String(record.battingOrder || "1");
  playerName.value = record.batter || "";
  plateResult.value = resultKeyForRecord(record);
  steals.value = String(Number(record.steal || 0));
  stealsOther.value = String(Number(record.stealOther || 0));
  plateMemo.value = record.memo || "";
  statInclude.checked = record.countStats !== false;
  plateForm.classList.add("editing");
  if (plateSubmitButton) plateSubmitButton.textContent = "打席を更新";
  cancelPlateEditButton?.classList.remove("hidden");
  updatePinchStatus();
  setDriveStatus("打席を修正中");
  document.querySelector("#plateSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function finishPlateEdit() {
  editingPlateRecordId = null;
  plateForm.classList.remove("editing");
  if (plateSubmitButton) plateSubmitButton.textContent = "打席を追加";
  cancelPlateEditButton?.classList.add("hidden");
  steals.value = "0";
  stealsOther.value = "0";
  plateMemo.value = "";
  statInclude.checked = true;
  syncBatterFromOrder();
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
    const batter = normalizedText(record.batter);
    if (!batter) return summary;
    summary[batter] = summary[batter] || empty();
    Object.keys(summary[batter]).forEach((key) => {
      summary[batter][key] += Number(record[key] || 0);
    });
    return summary;
  }, {});
}

function normalizedText(value) {
  return String(value ?? "").normalize("NFKC").trim();
}

function isNumericOnlyBatter(record) {
  return /^\d+$/.test(normalizedText(record?.batter));
}

function textIncludesGameTarget(value, target) {
  const needle = normalizedText(target);
  return Boolean(needle && normalizedText(value).includes(needle));
}

function recordMatchesCleanupGame(record, target) {
  return [record?.game, record?.gameName, record?.opponent].some((value) => textIncludesGameTarget(value, target));
}

function gameMatchesCleanupGame(game, target) {
  return [game?.name, game?.opponent, game?.memo, game?.notes].some((value) => textIncludesGameTarget(value, target));
}

function cleanupNumericOnlyBatters(target = NUMERIC_BATTER_CLEANUP_GAME) {
  let removed = 0;
  const currentGameMatches = [gameName.value, currentGameLabel()].some((value) => textIncludesGameTarget(value, target));

  plateRecords = plateRecords.filter((record) => {
    const shouldRemove = isNumericOnlyBatter(record) && (currentGameMatches || recordMatchesCleanupGame(record, target));
    if (shouldRemove) removed += 1;
    return !shouldRemove;
  });

  gameHistory = gameHistory.map((game) => {
    if (!gameMatchesCleanupGame(game, target) || !Array.isArray(game.records)) return game;

    const records = game.records.filter((record) => {
      const shouldRemove = isNumericOnlyBatter(record);
      if (shouldRemove) removed += 1;
      return !shouldRemove;
    });

    return records.length === game.records.length ? game : { ...game, records };
  });

  return removed;
}

function numericBatterCleanupMessage(count) {
  return `井田ふたば戦の数字のみ打者を${count}件削除しました`;
}

function savedPlateRecords() {
  return gameHistory.flatMap((game) => (Array.isArray(game.records) ? game.records : []));
}

function seasonPlateRecords() {
  const seen = new Set();
  return [...plateRecords, ...savedPlateRecords()].filter((record) => {
    const key = record.id ?? `${record.game}-${record.batter}-${record.result}-${record.memo}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function statSeasonPlateRecords() {
  return seasonPlateRecords().filter((record) => record.countStats !== false);
}

function logRecords() {
  return [...seasonPlateRecords(), ...baseRecords];
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
  const addedTotal = statSeasonPlateRecords().reduce((sum, row) => sum + Number(row.pa || 0), 0);
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

  const rowsForLog = logRecords();
  if (plateLogCount) plateLogCount.textContent = `${rowsForLog.length}件`;
  plateLogBody.innerHTML = rowsForLog.length
    ? rowsForLog
        .map((record) => `
          <tr>
            <td>${plateRecordActionCell(record)}</td>
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
            <td>${escapeHtml(record.source === "base" ? "基データ" : record.countStats === false ? `相手記録 ${record.memo || ""}` : record.memo)}</td>
          </tr>
        `)
        .join("")
    : `<tr class="empty-row"><td colspan="17">打席を追加するとここに履歴が出ます</td></tr>`;

  plateLogBody.querySelectorAll(".edit-plate-button").forEach((button) => {
    button.addEventListener("click", () => startPlateEdit(button.dataset.plateRecordId));
  });

  renderGameHistory();
  renderPitchCounts();
}

function plateRecordActionCell(record) {
  const hasId = record.id !== undefined && record.id !== null;
  const editable = hasId && record.source !== "base" && plateRecords.some((item) => String(item.id) === String(record.id));
  if (!editable) return `<span class="muted-text">-</span>`;
  return `<button class="detail-button edit-plate-button" type="button" data-plate-record-id="${escapeHtml(record.id)}">修正</button>`;
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
  return [...statSeasonPlateRecords(), ...baseRecords];
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

function addOut() {
  currentOuts = (currentOuts + 1) % 3;
  renderPitchCounts();
  saveState();
}

function undoOut() {
  currentOuts = (currentOuts + 2) % 3;
  renderPitchCounts();
  saveState();
}

function summarizePitches(records = pitchRecords) {
  return records.reduce((summary, pitch) => {
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

function strikeLikeTotal(row) {
  return Number(row.strike || 0) + Number(row.foul || 0);
}

function formatPercent(numerator, denominator) {
  if (!denominator) return "0.0%";
  return `${((Number(numerator || 0) / Number(denominator || 0)) * 100).toFixed(1)}%`;
}

function currentBatterLabel() {
  const spot = currentLineupSpot();
  const batter = playerName.value.trim() || spot?.player?.trim() || spot?.starter?.trim() || "未入力";
  const order = battingOrder.value ? `${battingOrder.value}番` : "";
  const team = teamLabel(battingTeam.value);
  return [team, order, batter].filter(Boolean).join(" ");
}

function updateMatchupDisplay() {
  const pitcher = normalizePitcherName(pitcherName.value) || fallbackPitcherName() || "未入力";
  const pitcherSummary = summarizePitches()[pitcher] || emptyPitchCount();
  if (matchupPitcher) matchupPitcher.textContent = pitcher;
  if (matchupBatter) matchupBatter.textContent = currentBatterLabel();
  if (matchupStrikeRate) matchupStrikeRate.textContent = formatPercent(strikeLikeTotal(pitcherSummary), pitcherSummary.total);
}

function renderPitchCounts() {
  const totals = pitchTotals();
  currentBalls.textContent = String(currentCount.balls);
  currentStrikes.textContent = String(currentCount.strikes);
  currentFouls.textContent = String(currentCount.fouls);
  currentPitchTotal.textContent = String(currentCount.total);
  currentOutsDisplay.textContent = String(currentOuts);
  countStatus.textContent = countStatusText();
  gamePitchTotal.textContent = String(totals.total);
  gameStrikeTotal.textContent = String(totals.strike);
  gameBallTotal.textContent = String(totals.ball);
  gameFoulTotal.textContent = String(totals.foul);
  if (gameStrikeRate) gameStrikeRate.textContent = formatPercent(strikeLikeTotal(totals), totals.total);
  updateMatchupDisplay();

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
            <td>${formatPercent(strikeLikeTotal(row), row.total)}</td>
            <td>${pitcherCountText(pitcher)}</td>
          </tr>
        `)
        .join("")
    : `<tr class="empty-row"><td colspan="7">投球を記録するとここに投手別集計が出ます</td></tr>`;
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
  const removedNumericBatters = cleanupNumericOnlyBatters();
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
    currentOuts,
    currentCount: structuredClone(currentCount),
    pitcherCounts: structuredClone(pitcherCounts),
    activePitcher: pitcherName.value,
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
  renderRecords();
  if (removedNumericBatters) {
    setDriveStatus(numericBatterCleanupMessage(removedNumericBatters));
  }
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
              <button class="detail-button edit-game-button" type="button" data-edit-game-id="${game.id}">編集</button>
            </td>
          </tr>
        `)
        .join("")
    : `<tr class="empty-row"><td colspan="7">試合保存を押すとここに履歴が残ります</td></tr>`;

  gameHistoryBody.querySelectorAll(".detail-button").forEach((button) => {
    if (button.dataset.gameId) button.addEventListener("click", () => showGameDetail(button.dataset.gameId));
  });
  gameHistoryBody.querySelectorAll(".edit-game-button").forEach((button) => {
    button.addEventListener("click", () => loadGameForEdit(button.dataset.editGameId));
  });
}

function showGameDetail(gameId) {
  const game = gameHistory.find((item) => String(item.id) === String(gameId));
  if (!game) return;

  gameDetailTitle.textContent = game.name || "試合詳細";
  gameDetailContent.innerHTML = `
    <div class="detail-actions">
      <button class="ghost-button" type="button" data-pdf-game-id="${game.id}">PDF</button>
      <button class="primary-button" type="button" data-edit-game-id="${game.id}">この試合を編集</button>
    </div>
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
          <thead><tr><th>投手</th><th>投球数</th><th>ストライク</th><th>ボール</th><th>ファール</th><th>S率</th></tr></thead>
          <tbody>${renderDetailPitchSummary(game.pitchRecords || [])}</tbody>
        </table>
      </div>
    </div>
    <div class="detail-section">
      <h3>メモ</h3>
      <p>${escapeHtml(game.notes || "なし")}</p>
    </div>
  `;
  gameDetailContent.querySelector("[data-edit-game-id]")?.addEventListener("click", () => loadGameForEdit(game.id));
  gameDetailContent.querySelector("[data-pdf-game-id]")?.addEventListener("click", () => shareSavedGamePdf(game.id));
  gameDetailPanel.classList.remove("hidden");
  gameDetailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadGameForEdit(gameId) {
  const game = gameHistory.find((item) => String(item.id) === String(gameId));
  if (!game) return;
  if (!confirm("現在入力中の内容を、この保存済み試合の内容に入れ替えて編集します。よろしいですか？")) {
    return;
  }

  gameDate.value = game.date || "";
  gameName.value = game.name || "";
  venue.value = game.venue || "";
  notes.value = game.notes || "";
  applyScoreRows(game.scoreRows || []);
  lineups = normalizeLineups(game.lineups || game.lineup);
  plateRecords = Array.isArray(game.records) ? structuredClone(game.records) : [];
  pitchRecords = Array.isArray(game.pitchRecords) ? structuredClone(game.pitchRecords) : [];
  pitcherCounts = normalizePitcherCounts(game.pitcherCounts, pitchRecords);
  pitcherName.value = game.activePitcher || pitchRecords.at(-1)?.pitcher || "";
  currentCount = normalizePitcherName(pitcherName.value)
    ? countForPitcher(pitcherName.value)
    : { ...emptyPitchCount(), ...(game.currentCount || {}) };
  currentOuts = Number(game.currentOuts || 0) % 3;
  statInclude.checked = true;
  battingTeam.value = "away";
  buildLineup();
  updateTotals();
  renderRecords();
  renderPitchCounts();
  gameDetailPanel.classList.add("hidden");
  saveState();
  document.querySelector("#scoreSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function applyScoreRows(rows) {
  rows.forEach((savedRow) => {
    const row = document.querySelector(`[data-team="${savedRow.team}"]`);
    if (!row) return;
    row.querySelector(".team-input").value = savedRow.name || "";
    row.querySelectorAll(".inning-score").forEach((input, index) => {
      input.value = savedRow.innings?.[index] || "";
    });
    row.querySelector(".hits").value = savedRow.hits || "";
    row.querySelector(".errors").value = savedRow.errors || "";
  });
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
  if (!rows.length) return `<tr class="empty-row"><td colspan="6">投球記録はありません</td></tr>`;
  return rows
    .map(([pitcher, row]) => `
      <tr>
        <td>${escapeHtml(pitcher)}</td>
        <td>${row.total}</td>
        <td>${row.strike}</td>
        <td>${row.ball}</td>
        <td>${row.foul}</td>
        <td>${formatPercent(strikeLikeTotal(row), row.total)}</td>
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
  statInclude.checked = true;
  plateRecords = [];
  pitchRecords = [];
  currentCount = emptyPitchCount();
  currentOuts = 0;
  pitcherCounts = {};
  lineups = createEmptyLineups();
  buildLineup();
  finishPlateEdit();
  updateTotals();
  renderRecords();
  renderPitchCounts();
}

function buildStatePayload() {
  const rows = [...scoreBody.querySelectorAll("tr")].map((row) => ({
    team: row.dataset.team,
    name: row.querySelector(".team-input").value,
    innings: [...row.querySelectorAll(".inning-score")].map((input) => input.value),
    hits: row.querySelector(".hits").value,
    errors: row.querySelector(".errors").value,
  }));

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    gameDate: gameDate.value,
    venue: venue.value,
    gameName: gameName.value,
    notes: notes.value,
    rows,
    lineups,
    plateRecords,
    pitchRecords,
    currentCount,
    currentOuts,
    pitcherCounts,
    gameHistory,
    battingTeam: battingTeam.value,
    battingOrder: battingOrder.value,
    statInclude: statInclude.checked,
    activePitcher: pitcherName.value,
  };
}

function saveState() {
  const payload = buildStatePayload();
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return false;

  try {
    const payload = JSON.parse(raw);
    applyStatePayload(payload);
    return true;
  } catch {
    return false;
  }
}

function applyStatePayload(payload, options = {}) {
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
  currentOuts = Number(payload.currentOuts || 0) % 3;
  lineups = normalizeLineups(payload.lineups || payload.lineup);
  gameHistory = Array.isArray(payload.gameHistory) ? payload.gameHistory : [];
  battingTeam.value = payload.battingTeam || "away";
  statInclude.checked = payload.statInclude !== false;
  const removedNumericBatters = cleanupNumericOnlyBatters();

  applyScoreRows(payload.rows || []);
  buildBattingOrderOptions();
  battingOrder.value = payload.battingOrder || "1";
  buildLineup();
  updateTotals();
  renderRecords();
  renderPitchCounts();
  renderGameHistory();
  if (removedNumericBatters) {
    setDriveStatus(numericBatterCleanupMessage(removedNumericBatters));
    if (options.persistCleanup !== false) saveState();
  }
  return removedNumericBatters;
}

async function loadSharedViewFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("view");
  if (token) {
    try {
      const payload = JSON.parse(await decodeShareToken(token));
      applyStatePayload(payload, { persistCleanup: false });
      enableViewOnlyMode();
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  const publicFileId = params.get("viewFile");
  if (publicFileId) {
    try {
      const payload = await fetchPublicViewPayload(publicFileId);
      applyStatePayload(payload, { persistCleanup: false });
      enableViewOnlyMode();
      return true;
    } catch (error) {
      console.error(error);
      alert("閲覧リンクの読み込みに失敗しました。新しいリンクを送ってもらってください。");
      return false;
    }
  }

  if (token) {
    alert("閲覧リンクの読み込みに失敗しました。新しいリンクを送ってもらってください。");
  }
  return false;
}

async function fetchPublicViewPayload(fileId) {
  const urls = [
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`,
  ];

  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Public view fetch failed ${response.status}`);
      const text = await response.text();
      return JSON.parse(text);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Public view fetch failed");
}

function enableViewOnlyMode() {
  viewOnlyMode = true;
  document.body.classList.add("view-only");
  setDriveStatus("閲覧専用モード");
  document.querySelectorAll("input, select, textarea, button").forEach((element) => {
    if (element.closest(".quick-nav")) return;
    if (element.id === "closeGameDetailButton") return;
    element.disabled = true;
  });
}

async function createViewLink() {
  try {
    saveState();
    setDriveStatus("閲覧用データ作成中...");
    await shareViewText(buildViewOnlyText(buildStatePayload()));
  } catch (error) {
    console.error(error);
    alert("閲覧用データを作成できませんでした。もう一度お試しください。");
  }
}

async function shareViewText(text) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "野球スコア閲覧用",
        text,
      });
      setDriveStatus("閲覧用データを共有しました");
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        setDriveStatus("共有をキャンセルしました");
        return;
      }
      console.warn(error);
    }
  }

  await copyText(text);
  setDriveStatus("閲覧用データをコピーしました");
  alert("閲覧用データをコピーしました。LINEなどに貼り付けて送れます。");
}

function buildViewOnlyText(payload) {
  const teamLabels = { away: "先攻", home: "後攻" };
  const lines = [];
  lines.push("【野球スコア閲覧用】");
  lines.push([payload.gameDate, payload.gameName, payload.venue].filter(Boolean).join(" / ") || "試合情報なし");
  lines.push("");

  lines.push("■ スコア");
  (payload.rows || []).forEach((row) => {
    const inningsText = (row.innings || []).map((score, index) => `${index + 1}:${score || "-"}`).join(" ");
    const runs = (row.innings || []).reduce((sum, score) => sum + Number(score || 0), 0);
    lines.push(`${row.name || teamLabels[row.team] || "チーム"}  ${inningsText}  計:${runs} H:${row.hits || "-"} E:${row.errors || "-"}`);
  });
  lines.push("");

  lines.push("■ 打順");
  ["away", "home"].forEach((team) => {
    const lineup = payload.lineups?.[team] || [];
    lines.push(`${teamLabels[team] || team}`);
    const filled = lineup.filter((spot) => spot.player || spot.starter || spot.position || spot.memo);
    if (!filled.length) {
      lines.push("  なし");
      return;
    }
    filled.forEach((spot) => {
      const name = spot.player || spot.starter || "";
      const pinch = spot.starter && spot.player && spot.starter !== spot.player ? " 代打" : "";
      lines.push(`  ${spot.order}. ${name}${pinch} ${spot.position || ""}${spot.memo ? ` (${spot.memo})` : ""}`);
    });
  });
  lines.push("");

  lines.push("■ 打席履歴");
  if ((payload.plateRecords || []).length) {
    payload.plateRecords.forEach((record) => {
      lines.push(`${teamLabels[record.team] || ""} ${record.battingOrder || "-"}番 ${record.batter || ""}: ${record.result || ""}${record.memo ? ` / ${record.memo}` : ""}`);
    });
  } else {
    lines.push("なし");
  }
  lines.push("");

  lines.push("■ 投球数");
  const pitchSummary = (payload.pitchRecords || []).reduce((summary, pitch) => {
    const pitcher = pitch.pitcher || "未入力";
    summary[pitcher] ||= { total: 0, strike: 0, ball: 0, foul: 0 };
    summary[pitcher].total += 1;
    if (pitch.type in summary[pitcher]) summary[pitcher][pitch.type] += 1;
    return summary;
  }, {});
  const pitchRows = Object.entries(pitchSummary).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0], "ja"));
  if (pitchRows.length) {
    pitchRows.forEach(([pitcher, row]) => {
      lines.push(`${pitcher}: ${row.total}球  S:${row.strike} B:${row.ball} F:${row.foul}  S率:${formatPercent(strikeLikeTotal(row), row.total)}`);
    });
  } else {
    lines.push("なし");
  }

  lines.push("");
  lines.push("■ 通算成績ランキング（上位5名）");
  appendPlayerRankingText(lines, buildPlayerRankingRows());

  if (payload.notes) {
    lines.push("");
    lines.push("■ メモ");
    lines.push(payload.notes);
  }

  return lines.join("\n");
}

function buildPlayerRankingRows() {
  return Object.entries(summarizeRecords())
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
        obDenominator,
      };
    })
    .filter((item) => item.row.pa > 0);
}

function playerRankingItems() {
  return [
    {
      label: "打率",
      value: (item) => item.avg,
      eligible: (item) => item.row.ab > 0,
      format: (item) => `${formatRate(item.row.hit, item.row.ab)} (${item.row.hit}/${item.row.ab})`,
    },
    {
      label: "出塁率",
      value: (item) => item.obp,
      eligible: (item) => item.obDenominator > 0,
      format: (item) => `${formatRate(item.row.ob, item.obDenominator)} (${item.row.ob}/${item.obDenominator})`,
    },
    {
      label: "OPS",
      value: (item) => item.ops,
      eligible: (item) => item.obDenominator > 0,
      format: (item) => item.ops.toFixed(3).replace(/^0/, ""),
    },
    { label: "打席", value: (item) => item.row.pa, format: (item) => `${item.row.pa}打席` },
    { label: "打数", value: (item) => item.row.ab, format: (item) => `${item.row.ab}打数` },
    { label: "出塁回数", value: (item) => item.row.ob, format: (item) => `${item.row.ob}回` },
    { label: "安打", value: (item) => item.row.hit, format: (item) => `${item.row.hit}本` },
    { label: "二塁打", value: (item) => item.row.double, format: (item) => `${item.row.double}本` },
    { label: "三塁打", value: (item) => item.row.triple, format: (item) => `${item.row.triple}本` },
    { label: "本塁打", value: (item) => item.row.hr, format: (item) => `${item.row.hr}本` },
    { label: "四球", value: (item) => item.row.bb, format: (item) => `${item.row.bb}個` },
    { label: "死球", value: (item) => item.row.hbp, format: (item) => `${item.row.hbp}個` },
    { label: "三振", value: (item) => item.row.k, format: (item) => `${item.row.k}個` },
    {
      label: "三振率（低い順）",
      value: (item) => item.kRate,
      direction: "asc",
      eligible: (item) => item.row.ab > 0,
      format: (item) => `${formatRate(item.row.k, item.row.ab)} (${item.row.k}/${item.row.ab})`,
    },
    { label: "盗塁", value: (item) => item.row.steal, format: (item) => `${item.row.steal}個` },
  ];
}

function appendPlayerRankingText(lines, rows) {
  const rankingItems = playerRankingItems();

  rankingItems.forEach((item, index) => {
    lines.push(`【${item.label}】`);
    const ranked = rankPlayerRows(rows, item);
    if (!ranked.length) {
      lines.push("なし");
    } else {
      ranked.forEach(({ row, rank }) => {
        lines.push(`${rank}位 ${row.name}: ${item.format(row)}`);
      });
    }
    if (index < rankingItems.length - 1) lines.push("");
  });
}

function rankPlayerRows(rows, item) {
  const eligible = item.eligible || ((row) => item.value(row) > 0);
  const direction = item.direction || "desc";
  const sorted = rows
    .filter((row) => eligible(row))
    .sort((a, b) => {
      const diff = item.value(a) - item.value(b);
      if (diff !== 0) return direction === "asc" ? diff : -diff;
      return a.name.localeCompare(b.name, "ja");
    })
    .slice(0, 5);

  let previousValue = null;
  let previousRank = 0;
  return sorted.map((row, index) => {
    const value = item.value(row);
    const rank = previousValue === value ? previousRank : index + 1;
    previousValue = value;
    previousRank = rank;
    return { row, rank };
  });
}

async function shareGamePdf() {
  try {
    saveState();
    await shareGamePdfData(currentGamePdfData(), "試合PDF");
  } catch (error) {
    console.error(error);
    alert("試合PDFを作成できませんでした。もう一度お試しください。");
  }
}

async function shareSavedGamePdf(gameId) {
  const game = gameHistory.find((item) => String(item.id) === String(gameId));
  if (!game) return;
  try {
    await shareGamePdfData(savedGamePdfData(game), "試合履歴PDF");
  } catch (error) {
    console.error(error);
    alert("試合履歴PDFを作成できませんでした。もう一度お試しください。");
  }
}

async function shareGamePdfData(data, statusLabel) {
  setDriveStatus(`${statusLabel}作成中...`);
  const canvases = buildGameResultCanvases(data);
  const blob = await canvasToPdfBlob(canvases);
  const safeDate = safeFilePart(data.date || new Date().toISOString().slice(0, 10));
  const filename = `baseball-game-${safeDate}.pdf`;
  const file = new File([blob], filename, { type: "application/pdf" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: statusLabel,
        text: "試合結果をまとめたPDFです。",
        files: [file],
      });
      setDriveStatus(`${statusLabel}を共有しました`);
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        setDriveStatus("共有をキャンセルしました");
        return;
      }
      console.warn(error);
    }
  }

  downloadBlob(blob, filename);
  setDriveStatus(`${statusLabel}を保存しました`);
  alert(`${statusLabel}を保存しました。このPDFをLINEなどで送ってください。`);
}

function currentGamePdfData() {
  return {
    date: gameDate.value,
    name: gameName.value.trim(),
    venue: venue.value.trim(),
    notes: notes.value.trim(),
    scoreRows: currentScoreSnapshot(),
    lineups,
    records: plateRecords,
    pitchRecords,
    currentOuts,
    currentCount,
    activePitcher: pitcherName.value,
  };
}

function savedGamePdfData(game) {
  return {
    date: game.date || "",
    name: game.name || "",
    venue: game.venue || "",
    notes: game.notes || "",
    score: game.score || "",
    scoreRows: scoreRowsWithRuns(game.scoreRows || []),
    lineups: normalizeLineups(game.lineups || game.lineup),
    records: Array.isArray(game.records) ? game.records : [],
    pitchRecords: Array.isArray(game.pitchRecords) ? game.pitchRecords : [],
    currentOuts: Number(game.currentOuts || 0) % 3,
    currentCount: { ...emptyPitchCount(), ...(game.currentCount || {}) },
    activePitcher: game.activePitcher || "",
  };
}

function scoreRowsWithRuns(rows) {
  return (rows.length ? rows : createEmptyScoreRows()).map((row) => {
    const innings = Array.from({ length: 9 }, (_, index) => row.innings?.[index] || "");
    const inningRuns = innings.reduce((sum, score) => sum + Number(score || 0), 0);
    const runs = row.runs === undefined || row.runs === null || row.runs === "" ? inningRuns : Number(row.runs || 0);
    return { ...row, innings, runs };
  });
}

function createEmptyScoreRows() {
  return [
    { team: "away", name: "ビジター", innings: Array(9).fill(""), runs: 0, hits: "", errors: "" },
    { team: "home", name: "ホーム", innings: Array(9).fill(""), runs: 0, hits: "", errors: "" },
  ];
}

function formatPdfDate(dateText) {
  if (!dateText) return "";
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateText;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function scoreMatchupLabel(rows) {
  const names = scoreRowsWithRuns(rows)
    .map((row) => row.name?.trim())
    .filter((name) => name && name !== "ビジター" && name !== "ホーム");
  if (names.length >= 2) return `${names[0]} 対 ${names[1]}`;
  if (names.length === 1) return `${names[0]}戦`;
  return "";
}

function gamePdfTitle(data) {
  const date = formatPdfDate(data.date);
  const opponent = data.name || scoreMatchupLabel(data.scoreRows || []);
  return [date, opponent].filter(Boolean).join(" ") || "試合結果";
}

function gamePdfSubtitle(data) {
  return [data.venue, scoreLabel(scoreRowsWithRuns(data.scoreRows || []))].filter(Boolean).join(" / ") || "試合情報なし";
}

const GAME_PDF_FIRST_PAGE_PLATE_ROWS = 18;
const GAME_PDF_EXTRA_PAGE_PLATE_ROWS = 36;

function orderedPlateRecords(savedRecords) {
  return [...(savedRecords || [])].reverse();
}

function buildGameResultCanvases(data = currentGamePdfData()) {
  const records = orderedPlateRecords(data.records || []);
  const firstPageRecords = records.slice(0, GAME_PDF_FIRST_PAGE_PLATE_ROWS);
  const remainingRecords = records.slice(GAME_PDF_FIRST_PAGE_PLATE_ROWS);
  const detailChunks = chunkItems(remainingRecords, GAME_PDF_EXTRA_PAGE_PLATE_ROWS);
  const canvases = [
    buildGameResultCanvas(data, {
      plateRecords: firstPageRecords,
      plateOverflowCount: remainingRecords.length,
    }),
  ];

  detailChunks.forEach((chunk, index) => {
    canvases.push(buildGamePlateRecordsCanvas(data, chunk, index + 1, detailChunks.length, GAME_PDF_FIRST_PAGE_PLATE_ROWS + index * GAME_PDF_EXTRA_PAGE_PLATE_ROWS + 1));
  });

  return canvases;
}

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function buildGameResultCanvas(data = currentGamePdfData(), options = {}) {
  const width = 1240;
  const height = 1754;
  const margin = 36;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const contentWidth = width - margin * 2;
  const scoreRows = scoreRowsWithRuns(data.scoreRows || []);
  const pitches = pitchTotals(data.pitchRecords || []);
  const scoreText = data.score || scoreLabel(scoreRows) || "スコア未入力";

  ctx.fillStyle = "#f6f4ef";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, margin / 2, margin / 2, width - margin, height - margin, 18);
  ctx.fill();

  ctx.fillStyle = "#0c4e3a";
  ctx.font = '700 42px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, gamePdfTitle(data), margin, margin + 44, contentWidth, 46, 1);
  ctx.fillStyle = "#667076";
  ctx.font = '700 22px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, gamePdfSubtitle(data), margin, margin + 78, contentWidth, 26, 1);

  drawScoreboardPdf(ctx, scoreRows, margin, 140, contentWidth);
  drawGameInfoBoxes(ctx, scoreText, pitches.total, (data.records || []).length, data.currentOuts || 0, margin, 298, contentWidth);
  drawLineupPdf(ctx, data.lineups || createEmptyLineups(), margin, 398, contentWidth, 320);
  drawPlateRecordsPdf(ctx, options.plateRecords || orderedPlateRecords(data.records || []), margin, 748, 738, 760, {
    preordered: true,
    startNumber: 1,
    maxRows: GAME_PDF_FIRST_PAGE_PLATE_ROWS,
    overflowCount: Number(options.plateOverflowCount || 0),
  });
  drawPitchSummaryPdf(ctx, data.pitchRecords || [], margin + 762, 748, contentWidth - 762, 282);
  drawNotesPdf(ctx, data.notes || "", margin + 762, 1058, contentWidth - 762, 230);
  drawCurrentCountPdf(ctx, data.activePitcher || "", data.currentCount || emptyPitchCount(), data.currentOuts || 0, margin + 762, 1316, contentWidth - 762, 192);

  ctx.fillStyle = "#667076";
  ctx.font = '700 19px "Yu Gothic", "Segoe UI", sans-serif';
  ctx.fillText("※打席が多い場合は次ページ以降に続きます。", margin, height - margin - 8);
  return canvas;
}

function buildGamePlateRecordsCanvas(data, records, pageIndex, totalPages, startNumber) {
  const width = 1240;
  const height = 1754;
  const margin = 36;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const contentWidth = width - margin * 2;

  ctx.fillStyle = "#f6f4ef";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, margin / 2, margin / 2, width - margin, height - margin, 18);
  ctx.fill();

  ctx.fillStyle = "#0c4e3a";
  ctx.font = '700 42px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, `${gamePdfTitle(data)} 打席結果`, margin, margin + 44, contentWidth, 46, 1);
  ctx.fillStyle = "#667076";
  ctx.font = '700 22px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, `${gamePdfSubtitle(data)} / 打席一覧 ${pageIndex}/${totalPages}`, margin, margin + 78, contentWidth, 26, 1);

  drawPlateRecordsFullPagePdf(ctx, records, margin, 136, contentWidth, 1510, startNumber);

  ctx.fillStyle = "#667076";
  ctx.font = '700 19px "Yu Gothic", "Segoe UI", sans-serif';
  ctx.fillText(`打席結果 ${startNumber}件目から表示`, margin, height - margin - 8);
  return canvas;
}

function drawScoreboardPdf(ctx, rows, x, y, width) {
  const teamWidth = 226;
  const statWidth = 70;
  const inningWidth = (width - teamWidth - statWidth * 3) / 9;
  const headerHeight = 42;
  const rowHeight = 48;
  const headers = ["チーム", "1", "2", "3", "4", "5", "6", "7", "8", "9", "R", "H", "E"];
  const widths = [teamWidth, ...Array(9).fill(inningWidth), statWidth, statWidth, statWidth];
  let left = x;
  headers.forEach((header, index) => {
    drawPdfCell(ctx, header, left, y, widths[index], headerHeight, { header: true, align: "center" });
    left += widths[index];
  });
  rows.forEach((row, rowIndex) => {
    const values = [row.name || teamLabel(row.team) || "チーム", ...(row.innings || []).slice(0, 9), row.runs, row.hits || "-", row.errors || "-"];
    let cellX = x;
    values.forEach((value, index) => {
      drawPdfCell(ctx, value, cellX, y + headerHeight + rowHeight * rowIndex, widths[index], rowHeight, {
        fill: rowIndex % 2 === 0 ? "#ffffff" : "#f9faf8",
        align: index === 0 ? "left" : "center",
        strong: index === 10,
      });
      cellX += widths[index];
    });
  });
}

function drawGameInfoBoxes(ctx, scoreText, pitchTotal, plateTotal, outs, x, y, width) {
  const gap = 12;
  const boxWidth = (width - gap * 3) / 4;
  const items = [
    ["スコア", scoreText],
    ["打席数", `${plateTotal}件`],
    ["投球数", `${pitchTotal}球`],
    ["アウト", `${outs}アウト`],
  ];
  items.forEach(([label, value], index) => {
    const boxX = x + (boxWidth + gap) * index;
    ctx.fillStyle = "#eef5f1";
    roundRect(ctx, boxX, y, boxWidth, 72, 10);
    ctx.fill();
    ctx.strokeStyle = "#d9ded9";
    ctx.strokeRect(boxX, y, boxWidth, 72);
    ctx.fillStyle = "#667076";
    ctx.font = '700 18px "Yu Gothic", "Segoe UI", sans-serif';
    ctx.fillText(label, boxX + 14, y + 24);
    ctx.fillStyle = "#0c4e3a";
    ctx.font = '700 25px "Yu Gothic", "Segoe UI", sans-serif';
    drawWrappedText(ctx, value, boxX + 14, y + 56, boxWidth - 28, 25, 1);
  });
}

function drawLineupPdf(ctx, savedLineups, x, y, width, height) {
  const gap = 16;
  const columnWidth = (width - gap) / 2;
  drawLineupTeamPdf(ctx, "先攻", savedLineups.away || [], x, y, columnWidth, height);
  drawLineupTeamPdf(ctx, "後攻", savedLineups.home || [], x + columnWidth + gap, y, columnWidth, height);
}

function drawLineupTeamPdf(ctx, title, lineup, x, y, width, height) {
  drawPdfPanel(ctx, title, x, y, width, height);
  const rowHeight = 28;
  const top = y + 48;
  const visible = lineup.slice(0, 9);
  visible.forEach((spot, index) => {
    const rowY = top + rowHeight * index;
    const name = spot.player || spot.starter || "-";
    const pinch = spot.starter && spot.player && spot.starter !== spot.player ? " 代打" : "";
    const text = `${spot.order}. ${name}${pinch}  ${spot.position || ""}`;
    drawPdfTextLine(ctx, text, x + 16, rowY + 20, width - 32, 20, index % 2 === 0 ? "#ffffff" : "#f9faf8");
  });
}

function drawPlateRecordsPdf(ctx, savedRecords, x, y, width, height, options = {}) {
  drawPdfPanel(ctx, "打席結果", x, y, width, height);
  const records = options.preordered ? [...savedRecords] : orderedPlateRecords(savedRecords);
  const rowHeight = 34;
  const headerY = y + 46;
  const columns = [58, 70, 150, 180, width - 58 - 70 - 150 - 180 - 28];
  const headers = ["No", "打順", "打者", "結果", "メモ"];
  let left = x + 14;
  headers.forEach((header, index) => {
    drawPdfCell(ctx, header, left, headerY, columns[index], 30, { header: true, align: "center", fontSize: 17 });
    left += columns[index];
  });
  const maxRows = Math.min(records.length, options.maxRows || 18);
  const startNumber = Number(options.startNumber || 1);
  if (!records.length) drawEmptyPdfText(ctx, "打席記録はありません", x + 18, headerY + 66, width - 36);
  records.slice(0, maxRows).forEach((record, index) => {
    const values = [startNumber + index, record.battingOrder || "-", record.batter || "", record.result || "", record.memo || ""];
    let cellX = x + 14;
    values.forEach((value, columnIndex) => {
      drawPdfCell(ctx, value, cellX, headerY + 30 + rowHeight * index, columns[columnIndex], rowHeight, {
        fill: index % 2 === 0 ? "#ffffff" : "#f9faf8",
        align: columnIndex < 2 ? "center" : "left",
        fontSize: 16,
      });
      cellX += columns[columnIndex];
    });
  });
  const overflowCount = Number(options.overflowCount ?? records.length - maxRows);
  if (overflowCount > 0) {
    ctx.fillStyle = "#667076";
    ctx.font = '700 17px "Yu Gothic", "Segoe UI", sans-serif';
    ctx.fillText(`続きは次ページ（ほか${overflowCount}件）`, x + 18, y + height - 18);
  }
}

function drawPlateRecordsFullPagePdf(ctx, records, x, y, width, height, startNumber) {
  drawPdfPanel(ctx, "打席結果（全件）", x, y, width, height);
  const rowHeight = 38;
  const headerY = y + 54;
  const columns = [66, 86, 76, 176, 214, 76, width - 66 - 86 - 76 - 176 - 214 - 76 - 28];
  const headers = ["No", "チーム", "打順", "打者", "結果", "盗塁", "メモ"];
  let left = x + 14;
  headers.forEach((header, index) => {
    drawPdfCell(ctx, header, left, headerY, columns[index], 32, { header: true, align: "center", fontSize: 18 });
    left += columns[index];
  });

  if (!records.length) {
    drawEmptyPdfText(ctx, "打席記録はありません", x + 18, headerY + 72, width - 36);
    return;
  }

  records.forEach((record, index) => {
    const values = [
      startNumber + index,
      teamLabel(record.team || "") || "-",
      record.battingOrder || "-",
      record.batter || "",
      record.result || "",
      Number(record.steal || 0) || "-",
      record.memo || "",
    ];
    let cellX = x + 14;
    values.forEach((value, columnIndex) => {
      drawPdfCell(ctx, value, cellX, headerY + 32 + rowHeight * index, columns[columnIndex], rowHeight, {
        fill: index % 2 === 0 ? "#ffffff" : "#f9faf8",
        align: columnIndex < 3 || columnIndex === 5 ? "center" : "left",
        fontSize: 17,
      });
      cellX += columns[columnIndex];
    });
  });
}

function drawPitchSummaryPdf(ctx, savedPitchRecords, x, y, width, height) {
  drawPdfPanel(ctx, "投球数", x, y, width, height);
  const rows = Object.entries(summarizePitches(savedPitchRecords)).sort((a, b) => b[1].total - a[1].total || a[0].localeCompare(b[0], "ja"));
  const rowHeight = 34;
  const top = y + 52;
  const headers = ["投手", "球", "S", "B", "F", "S率"];
  const columns = [width - 304, 50, 48, 48, 48, 82];
  let left = x + 14;
  headers.forEach((header, index) => {
    drawPdfCell(ctx, header, left, top, columns[index], 30, { header: true, align: "center", fontSize: 16 });
    left += columns[index];
  });
  rows.slice(0, 5).forEach(([pitcher, row], index) => {
    const values = [pitcher, row.total, row.strike, row.ball, row.foul, formatPercent(strikeLikeTotal(row), row.total)];
    let cellX = x + 14;
    values.forEach((value, columnIndex) => {
      drawPdfCell(ctx, value, cellX, top + 30 + rowHeight * index, columns[columnIndex], rowHeight, {
        fill: index % 2 === 0 ? "#ffffff" : "#f9faf8",
        align: columnIndex === 0 ? "left" : "center",
        fontSize: 15,
      });
      cellX += columns[columnIndex];
    });
  });
  if (!rows.length) drawEmptyPdfText(ctx, "投球記録はありません", x + 18, top + 62, width - 36);
}

function drawNotesPdf(ctx, savedNotes, x, y, width, height) {
  drawPdfPanel(ctx, "メモ", x, y, width, height);
  const text = savedNotes || "メモはありません。";
  ctx.fillStyle = "#1e2528";
  ctx.font = '600 18px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, text, x + 18, y + 58, width - 36, 26, 6);
}

function drawCurrentCountPdf(ctx, activePitcher, count, outs, x, y, width, height) {
  drawPdfPanel(ctx, "現在のカウント", x, y, width, height);
  const pitcher = normalizePitcherName(activePitcher) || "未入力";
  const rows = [
    `投手: ${pitcher}`,
    `B ${count.balls || 0} / S ${count.strikes || 0} / F ${count.fouls || 0}`,
    `累計 ${count.total || 0}球 / ${outs}アウト`,
  ];
  ctx.fillStyle = "#1e2528";
  ctx.font = '700 20px "Yu Gothic", "Segoe UI", sans-serif';
  rows.forEach((row, index) => ctx.fillText(row, x + 18, y + 62 + index * 34));
}

function drawPdfPanel(ctx, title, x, y, width, height) {
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x, y, width, height, 10);
  ctx.fill();
  ctx.strokeStyle = "#d9ded9";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = "#0c4e3a";
  ctx.font = '700 24px "Yu Gothic", "Segoe UI", sans-serif';
  ctx.fillText(title, x + 16, y + 32);
  ctx.strokeStyle = "#d9ded9";
  ctx.beginPath();
  ctx.moveTo(x, y + 42);
  ctx.lineTo(x + width, y + 42);
  ctx.stroke();
}

function drawPdfCell(ctx, text, x, y, width, height, options = {}) {
  ctx.fillStyle = options.header ? "#166b4f" : options.fill || "#ffffff";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#d9ded9";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = options.header ? "#ffffff" : "#1e2528";
  ctx.font = `${options.strong || options.header ? "700" : "600"} ${options.fontSize || 18}px "Yu Gothic", "Segoe UI", sans-serif`;
  const value = String(text ?? "");
  if (options.align === "center") {
    ctx.textAlign = "center";
    ctx.fillText(value || "-", x + width / 2, y + height / 2 + (options.fontSize || 18) / 3);
    ctx.textAlign = "left";
    return;
  }
  drawWrappedText(ctx, value || "-", x + 8, y + Math.min(height - 8, 23), width - 16, options.fontSize || 18, 1);
}

function drawPdfTextLine(ctx, text, x, y, width, lineHeight, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x - 8, y - lineHeight + 4, width + 16, lineHeight + 8);
  ctx.fillStyle = "#1e2528";
  ctx.font = '700 17px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, text, x, y, width, lineHeight, 1);
}

function drawEmptyPdfText(ctx, text, x, y, width) {
  ctx.fillStyle = "#667076";
  ctx.font = '700 18px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, text, x, y, width, 24, 2);
}

async function shareRankingImage() {
  try {
    saveState();
    setDriveStatus("ランキングPDF作成中...");
    const canvas = buildRankingImageCanvas();
    const blob = await canvasToPdfBlob(canvas);
    const safeDate = gameDate.value || new Date().toISOString().slice(0, 10);
    const filename = `baseball-ranking-${safeDate}.pdf`;
    const file = new File([blob], filename, { type: "application/pdf" });

    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "通算成績ランキングPDF",
          text: "通算成績ランキング表です。",
          files: [file],
        });
        setDriveStatus("ランキングPDFを共有しました");
        return;
      } catch (error) {
        if (error?.name === "AbortError") {
          setDriveStatus("共有をキャンセルしました");
          return;
        }
        console.warn(error);
      }
    }

    downloadBlob(blob, filename);
    setDriveStatus("ランキングPDFを保存しました");
    alert("ランキングPDFを保存しました。このPDFをLINEなどで送ってください。");
  } catch (error) {
    console.error(error);
    alert("ランキングPDFを作成できませんでした。もう一度お試しください。");
  }
}

function buildRankingImageCanvas() {
  const rows = buildRankingTableRows();
  const width = 1240;
  const height = 1754;
  const margin = 36;
  const titleHeight = 96;
  const headerHeight = 52;
  const footerHeight = 38;
  const rowHeight = (height - margin - titleHeight - headerHeight - footerHeight - margin) / rows.length;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const contentWidth = width - margin * 2;
  const itemWidth = 210;
  const rankWidth = (contentWidth - itemWidth) / 5;
  const tableTop = margin + titleHeight;

  ctx.fillStyle = "#f6f4ef";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, margin / 2, margin / 2, width - margin, height - margin, 18);
  ctx.fill();

  ctx.fillStyle = "#0c4e3a";
  ctx.font = '700 44px "Yu Gothic", "Segoe UI", sans-serif';
  ctx.fillText("通算成績", margin, margin + 44);
  ctx.fillStyle = "#667076";
  ctx.font = '700 22px "Yu Gothic", "Segoe UI", sans-serif';
  const subtitle = `ランキング表 / ${formatPdfDate(new Date().toISOString().slice(0, 10))}作成`;
  drawWrappedText(ctx, subtitle, margin, margin + 78, contentWidth, 26, 1);

  drawTableCell(ctx, "項目", margin, tableTop, itemWidth, headerHeight, { header: true });
  for (let rank = 1; rank <= 5; rank += 1) {
    drawTableCell(ctx, `${rank}位`, margin + itemWidth + rankWidth * (rank - 1), tableTop, rankWidth, headerHeight, { header: true });
  }

  rows.forEach((row, rowIndex) => {
    const y = tableTop + headerHeight + rowHeight * rowIndex;
    const fill = rowIndex % 2 === 0 ? "#ffffff" : "#f9faf8";
    drawTableCell(ctx, row.label, margin, y, itemWidth, rowHeight, { fill, strong: true });
    for (let index = 0; index < 5; index += 1) {
      drawRankingEntryCell(ctx, row.entries[index], margin + itemWidth + rankWidth * index, y, rankWidth, rowHeight, fill);
    }
  });

  ctx.fillStyle = "#667076";
  ctx.font = '700 19px "Yu Gothic", "Segoe UI", sans-serif';
  ctx.fillText("※同じ成績は同順位。各項目上位5名まで表示。", margin, height - margin - 8);
  return canvas;
}

function buildRankingTableRows() {
  const rows = buildPlayerRankingRows();
  return playerRankingItems().map((item) => ({
    label: item.label,
    entries: rankPlayerRows(rows, item).map(({ row, rank }) => ({
      rank,
      name: row.name,
      value: item.format(row),
    })),
  }));
}

function drawTableCell(ctx, text, x, y, width, height, options = {}) {
  ctx.fillStyle = options.header ? "#166b4f" : options.fill || "#ffffff";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#d9ded9";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = options.header ? "#ffffff" : "#1e2528";
  ctx.font = `${options.strong || options.header ? "700" : "600"} ${options.header ? 24 : 23}px "Yu Gothic", "Segoe UI", sans-serif`;
  drawWrappedText(ctx, text || "-", x + 14, y + 32, width - 28, 27, 2);
}

function drawRankingEntryCell(ctx, entry, x, y, width, height, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#d9ded9";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  if (!entry) {
    ctx.fillStyle = "#9aa3a7";
    ctx.font = '600 22px "Yu Gothic", "Segoe UI", sans-serif';
    ctx.fillText("-", x + 16, y + 54);
    return;
  }
  ctx.fillStyle = "#1e2528";
  ctx.font = '700 22px "Yu Gothic", "Segoe UI", sans-serif';
  drawWrappedText(ctx, `${entry.rank}位 ${entry.name}`, x + 14, y + 30, width - 28, 24, 2);
  ctx.fillStyle = "#0c4e3a";
  ctx.font = '700 21px "Yu Gothic", "Segoe UI", sans-serif';
  ctx.fillText(entry.value, x + 14, y + 78);
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const wrapped = wrapCanvasText(ctx, text, maxWidth);
  const lines = wrapped.slice(0, maxLines);
  lines.forEach((line, index) => {
    const suffix = index === maxLines - 1 && wrapped.length > maxLines ? "..." : "";
    ctx.fillText(`${line}${suffix}`, x, y + lineHeight * index);
  });
}

function wrapCanvasText(ctx, text, maxWidth) {
  const chars = [...String(text || "")];
  const lines = [];
  let line = "";
  chars.forEach((char) => {
    const test = `${line}${char}`;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))), "image/png");
  });
}

function canvasToPdfBlob(canvasOrCanvases) {
  const canvases = Array.isArray(canvasOrCanvases) ? canvasOrCanvases : [canvasOrCanvases];
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const pageMargin = 18;
  const chunks = [];
  const offsets = [0];
  let offset = 0;
  const encoder = new TextEncoder();
  const add = (chunk) => {
    const bytes = typeof chunk === "string" ? encoder.encode(chunk) : chunk;
    chunks.push(bytes);
    offset += bytes.length;
  };
  const addObject = (parts) => {
    offsets.push(offset);
    parts.forEach(add);
  };

  add("%PDF-1.4\n");
  addObject(["1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"]);
  const pageIds = canvases.map((_, index) => 3 + index * 3);
  addObject([`2 0 obj\n<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${canvases.length} >>\nendobj\n`]);

  canvases.forEach((canvas, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const imageName = `Im${index}`;
    const imageBytes = base64ToBytes(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
    const imageRatio = canvas.width / canvas.height;
    const maxWidth = pageWidth - pageMargin * 2;
    const maxHeight = pageHeight - pageMargin * 2;
    let drawWidth = maxWidth;
    let drawHeight = drawWidth / imageRatio;
    if (drawHeight > maxHeight) {
      drawHeight = maxHeight;
      drawWidth = drawHeight * imageRatio;
    }
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;
    const contents = `q\n${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/${imageName} Do\nQ\n`;

    addObject([
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`,
    ]);
    addObject([
      `${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,
      imageBytes,
      "\nendstream\nendobj\n",
    ]);
    addObject([`${contentId} 0 obj\n<< /Length ${encoder.encode(contents).length} >>\nstream\n${contents}endstream\nendobj\n`]);
  });

  const xrefOffset = offset;
  add(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((value) => add(`${String(value).padStart(10, "0")} 00000 n \n`));
  add(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(concatBytes(chunks), { type: "application/pdf" });
}

function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function concatBytes(chunks) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const bytes = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.length;
  });
  return [bytes];
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeFilePart(value) {
  return String(value || "未日付").replace(/[\\/:*?"<>|]/g, "-");
}

async function shareViewFile(html, filename) {
  const file = new File([html], filename, { type: "text/html" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: "野球スコア閲覧用ファイル",
        text: "野球スコアの閲覧専用ファイルです。",
        files: [file],
      });
      setDriveStatus("閲覧用ファイルを共有しました");
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        setDriveStatus("共有をキャンセルしました");
        return;
      }
      console.warn(error);
    }
  }

  downloadTextFile(html, filename, "text/html");
  setDriveStatus("閲覧用ファイルを保存しました");
  alert("閲覧用HTMLファイルを保存しました。このファイルをLINEやメールで送ってください。");
}

function downloadTextFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildViewOnlyHtml(payloadText) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>野球スコア閲覧</title>
  <style>
    :root { color-scheme: light; --green: #166b4f; --line: #d9ded9; --bg: #f6f4ef; --ink: #1e2528; --muted: #667076; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", system-ui, "Hiragino Sans", "Yu Gothic", sans-serif; background: var(--bg); color: var(--ink); }
    main { width: min(980px, calc(100% - 24px)); margin: 18px auto; background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 18px; }
    h1 { margin: 0 0 4px; font-size: 1.7rem; }
    h2 { margin: 24px 0 10px; font-size: 1.12rem; color: var(--green); }
    .meta { color: var(--muted); font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.95rem; }
    th, td { border-bottom: 1px solid var(--line); padding: 9px 7px; text-align: left; vertical-align: top; }
    th { background: #eef5f1; color: #0c4e3a; }
    .scroll { overflow-x: auto; }
    .empty { color: var(--muted); padding: 10px 0; }
    @media (max-width: 640px) { main { width: 100%; min-height: 100vh; margin: 0; border: 0; border-radius: 0; } table { font-size: 0.86rem; } }
  </style>
</head>
<body>
  <main>
    <h1>野球スコア閲覧</h1>
    <div id="meta" class="meta"></div>
    <section><h2>スコア</h2><div class="scroll"><table id="scoreTable"></table></div></section>
    <section><h2>打順</h2><div class="scroll"><table id="lineupTable"></table></div></section>
    <section><h2>打席履歴</h2><div class="scroll"><table id="plateTable"></table></div></section>
    <section><h2>投球数</h2><div class="scroll"><table id="pitchTable"></table></div></section>
    <section><h2>メモ</h2><div id="notes" class="empty"></div></section>
  </main>
  <script type="application/json" id="payload">${escapeJsonForScript(payloadText)}</script>
  <script>
    const payload = JSON.parse(document.getElementById("payload").textContent);
    const teamLabels = { away: "先攻", home: "後攻" };
    const pitchLabels = { strike: "ストライク", ball: "ボール", foul: "ファール" };
    const esc = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    const td = (value) => "<td>" + esc(value) + "</td>";
    document.getElementById("meta").textContent = [payload.gameDate, payload.gameName, payload.venue].filter(Boolean).join(" / ") || "閲覧専用";
    document.getElementById("notes").textContent = payload.notes || "メモはありません。";

    const scoreHeaders = ["チーム", "1", "2", "3", "4", "5", "6", "7", "8", "9", "H", "E"];
    document.getElementById("scoreTable").innerHTML = "<thead><tr>" + scoreHeaders.map((item) => "<th>" + item + "</th>").join("") + "</tr></thead><tbody>" +
      (payload.rows || []).map((row) => "<tr>" + td(row.name || teamLabels[row.team] || "") + (row.innings || []).map(td).join("") + td(row.hits) + td(row.errors) + "</tr>").join("") + "</tbody>";

    const lineupRows = ["away", "home"].flatMap((team) => (payload.lineups?.[team] || []).map((spot) => ({ team, ...spot })));
    document.getElementById("lineupTable").innerHTML = "<thead><tr><th>チーム</th><th>打順</th><th>選手</th><th>守備</th><th>メモ</th></tr></thead><tbody>" +
      (lineupRows.length ? lineupRows.map((spot) => "<tr>" + td(teamLabels[spot.team]) + td(spot.order) + td(spot.player || spot.starter) + td(spot.position) + td(spot.memo) + "</tr>").join("") : "<tr><td colspan='5'>打順はありません。</td></tr>") + "</tbody>";

    document.getElementById("plateTable").innerHTML = "<thead><tr><th>日付</th><th>チーム</th><th>打順</th><th>選手</th><th>結果</th><th>メモ</th></tr></thead><tbody>" +
      ((payload.plateRecords || []).length ? payload.plateRecords.map((record) => "<tr>" + td(record.gameDate) + td(teamLabels[record.team]) + td(record.battingOrder) + td(record.batter) + td(record.result) + td(record.memo) + "</tr>").join("") : "<tr><td colspan='6'>打席履歴はありません。</td></tr>") + "</tbody>";

    const pitchSummary = (payload.pitchRecords || []).reduce((summary, pitch) => {
      summary[pitch.pitcher] ||= { total: 0, strike: 0, ball: 0, foul: 0 };
      summary[pitch.pitcher].total += 1;
      summary[pitch.pitcher][pitch.type] += 1;
      return summary;
    }, {});
    const pitchRows = Object.entries(pitchSummary).sort((a, b) => b[1].total - a[1].total);
    const rate = (row) => row.total ? (((Number(row.strike || 0) + Number(row.foul || 0)) / Number(row.total || 0)) * 100).toFixed(1) + "%" : "0.0%";
    document.getElementById("pitchTable").innerHTML = "<thead><tr><th>投手</th><th>合計</th><th>ストライク</th><th>ボール</th><th>ファール</th><th>S率</th></tr></thead><tbody>" +
      (pitchRows.length ? pitchRows.map(([name, row]) => "<tr>" + td(name) + td(row.total) + td(row.strike) + td(row.ball) + td(row.foul) + td(rate(row)) + "</tr>").join("") : "<tr><td colspan='6'>投球記録はありません。</td></tr>") + "</tbody>";
  </script>
</body>
</html>`;
}

function escapeJsonForScript(text) {
  return text.replaceAll("<", "\\u003c");
}

async function shareViewUrl(url) {
  const shareData = {
    title: "野球スコア閲覧リンク",
    text: "野球スコアの閲覧専用リンクです。",
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      setDriveStatus("閲覧リンクを共有しました");
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        setDriveStatus("共有をキャンセルしました");
        return;
      }
      console.warn(error);
    }
  }

  await copyText(url);
  setDriveStatus("閲覧リンクをコピーしました");
  alert("閲覧専用リンクをコピーしました。LINEなどに貼り付けて送れます。");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  document.body.append(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}

async function encodeShareToken(text) {
  const bytes = new TextEncoder().encode(text);
  if ("CompressionStream" in window) {
    const compressed = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer();
    return `gz.${base64UrlEncode(new Uint8Array(compressed))}`;
  }
  return `b64.${base64UrlEncode(bytes)}`;
}

async function decodeShareToken(token) {
  if (token.startsWith("gz.")) {
    const bytes = base64UrlDecode(token.slice(3));
    const text = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
    return text;
  }
  if (token.startsWith("b64.")) {
    return new TextDecoder().decode(base64UrlDecode(token.slice(4)));
  }
  throw new Error("Unknown share token");
}

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
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

function setDriveStatus(message) {
  if (driveStatus) driveStatus.textContent = message;
}

function assertDriveConfigured() {
  if (!GOOGLE_CLIENT_ID) {
    setDriveStatus("Google Drive設定が必要です");
    alert("Google Drive同期にはGoogle CloudのOAuthクライアントID設定が必要です。");
    return false;
  }
  if (!window.google?.accounts?.oauth2) {
    setDriveStatus("Google認証ライブラリ読込中");
    alert("Google認証の読み込み中です。少し待ってからもう一度押してください。");
    return false;
  }
  return true;
}

function requestGoogleAccessToken() {
  if (!assertDriveConfigured()) return Promise.reject(new Error("Google Drive is not configured"));
  return new Promise((resolve, reject) => {
    googleTokenClient =
      googleTokenClient ||
      google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: DRIVE_SCOPE,
        callback: (response) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }
          googleAccessToken = response.access_token;
          setDriveStatus("Google Drive接続中");
          resolve(googleAccessToken);
        },
      });
    googleTokenClient.requestAccessToken({ prompt: googleAccessToken ? "" : "consent" });
  });
}

async function driveRequest(url, options = {}) {
  const token = googleAccessToken || (await requestGoogleAccessToken());
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Google Drive error ${response.status}`);
  }
  return response;
}

async function findDriveSyncFile() {
  const query = encodeURIComponent(`name='${DRIVE_SYNC_FILE}' and trashed=false`);
  const response = await driveRequest(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,modifiedTime)&pageSize=1`,
  );
  const data = await response.json();
  return data.files?.[0] || null;
}

async function findDriveFileByName(name) {
  const query = encodeURIComponent(`name='${name}' and trashed=false`);
  const response = await driveRequest(
    `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive&fields=files(id,name,modifiedTime)&pageSize=1`,
  );
  const data = await response.json();
  return data.files?.[0] || null;
}

function multipartBody(metadata, content) {
  const boundary = "baseball_score_boundary";
  return {
    boundary,
    body: [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      `Content-Type: ${DRIVE_MIME}`,
      "",
      content,
      `--${boundary}--`,
    ].join("\r\n"),
  };
}

async function saveToDrive() {
  try {
    setDriveStatus("Drive保存中...");
    await requestGoogleAccessToken();
    saveState();
    const content = JSON.stringify(buildStatePayload(), null, 2);
    const existing = await findDriveSyncFile();
    if (existing) {
      await driveRequest(`https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media&fields=id,modifiedTime`, {
        method: "PATCH",
        headers: { "Content-Type": DRIVE_MIME },
        body: content,
      });
    } else {
      const multipart = multipartBody({ name: DRIVE_SYNC_FILE, mimeType: DRIVE_MIME }, content);
      await driveRequest("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,modifiedTime", {
        method: "POST",
        headers: { "Content-Type": `multipart/related; boundary=${multipart.boundary}` },
        body: multipart.body,
      });
    }
    setDriveStatus(`Drive保存済み ${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`);
  } catch (error) {
    console.error(error);
    setDriveStatus("Drive保存失敗");
    alert("Google Driveへの保存に失敗しました。設定またはログインを確認してください。");
  }
}

async function savePublicViewFile(content) {
  const existing = await findDriveFileByName(DRIVE_PUBLIC_VIEW_FILE);
  if (existing) {
    const response = await driveRequest(
      `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=media&fields=id,webContentLink`,
      {
        method: "PATCH",
        headers: { "Content-Type": DRIVE_MIME },
        body: content,
      },
    );
    return response.json();
  }

  const multipart = multipartBody({ name: DRIVE_PUBLIC_VIEW_FILE, mimeType: DRIVE_MIME }, content);
  const response = await driveRequest("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webContentLink", {
    method: "POST",
    headers: { "Content-Type": `multipart/related; boundary=${multipart.boundary}` },
    body: multipart.body,
  });
  return response.json();
}

async function makeDriveFilePublic(fileId) {
  await driveRequest(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "reader", type: "anyone" }),
  });
}

async function loadFromDrive() {
  try {
    if (!confirm("Google Driveの保存データで、この端末の入力内容を上書きします。よろしいですか？")) return;
    setDriveStatus("Drive読込中...");
    await requestGoogleAccessToken();
    const file = await findDriveSyncFile();
    if (!file) {
      setDriveStatus("Driveデータなし");
      alert("Google Driveに保存データがまだありません。先にDrive保存を押してください。");
      return;
    }
    const response = await driveRequest(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`);
    const payload = await response.json();
      const removedNumericBatters = applyStatePayload(payload);
      saveState();
      const loadedAt = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
      setDriveStatus(removedNumericBatters ? `Drive読込済み / ${numericBatterCleanupMessage(removedNumericBatters)}` : `Drive読込済み ${loadedAt}`);
  } catch (error) {
    console.error(error);
    setDriveStatus("Drive読込失敗");
    alert("Google Driveからの読み込みに失敗しました。");
  }
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
  currentOuts = 1;
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
    countStats: true,
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
    "成績反映",
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
  const rows = logRecords().map((record) => [
    record.game,
    record.gameDate || "",
    record.team === "home" ? "後攻" : record.team === "away" ? "先攻" : "",
    record.battingOrder || "",
    record.isPinchHitter ? "代打" : "",
    record.countStats === false ? "対象外" : "反映",
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
loadSharedViewFromUrl().then((loadedSharedView) => {
  if (!loadedSharedView && !loadState()) {
    gameDate.valueAsDate = new Date();
  }
  if (!viewOnlyMode) {
    buildLineup();
    updateTotals();
    renderRecords();
  }
});

clearButton.addEventListener("click", clearForm);
sampleButton.addEventListener("click", fillSample);
exportButton.addEventListener("click", exportCsv);
driveSaveButton?.addEventListener("click", saveToDrive);
driveLoadButton?.addEventListener("click", loadFromDrive);
shareViewButton?.addEventListener("click", createViewLink);
gamePdfButton?.addEventListener("click", shareGamePdf);
rankingImageButton?.addEventListener("click", shareRankingImage);
saveGameButton.addEventListener("click", saveCurrentGame);
newGameButton.addEventListener("click", resetCurrentGame);
plateForm.addEventListener("submit", addPlateRecord);
cancelPlateEditButton?.addEventListener("click", () => {
  finishPlateEdit();
  setDriveStatus("打席の修正を取り消しました");
});
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
addOutButton.addEventListener("click", addOut);
undoOutButton.addEventListener("click", undoOut);
pitcherName.addEventListener("input", syncCurrentCountFromPitcher);
sortButtons.forEach((button) => button.addEventListener("click", changeSummarySort));
[gameDate, venue, gameName, notes, pitcherName, statInclude].forEach((field) => field.addEventListener("change", saveState));
