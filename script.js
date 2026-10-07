/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const STORAGE_KEY = "agendaPremium_items_v1";
const COMPLETION_KEY = "agendaPremium_completions_v1";
const SETTINGS_KEY =
  "agendaPremium_settings_v1";

const $ = (id) => document.getElementById(id);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const PRESET_COLORS = [
  "blue",
  "green",
  "orange",
  "purple",
  "red"
];

function isCustomColor(
  color
) {

  return (
    typeof color === "string" &&
    color.startsWith("#")
  );

}

function hexToRGBA(
  hex,
  opacity = 0.12
) {

  let value =
    hex.replace("#", "");


  if (
    value.length === 3
  ) {

    value =
      value
        .split("")
        .map(
          (character) =>
            character +
            character
        )
        .join("");

  }


  const number =
    parseInt(
      value,
      16
    );


  const red =
    (number >> 16) & 255;


  const green =
    (number >> 8) & 255;


  const blue =
    number & 255;


  return (
    `rgba(${red}, ${green}, ${blue}, ${opacity})`
  );

}

function applyEventColor(
  element,
  color
) {

  const selectedColor =
    color || "blue";


  if (
    PRESET_COLORS.includes(
      selectedColor
    )
  ) {

    element.classList.add(
      selectedColor
    );

    return;

  }


  if (
    isCustomColor(
      selectedColor
    )
  ) {

    const darkMode =
      document.body.classList.contains(
        "dark-mode"
      );


    element.style.background =
      hexToRGBA(
        selectedColor,
        darkMode
          ? 0.30
          : 0.10
      );


    element.style.color =
      darkMode
        ? "#f2f3f5"
        : selectedColor;


    element.style.borderColor =
      hexToRGBA(
        selectedColor,
        darkMode
          ? 0.65
          : 0.28
      );

  }

}


/* =========================================================
   ITENS INICIAIS
========================================================= */

const initialItems = [];


/* =========================================================
   CRIAÇÃO DE ID
========================================================= */

function createID() {

  return (
    "item_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


/* =========================================================
   CRIAR ITEM
========================================================= */

function createItem(
  type,
  title,
  date,
  start,
  end,
  color,
  important,
  repeat
) {

  return {

    id: createID(),

    type,

    title,

    date,

    start,

    end,

    color,

    important,

    repeat,

    notes: ""

  };

}


/* =========================================================
   DATA ATUAL
========================================================= */

function getTodayISO() {

  const date = new Date();

  return dateToISO(date);

}


/* =========================================================
   CONVERTER DATA
========================================================= */

function parseDate(dateString) {

  const [
    year,
    month,
    day
  ] = dateString
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );

}


/* =========================================================
   DATA PARA YYYY-MM-DD
========================================================= */

function dateToISO(date) {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;

}


/* =========================================================
   ADICIONAR DIAS
========================================================= */

function addDays(
  dateString,
  amount
) {

  const date =
    parseDate(
      dateString
    );

  date.setDate(
    date.getDate() +
    amount
  );

  return dateToISO(date);

}


/* =========================================================
   ADICIONAR MESES
========================================================= */

function addMonths(
  dateString,
  amount
) {

  const date =
    parseDate(
      dateString
    );

  date.setMonth(
    date.getMonth() +
    amount
  );

  return dateToISO(date);

}


/* =========================================================
   SEGUNDA-FEIRA DA SEMANA
========================================================= */

function getMonday(
  dateString
) {

  const date =
    parseDate(
      dateString
    );

  const day =
    date.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  date.setDate(
    date.getDate() +
    difference
  );

  return dateToISO(date);

}


/* =========================================================
   NOMES
========================================================= */

function getMonthName(
  dateString
) {

  return new Intl
    .DateTimeFormat(
      "pt-BR",
      {
        month: "long"
      }
    )
    .format(
      parseDate(
        dateString
      )
    );

}


function getWeekdayName(
  dateString
) {

  return new Intl
    .DateTimeFormat(
      "pt-BR",
      {
        weekday: "long"
      }
    )
    .format(
      parseDate(
        dateString
      )
    );

}


function getShortWeekday(
  dateString
) {

  return new Intl
    .DateTimeFormat(
      "pt-BR",
      {
        weekday: "short"
      }
    )
    .format(
      parseDate(
        dateString
      )
    )
    .replace(".", "");

}


function formatDayMonth(
  dateString
) {

  return new Intl
    .DateTimeFormat(
      "pt-BR",
      {
        day: "2-digit",
        month: "long"
      }
    )
    .format(
      parseDate(
        dateString
      )
    );

}


function capitalize(text) {

  if (!text) {
    return "";
  }

  return (
    text
      .charAt(0)
      .toUpperCase() +
    text.slice(1)
  );

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadItems() {

  const saved =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (saved) {

    try {

      return JSON.parse(
        saved
      );

    } catch (error) {

      console.error(
        "Erro ao carregar agenda:",
        error
      );

    }

  }


  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      initialItems
    )
  );


  return initialItems;

}


/* =========================================================
   CARREGAR CONCLUSÕES
========================================================= */

function loadCompletions() {

  const saved =
    localStorage.getItem(
      COMPLETION_KEY
    );

  if (saved) {

    try {

      return JSON.parse(
        saved
      );

    } catch (error) {

      console.error(
        "Erro ao carregar tarefas concluídas:",
        error
      );

    }

  }


  return {};

}


/* =========================================================
   VARIÁVEIS PRINCIPAIS
========================================================= */

let items =
  loadItems();


let completions =
  loadCompletions();


let selectedDate =
  getTodayISO();


let calendarView =
  "week";


let calendarFilter =
  "all";


/* =========================================================
   SALVAR
========================================================= */

function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      items
    )
  );


  localStorage.setItem(
    COMPLETION_KEY,
    JSON.stringify(
      completions
    )
  );

}


/* =========================================================
   ITEM OCORRE NA DATA?
========================================================= */

function occursOn(
  item,
  dateString
) {

  if (
    item.repeat ===
    "daily"
  ) {

    return (
      dateString >=
      item.date
    );

  }


  if (
    item.repeat ===
    "weekly"
  ) {

    if (
      dateString <
      item.date
    ) {

      return false;

    }


    return (
      parseDate(
        item.date
      ).getDay()
      ===
      parseDate(
        dateString
      ).getDay()
    );

  }


  return (
    item.date ===
    dateString
  );

}


/* =========================================================
   FILTRO DO MENU
========================================================= */

function passesFilter(
  item
) {

  if (
    calendarFilter ===
    "tasks"
  ) {

    return (
      item.type ===
      "task"
    );

  }

  if (
  calendarFilter ===
  "appointments"
) {

  return (
    item.type ===
    "appointment"
  );

}


  if (
    calendarFilter ===
    "projects"
  ) {

    return (
      item.title
        .toLowerCase()
        .includes(
          "projeto"
        )
    );

  }


  return true;

}


/* =========================================================
   ITENS DE UMA DATA
========================================================= */

function getItemsForDate(
  dateString,
  applyFilter = true
) {

  return items

    .filter(
      (item) =>
        occursOn(
          item,
          dateString
        )
    )

    .filter(
      (item) =>
        !applyFilter ||
        passesFilter(
          item
        )
    )

    .sort(
      (a, b) => {

        const timeA =
          a.start ||
          "99:99";

        const timeB =
          b.start ||
          "99:99";

        return (
          timeA.localeCompare(
            timeB
          )
        );

      }
    );

}


/* =========================================================
   CONCLUSÃO DA TAREFA
========================================================= */

function getCompletionKey(
  item,
  dateString
) {

  return (
    `${item.id}__${dateString}`
  );

}


function isCompleted(
  item,
  dateString
) {

  return Boolean(
    completions[
      getCompletionKey(
        item,
        dateString
      )
    ]
  );

}


function toggleTask(
  item,
  dateString
) {

  const key =
    getCompletionKey(
      item,
      dateString
    );


  if (
    completions[key]
  ) {

    delete completions[
      key
    ];

  } else {

    completions[key] =
      true;

  }


  saveData();

  renderEverything();

}


/* =========================================================
   SEGURANÇA DE TEXTO
========================================================= */

function escapeHTML(
  value
) {

  return String(
    value
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   CABEÇALHO
========================================================= */

function renderHeader() {

  const date =
    parseDate(
      selectedDate
    );


  $("monthName")
    .textContent =
      capitalize(
        getMonthName(
          selectedDate
        )
      );


  $("yearNumber")
    .textContent =
      date.getFullYear();


  updatePageTitle();

}


/* =========================================================
   TÍTULO DA PÁGINA
========================================================= */

function updatePageTitle() {

  const title =
    document.querySelector(
      ".title"
    );


  if (
    calendarFilter ===
    "tasks"
  ) {

    title.textContent =
      "Tarefas";

    return;

  }

  if (
  calendarFilter ===
  "appointments"
) {

  title.textContent =
    "Compromissos";

  return;

}


  if (
    calendarFilter ===
    "projects"
  ) {

    title.textContent =
      "Projetos";

    return;

  }


  if (
    calendarView ===
    "day"
  ) {

    title.textContent =
      "Dia";

  }


  if (
    calendarView ===
    "week"
  ) {

    title.textContent =
      "Semana";

  }


  if (
    calendarView ===
    "month"
  ) {

    title.textContent =
      "Mês";

  }

}


/* =========================================================
   CRIAR EVENTO VISUAL
========================================================= */

function createEventElement(
  item,
  dateString
) {

  const event =
    document.createElement(
      "div"
    );


  event.className =
  "event";

applyEventColor(
  event,
  item.color
);


  if (
    item.important
  ) {

    event.classList.add(
      "important"
    );

  }


  if (
    item.type ===
    "task" &&
    isCompleted(
      item,
      dateString
    )
  ) {

    event.style.opacity =
      "0.45";

  }


  const timeText =
    item.start

      ? `${item.start}${
          item.end
            ? `–${item.end}`
            : ""
        }`

      : "Sem horário";


  event.innerHTML = `

  <div class="event-info">

    <strong>
      ${escapeHTML(
        item.title
      )}
    </strong>

    <small>
      ${timeText}
    </small>

  </div>


  ${
    item.notes

      ? `

        <div class="event-note">

          <span>
            Observação
          </span>

          <p>
            ${escapeHTML(
              item.notes
            )}
          </p>

        </div>

      `

      : ""
  }

`;


  event.addEventListener(
    "click",
    (eventClick) => {

      eventClick
        .stopPropagation();


      openEditModal(
        item
      );

    }
  );


  return event;

}


/* =========================================================
   VISÃO SEMANAL
========================================================= */

function renderWeekCalendar() {

  const grid =
    $("calendarGrid");


  grid.innerHTML =
    "";


  const monday =
    getMonday(
      selectedDate
    );


  const weekdays = [];

  for (
    let i = 0;
    i < 7;
    i++
  ) {

    weekdays.push(
      addDays(
        monday,
        i
      )
    );

  }


  /* =========================
     CABEÇALHO
  ========================= */

  const corner =
    document.createElement(
      "div"
    );

  corner.className =
    "corner";

  grid.appendChild(
    corner
  );


  weekdays.forEach(
    (dateString) => {

      const date =
        parseDate(
          dateString
        );


      const head =
        document.createElement(
          "div"
        );


      head.className =
        "day-head";


      if (
        dateString ===
        getTodayISO()
      ) {

        head.classList.add(
          "today"
        );

      }


      head.innerHTML = `

        <span>
          ${capitalize(
            getShortWeekday(
              dateString
            )
          )}
        </span>

        <strong>
          ${
            String(
              date.getDate()
            ).padStart(
              2,
              "0"
            )
          }
        </strong>

      `;


      head.addEventListener(
        "click",
        () => {

          selectedDate =
            dateString;

          changeCalendarView(
            "day"
          );

        }
      );


      grid.appendChild(
        head
      );

    }
  );


  /* =========================
     HORÁRIOS DA SEMANA
  ========================= */

  const defaultTimes = [
    "09:00",
    "10:50",
    "13:20",
    "14:50",
    "15:40",
    "19:00"
  ];


  const timeSet =
    new Set(
      defaultTimes
    );


  weekdays.forEach(
    (dateString) => {

      getItemsForDate(
        dateString
      )
        .forEach(
          (item) => {

            if (
              item.start
            ) {

              timeSet.add(
                item.start
              );

            }

          }
        );

    }
  );


  const times =
    [...timeSet]
      .sort();


  times.forEach(
    (time) => {


      let maximumEvents =
        1;


      weekdays.forEach(
        (dateString) => {

          const amount =
            getItemsForDate(
              dateString
            )
              .filter(
                (item) =>
                  item.start ===
                  time
              )
              .length;


          maximumEvents =
            Math.max(
              maximumEvents,
              amount
            );

        }
      );


      const rowHeight =
        Math.max(
          96,
          maximumEvents *
            86 +
            8
        );


      /* HORÁRIO */

      const label =
        document.createElement(
          "div"
        );


      label.className =
        "time-label";


      label.textContent =
        time;


      label.style.height =
        `${rowHeight}px`;


      grid.appendChild(
        label
      );


      /* DIAS */

      weekdays.forEach(
        (dateString) => {

          const cell =
            document.createElement(
              "div"
            );


          cell.className =
            "cell";


          cell.style.height =
            `${rowHeight}px`;


          const cellItems =
            getItemsForDate(
              dateString
            )
              .filter(
                (item) =>
                  item.start ===
                  time
              );


          cellItems.forEach(
            (
              item,
              index
            ) => {

              const event =
                createEventElement(
                  item,
                  dateString
                );


              event.style.top =
                `${
                  8 +
                  index * 85
                }px`;


              event.style.minHeight =
                "78px";


              cell.appendChild(
                event
              );

            }
          );


          cell.addEventListener(
            "dblclick",
            () => {

              selectedDate =
                dateString;


              openNewModal(
                "appointment",
                time
              );

            }
          );


          grid.appendChild(
            cell
          );

        }
      );

    }
  );

}


/* =========================================================
   VISÃO DO DIA
========================================================= */

function renderDayCalendar() {

  $("selectedDayWeek")
    .textContent =
      capitalize(
        getWeekdayName(
          selectedDate
        )
      );


  $("selectedDayDate")
    .textContent =
      formatDayMonth(
        selectedDate
      );


  const timeline =
    $("dayTimeline");


  timeline.innerHTML =
    "";


  const dayItems =
    getItemsForDate(
      selectedDate
    );


  const defaultTimes = [
    "09:00",
    "10:50",
    "13:20",
    "14:50",
    "15:40",
    "19:00"
  ];


  const times =
    new Set(
      defaultTimes
    );


  dayItems.forEach(
    (item) => {

      if (
        item.start
      ) {

        times.add(
          item.start
        );

      }

    }
  );


  [...times]
    .sort()
    .forEach(
      (time) => {

        const row =
          document.createElement(
            "div"
          );


        row.className =
          "day-timeline-row";


        const timeLabel =
          document.createElement(
            "div"
          );


        timeLabel.className =
          "day-timeline-time";


        timeLabel.textContent =
          time;


        const content =
          document.createElement(
            "div"
          );


        content.className =
          "day-timeline-content";


        const itemsAtTime =
          dayItems.filter(
            (item) =>
              item.start ===
              time
          );


        itemsAtTime.forEach(
          (item) => {

            const event =
              createEventElement(
                item,
                selectedDate
              );


            event.style.position =
              "relative";

            event.style.left =
              "auto";

            event.style.right =
              "auto";

            event.style.top =
              "auto";

            event.style.minHeight =
              "56px";

            event.style.marginBottom =
              "5px";


            content.appendChild(
              event
            );

          }
        );


        content.addEventListener(
          "dblclick",
          () => {

            openNewModal(
              "appointment",
              time
            );

          }
        );


        row.appendChild(
          timeLabel
        );


        row.appendChild(
          content
        );


        timeline.appendChild(
          row
        );

      }
    );

}


/* =========================================================
   VISÃO MENSAL
========================================================= */

function renderMonthCalendar() {

  const monthGrid =
    $("monthGrid");


  monthGrid.innerHTML =
    "";


  const weekNames = [
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sáb",
    "Dom"
  ];


  weekNames.forEach(
    (name) => {

      const header =
        document.createElement(
          "div"
        );


      header.className =
        "month-weekday";


      header.textContent =
        name;


      monthGrid.appendChild(
        header
      );

    }
  );


  const selected =
    parseDate(
      selectedDate
    );


  const firstOfMonth =
    new Date(
      selected.getFullYear(),
      selected.getMonth(),
      1
    );


  const firstISO =
    dateToISO(
      firstOfMonth
    );


  const calendarStart =
    getMonday(
      firstISO
    );


  const selectedMonth =
    selected.getMonth();


  for (
    let i = 0;
    i < 42;
    i++
  ) {

    const dateString =
      addDays(
        calendarStart,
        i
      );


    const date =
      parseDate(
        dateString
      );


    const cell =
      document.createElement(
        "div"
      );


    cell.className =
      "month-day";


    if (
      date.getMonth() !==
      selectedMonth
    ) {

      cell.classList.add(
        "outside"
      );

    }


    if (
      dateString ===
      getTodayISO()
    ) {

      cell.classList.add(
        "today"
      );

    }


    const dayNumber =
      document.createElement(
        "div"
      );


    dayNumber.className =
      "month-day-number";


    dayNumber.textContent =
      date.getDate();


    cell.appendChild(
      dayNumber
    );


    const dayItems =
      getItemsForDate(
        dateString
      );


    dayItems
      .slice(
        0,
        3
      )
      .forEach(
        (item) => {

          const miniEvent =
            document.createElement(
              "div"
            );


          miniEvent.className =
            "month-event";


          miniEvent.textContent =
            item.title;


          applyMiniEventColor(
            miniEvent,
            item.color
          );


          miniEvent.addEventListener(
            "click",
            (event) => {

              event.stopPropagation();

              openEditModal(
                item
              );

            }
          );


          cell.appendChild(
            miniEvent
          );

        }
      );


    if (
      dayItems.length >
      3
    ) {

      const more =
        document.createElement(
          "div"
        );


      more.className =
        "month-event";


      more.textContent =
        `+${
          dayItems.length -
          3
        } itens`;


      cell.appendChild(
        more
      );

    }


    cell.addEventListener(
      "click",
      () => {

        selectedDate =
          dateString;


        changeCalendarView(
          "day"
        );

      }
    );


    monthGrid.appendChild(
      cell
    );

  }

}


/* =========================================================
   COR DOS EVENTOS DO MÊS
========================================================= */

function applyMiniEventColor(
  element,
  color
) {

  const darkMode =
    document.body.classList.contains(
      "dark-mode"
    );


  const lightColors = {

    blue: {
      background: "#edf1ff",
      color: "#2448c5"
    },

    green: {
      background: "#e9f6f0",
      color: "#216d50"
    },

    orange: {
      background: "#fff3e3",
      color: "#925411"
    },

    purple: {
      background: "#f0ecfa",
      color: "#6047a9"
    },

    red: {
      background: "#fbecec",
      color: "#9a3d3d"
    }

  };


  const darkColors = {

    blue: {
      background: "#192747",
      color: "#7fa3ff"
    },

    green: {
      background: "#17372d",
      color: "#72d4ae"
    },

    orange: {
      background: "#3b2a18",
      color: "#f1b562"
    },

    purple: {
      background: "#2d2547",
      color: "#b49cff"
    },

    red: {
      background: "#412326",
      color: "#f18d8d"
    }

  };


  if (
    isCustomColor(color)
  ) {

    element.style.background =
      hexToRGBA(
        color,
        darkMode
          ? 0.30
          : 0.10
      );


    element.style.color =
      darkMode
        ? "#f2f3f5"
        : color;


    element.style.border =
      `1px solid ${
        hexToRGBA(
          color,
          darkMode
            ? 0.65
            : 0.22
        )
      }`;

    return;

  }


  const colors =
    darkMode
      ? darkColors
      : lightColors;


  const selectedColor =
    colors[color] ||
    colors.blue;


  element.style.background =
    selectedColor.background;


  element.style.color =
    selectedColor.color;

}



/* =========================================================
   TROCAR VISÃO
========================================================= */

function changeCalendarView(
  view
) {

  calendarView =
    view;


  $$(".calendar-view")
    .forEach(
      (element) => {

        element.classList.remove(
          "active"
        );

      }
    );


  $$(
    "[data-calendar-view]"
  )
    .forEach(
      (button) => {

        button.classList.toggle(
          "active",
          button.dataset
            .calendarView ===
            view
        );

      }
    );


  if (
    view ===
    "day"
  ) {

    $("dayCalendarView")
      .classList
      .add(
        "active"
      );

  }


  if (
    view ===
    "week"
  ) {

    $("weekCalendarView")
      .classList
      .add(
        "active"
      );

  }


  if (
    view ===
    "month"
  ) {

    $("monthCalendarView")
      .classList
      .add(
        "active"
      );

  }


  renderEverything();

}


/* =========================================================
   TAREFAS DA DIREITA
========================================================= */

function renderTodayTasks() {

  const container =
    $("todayTasks");


  container.innerHTML =
    "";


  const tasks =
    getItemsForDate(
      selectedDate,
      false
    )
      .filter(
        (item) =>
          item.type ===
          "task"
      );


  const completed =
    tasks.filter(
      (task) =>
        isCompleted(
          task,
          selectedDate
        )
    ).length;


  $("taskCounter")
    .textContent =
      `${completed} de ${tasks.length}`;


  const percentage =
    tasks.length

      ? (
          completed /
          tasks.length
        ) * 100

      : 0;


  $("progressBar")
    .style.width =
      `${percentage}%`;


  if (
    !tasks.length
  ) {

    container.innerHTML = `

      <div style="
        padding: 24px 5px;
        font-size: 11px;
        color: #7c838d;
        text-align: center;
      ">
        Nenhuma tarefa neste dia.
      </div>

    `;

    return;

  }


  tasks.forEach(
    (task) => {

      const completed =
        isCompleted(
          task,
          selectedDate
        );


      const row =
        document.createElement(
          "div"
        );


      row.className =
        "task";


      if (
        completed
      ) {

        row.classList.add(
          "done"
        );

      }


      row.innerHTML = `

        <button
          class="check"
          title="Marcar como concluída"
        >
        </button>


        <div>

          <div class="task-name">

            ${escapeHTML(
              task.title
            )}

          </div>


          <div class="task-meta">

            ${
              task.start ||
              "Sem horário"
            }

            ${
              task.end
                ? `–${task.end}`
                : ""
            }

          </div>

        </div>


        <span
          class="dot ${task.color || "blue"}"
          title="Editar tarefa"
        >
        </span>

      `;


      row
        .querySelector(
          ".check"
        )
        .addEventListener(
          "click",
          () => {

            toggleTask(
              task,
              selectedDate
            );

          }
        );


      row
        .querySelector(
          ".task-name"
        )
        .addEventListener(
          "click",
          () => {

            openEditModal(
              task
            );

          }
        );


      row
        .querySelector(
          ".dot"
        )
        .addEventListener(
          "click",
          () => {

            openEditModal(
              task
            );

          }
        );


      container.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   RESUMO DO DIA
========================================================= */

function renderSummary() {

  const dayItems =
    getItemsForDate(
      selectedDate,
      false
    );


  const tasks =
    dayItems.filter(
      (item) =>
        item.type ===
        "task"
    );


  const appointments =
    dayItems.filter(
      (item) =>
        item.type ===
        "appointment"
    );


  const completed =
    tasks.filter(
      (item) =>
        isCompleted(
          item,
          selectedDate
        )
    ).length;


  $("summaryDate")
    .textContent =
      `${capitalize(
        getShortWeekday(
          selectedDate
        )
      )}, ${
        String(
          parseDate(
            selectedDate
          ).getDate()
        ).padStart(
          2,
          "0"
        )
      }`;


  $("summaryTasks")
    .textContent =
      tasks.length;


  $("summaryCompleted")
    .textContent =
      completed;


  $("summaryAppointments")
    .textContent =
      appointments.length;


  $("summaryTime")
    .textContent =
      calculatePlannedTime(
        dayItems
      );

}


/* =========================================================
   CALCULAR TEMPO PLANEJADO
========================================================= */

function calculatePlannedTime(
  dayItems
) {

  let totalMinutes =
    0;


  dayItems.forEach(
    (item) => {

      if (
        !item.start ||
        !item.end
      ) {

        return;

      }


      const [
        startHour,
        startMinute
      ] =
        item.start
          .split(":")
          .map(Number);


      const [
        endHour,
        endMinute
      ] =
        item.end
          .split(":")
          .map(Number);


      const start =
        startHour *
        60 +
        startMinute;


      const end =
        endHour *
        60 +
        endMinute;


      if (
        end >
        start
      ) {

        totalMinutes +=
          end -
          start;

      }

    }
  );


  const hours =
    Math.floor(
      totalMinutes /
      60
    );


  const minutes =
    totalMinutes %
    60;


  if (
    hours === 0
  ) {

    return `${minutes}min`;

  }


  if (
    minutes === 0
  ) {

    return `${hours}h`;

  }


  return (
    `${hours}h ${minutes}min`
  );

}


/* =========================================================
   PRÓXIMO COMPROMISSO
========================================================= */

function renderNextAppointment() {

  const container =
    $("nextAppointment");


  let nextItem =
    null;


  let nextDate =
    null;


  for (
    let offset = 0;
    offset < 30;
    offset++
  ) {

    const dateString =
      addDays(
        selectedDate,
        offset
      );


    const appointments =
      getItemsForDate(
        dateString,
        false
      )
        .filter(
          (item) =>
            item.type ===
            "appointment"
        );


    if (
      appointments.length
    ) {

      nextItem =
        appointments[0];

      nextDate =
        dateString;

      break;

    }

  }


  if (
    !nextItem
  ) {

    container.innerHTML = `

      <span class="next-empty">
        Nenhum compromisso próximo.
      </span>

    `;

    return;

  }


  container.innerHTML = `

    <div class="next-card">

      <strong>
        ${escapeHTML(
          nextItem.title
        )}
      </strong>

      <span>

        ${capitalize(
          getShortWeekday(
            nextDate
          )
        )},

        ${
          parseDate(
            nextDate
          ).getDate()
        }

        ·

        ${
          nextItem.start ||
          "Sem horário"
        }

      </span>

    </div>

  `;


  container
    .querySelector(
      ".next-card"
    )
    .addEventListener(
      "click",
      () => {

        selectedDate =
          nextDate;


        openEditModal(
          nextItem
        );

      }
    );

}


/* =========================================================
   ABRIR NOVO ITEM
========================================================= */

function openNewModal(
  type = "task",
  startTime = ""
) {

  $("itemForm")
    .reset();


  $("itemId")
    .value =
      "";


  $("itemDate")
    .value =
      selectedDate;


  $("itemStart")
    .value =
      startTime;


  $("itemEnd")
    .value =
      "";


  $("itemRepeat")
    .value =
      "none";


  $("itemImportant")
    .checked =
      false;


  setItemType(
    type
  );


  selectColor(
    "blue"
  );


  $("modalTitle")
    .textContent =

      type ===
      "task"

        ? "Nova tarefa"

        : "Novo compromisso";


  $("deleteItemBtn")
    .classList
    .add(
      "hidden"
    );

    document.body.classList.add(
    "modal-open"
    );


  $("itemModal")
    .showModal();


  setTimeout(
    () => {

      $("itemTitle")
        .focus();

    },
    50
  );

}


/* =========================================================
   EDITAR ITEM
========================================================= */

function openEditModal(
  item
) {

  $("itemId")
    .value =
      item.id;


  $("itemTitle")
    .value =
      item.title;


  $("itemDate")
    .value =
      item.date;


  $("itemStart")
    .value =
      item.start ||
      "";


  $("itemEnd")
    .value =
      item.end ||
      "";


  $("itemRepeat")
    .value =
      item.repeat ||
      "none";


  $("itemImportant")
    .checked =
      Boolean(
        item.important
      );


  $("itemNotes")
    .value =
      item.notes ||
      "";


  setItemType(
    item.type
  );


  selectColor(
    item.color ||
    "blue"
  );


  $("modalTitle")
    .textContent =
      "Editar item";


  $("deleteItemBtn")
    .classList
    .remove(
      "hidden"
    );

    document.body.classList.add(
    "modal-open"
    );


  $("itemModal")
    .showModal();

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function closeModal() {

  $("itemModal")
    .close();

     document.body.classList.remove(
    "modal-open"
   );

}


/* =========================================================
   TIPO DO ITEM
========================================================= */

function setItemType(
  type
) {

  $("itemType")
    .value =
      type;


  $$(".item-type-button")
    .forEach(
      (button) => {

        button.classList.toggle(

          "active",

          button.dataset.type ===
          type

        );

      }
    );

}


/* =========================================================
   COR
========================================================= */

function selectColor(
  color
) {

  $("itemColor")
    .value =
      color;


  $$(".color-button")
    .forEach(
      (button) => {

        button.classList.toggle(

          "selected",

          button.dataset.color ===
          color

        );

      }
    );


  const customButton =
    $("customColorLabel");


  const custom =
    isCustomColor(
      color
    );


  customButton
    .classList
    .toggle(
      "selected",
      custom
    );


  if (custom) {

    $("customColorPicker")
      .value =
        color;


    customButton.style.background =
      color;


    customButton.style.color =
      "#ffffff";

  } else {

    customButton.style.background =
      "#ffffff";


    customButton.style.color =
      "#676c74";

  }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message
) {

  const toast =
    $("toast");


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    showToast.timer
  );


  showToast.timer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2200
    );

}


/* =========================================================
   RENDERIZAÇÃO GERAL
========================================================= */

function renderEverything() {

  renderHeader();

  renderWeekCalendar();

  renderDayCalendar();

  renderMonthCalendar();

  renderTodayTasks();

  renderSummary();

  renderNextAppointment();

}


/* =========================================================
   BOTÕES DIA / SEMANA / MÊS
========================================================= */

$$(
  "[data-calendar-view]"
)
  .forEach(
    (button) => {
button.addEventListener(
  "click",
  () => {

    const newView =
      button.dataset.calendarView;


    if (
      newView === "week" &&
      calendarView !== "week"
    ) {

      selectedDate =
        getTodayISO();

    }


    changeCalendarView(
      newView
    );

  }
);

    }
  );


/* =========================================================
   BOTÕES DO MENU
========================================================= */

$$(".nav-btn")
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const view =
            button.dataset.view;


          if (
      view ===
      "more"
    ) {

  const moreMenu =
    $("moreMenu");

  const willOpen =
    !moreMenu.classList.contains(
      "open"
    );

  moreMenu.classList.toggle(
    "open",
    willOpen
  );


  if (willOpen) {

    requestAnimationFrame(
      () => {

        const buttonPosition =
          button.getBoundingClientRect();

        const menuHeight =
          moreMenu.offsetHeight;

        const top =
          Math.min(
            Math.max(
              12,
              buttonPosition.top
            ),
            window.innerHeight -
            menuHeight -
            12
          );

        moreMenu.style.top =
          `${top}px`;

      }
    );

  }

  return;

}


          $$(".nav-btn")
            .forEach(
              (otherButton) => {

                otherButton
                  .classList
                  .remove(
                    "active"
                  );

              }
            );


          button
            .classList
            .add(
              "active"
            );


          if (
            view ===
            "agenda"
          ) {

            calendarFilter =
              "all";

          }


          if (
            view ===
            "tasks"
          ) {

            calendarFilter =
              "tasks";

          }

          if (
              view ===
              "appointments"
            ) {

              calendarFilter =
                "appointments";

            }


          if (
            view ===
            "projects"
          ) {

            calendarFilter =
              "projects";

          }


          renderEverything();

        }
      );

    }
  );

  /* FECHAR MENU MAIS AO CLICAR FORA */

document.addEventListener("click", (event) => {

  const moreMenu = $("moreMenu");

  const moreButton = document.querySelector(
    '[data-view="more"]'
  );

  if (
    !moreMenu.contains(event.target) &&
    !moreButton.contains(event.target)
  ) {
    moreMenu.classList.remove("open");
  }

});


/* =========================================================
   NAVEGAR PARA TRÁS
========================================================= */

$("previousWeekBtn")
  .addEventListener(
    "click",
    () => {

      if (
        calendarView ===
        "day"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            -1
          );

      }


      if (
        calendarView ===
        "week"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            -7
          );

      }


      if (
        calendarView ===
        "month"
      ) {

        selectedDate =
          addMonths(
            selectedDate,
            -1
          );

      }


      renderEverything();

    }
  );


/* =========================================================
   NAVEGAR PARA FRENTE
========================================================= */

$("nextWeekBtn")
  .addEventListener(
    "click",
    () => {

      if (
        calendarView ===
        "day"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            1
          );

      }


      if (
        calendarView ===
        "week"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            7
          );

      }


      if (
        calendarView ===
        "month"
      ) {

        selectedDate =
          addMonths(
            selectedDate,
            1
          );

      }


      renderEverything();

    }
  );


/* =========================================================
   HOJE
========================================================= */

$("todayBtn")
  .addEventListener(
    "click",
    () => {

      selectedDate =
        getTodayISO();


      renderEverything();

    }
  );


/* =========================================================
   DIA ANTERIOR
========================================================= */

$("previousDayBtn")
  .addEventListener(
    "click",
    () => {

      selectedDate =
        addDays(
          selectedDate,
          -1
        );


      renderEverything();

    }
  );


/* =========================================================
   PRÓXIMO DIA
========================================================= */

$("nextDayBtn")
  .addEventListener(
    "click",
    () => {

      selectedDate =
        addDays(
          selectedDate,
          1
        );


      renderEverything();

    }
  );


/* =========================================================
   ADICIONAR
========================================================= */

$("addItemBtn")
  .addEventListener(
    "click",
    () => {

      openNewModal(
        "task"
      );

    }
  );


$("quickAddTaskBtn")
  .addEventListener(
    "click",
    () => {

      openNewModal(
        "task"
      );

    }
  );


$("mobileAddButton")
  .addEventListener(
    "click",
    () => {

      openNewModal(
        "task"
      );

    }
  );


/* =========================================================
   TIPO NO MODAL
========================================================= */

$$(".item-type-button")
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          setItemType(
            button.dataset.type
          );

        }
      );

    }
  );


/* =========================================================
   ESCOLHER COR
========================================================= */

$$(".color-button")
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          selectColor(
            button.dataset.color
          );

        }
      );

    }
  );


  $("customColorPicker")
  .addEventListener(
    "input",
    (event) => {

      selectColor(
        event.target.value
      );

    }
  );


/* =========================================================
   FECHAR MODAL
========================================================= */

$("closeModalBtn")
  .addEventListener(
    "click",
    closeModal
  );


$("cancelModalBtn")
  .addEventListener(
    "click",
    closeModal
  );


/* =========================================================
   SALVAR ITEM
========================================================= */

$("itemForm")
  .addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const id =
        $("itemId")
          .value;


      const title =
        $("itemTitle")
          .value
          .trim();


      const type =
        $("itemType")
          .value;


      const date =
        $("itemDate")
          .value;


      const start =
        $("itemStart")
          .value;


      const end =
        $("itemEnd")
          .value;


      const repeat =
        $("itemRepeat")
          .value;


      const color =
        $("itemColor")
          .value;


      const important =
        $("itemImportant")
          .checked;


      const notes =
        $("itemNotes")
          .value
          .trim();


      if (
        !title ||
        !date
      ) {

        showToast(
          "Preencha o título e a data."
        );

        return;

      }


      if (
        start &&
        end &&
        end <= start
      ) {

        showToast(
          "O horário final precisa ser depois do início."
        );

        return;

      }


      const newData = {

        id:
          id ||
          createID(),

        type,

        title,

        date,

        start,

        end,

        repeat,

        color,

        important,

        notes

      };


      if (id) {

        const index =
          items.findIndex(
            (item) =>
              item.id ===
              id
          );


        if (
          index !== -1
        ) {

          items[index] =
            newData;

        }

      } else {

        items.push(
          newData
        );

      }


      selectedDate =
        date;


      saveData();

      closeModal();

      renderEverything();


      showToast(

        id

          ? "Item atualizado."

          : "Item adicionado."

      );

    }
  );


/* =========================================================
   EXCLUIR ITEM
========================================================= */

let pendingDeleteId = null;


$("deleteItemBtn")
  .addEventListener(
    "click",
    () => {

      const id =
        $("itemId")
          .value;


      const item =
        items.find(
          (item) =>
            item.id === id
        );


      if (!item) {
        return;
      }


      pendingDeleteId =
        id;


      $("deleteItemName")
        .textContent =
          `"${item.title}"`;


      $("deleteModal")
        .showModal();

    }
  );


$("cancelDeleteBtn")
  .addEventListener(
    "click",
    () => {

      pendingDeleteId =
        null;


      $("deleteModal")
        .close();

    }
  );


$("confirmDeleteBtn")
  .addEventListener(
    "click",
    () => {

      if (
        !pendingDeleteId
      ) {

        return;

      }


      const id =
        pendingDeleteId;


      items =
        items.filter(
          (item) =>
            item.id !== id
        );


      Object
        .keys(
          completions
        )
        .forEach(
          (key) => {

            if (
              key.startsWith(
                `${id}__`
              )
            ) {

              delete completions[
                key
              ];

            }

          }
        );


      pendingDeleteId =
        null;


      saveData();


      $("deleteModal")
        .close();


      closeModal();


      renderEverything();


      showToast(
        "Item excluído."
      );

    }
  );


$("deleteModal")
  .addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        $("deleteModal")
      ) {

        pendingDeleteId =
          null;


        $("deleteModal")
          .close();

      }

    }
  );


/* =========================================================
   CLICAR FORA DO MODAL
========================================================= */

$("itemModal")
  .addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        $("itemModal")
      ) {

        closeModal();

      }

    }
  );


/* =========================================================
   SETAS LATERAIS DO CALENDÁRIO
========================================================= */

$("sidePrevBtn")
  .addEventListener(
    "click",
    () => {

      if (
        calendarView ===
        "day"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            -1
          );

      }


      if (
        calendarView ===
        "week"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            -7
          );

      }


      if (
        calendarView ===
        "month"
      ) {

        selectedDate =
          addMonths(
            selectedDate,
            -1
          );

      }


      renderEverything();

    }
  );


$("sideNextBtn")
  .addEventListener(
    "click",
    () => {

      if (
        calendarView ===
        "day"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            1
          );

      }


      if (
        calendarView ===
        "week"
      ) {

        selectedDate =
          addDays(
            selectedDate,
            7
          );

      }


      if (
        calendarView ===
        "month"
      ) {

        selectedDate =
          addMonths(
            selectedDate,
            1
          );

      }


      renderEverything();

    }
  );

/* =========================================================
   HORÁRIO INICIAL → HORÁRIO FINAL
========================================================= */

let startTimeDigits = 0;

$("itemStart").addEventListener(
  "focus",
  () => {
    startTimeDigits = 0;
  }
);

$("itemStart").addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Backspace" ||
      event.key === "Delete"
    ) {
      startTimeDigits = 0;
      return;
    }

    if (
      /^[0-9]$/.test(event.key)
    ) {

      startTimeDigits++;

      if (startTimeDigits >= 4) {

        startTimeDigits = 0;

        setTimeout(
          () => {
            $("itemEnd").focus();
          },
          200
        );

      }

    }

  }
);

/* =========================================================
   MEUS DADOS
========================================================= */

/* ABRIR */

$("dataBtn").addEventListener(
  "click",
  () => {

    $("moreMenu")
      .classList
      .remove("open");

    document.body
      .classList
      .add("modal-open");

    $("dataModal")
      .showModal();

  }
);


/* FECHAR */

$("closeDataBtn").addEventListener(
  "click",
  () => {

    $("dataModal").close();

    document.body
      .classList
      .remove("modal-open");

  }
);


/* CLICAR FORA PARA FECHAR */

$("dataModal").addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      $("dataModal")
    ) {

      $("dataModal").close();

      document.body
        .classList
        .remove("modal-open");

    }

  }
);


/* =========================================================
   EXPORTAR BACKUP
========================================================= */

$("exportDataBtn").addEventListener(
  "click",
  () => {

    const backup = {

      version: 1,

      exportedAt:
        new Date().toISOString(),

      items:
        JSON.parse(
          localStorage.getItem(
            STORAGE_KEY
          ) || "[]"
        ),

      completions:
        JSON.parse(
          localStorage.getItem(
            COMPLETION_KEY
          ) || "{}"
        ),

      settings:
        JSON.parse(
          localStorage.getItem(
            SETTINGS_KEY
          ) || "{}"
        )

    };


    const file =
      new Blob(
        [
          JSON.stringify(
            backup,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        file
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;

    link.download =
      "backup-calendario.json";


    link.click();


    URL.revokeObjectURL(
      url
    );


    showToast(
      "Backup exportado."
    );

  }
);


/* =========================================================
   IMPORTAR BACKUP
========================================================= */

$("importDataBtn").addEventListener(
  "click",
  () => {

    $("importDataFile")
      .click();

  }
);


$("importDataFile").addEventListener(
  "change",
  (event) => {

    const file =
      event.target.files[0];


    if (!file) {
      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      () => {

        try {

          const backup =
            JSON.parse(
              reader.result
            );


          if (
            !backup ||
            !Array.isArray(
              backup.items
            )
          ) {

            throw new Error(
              "Backup inválido"
            );

          }


          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              backup.items
            )
          );


          localStorage.setItem(
            COMPLETION_KEY,
            JSON.stringify(
              backup.completions ||
              {}
            )
          );


          localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(
              backup.settings ||
              {}
            )
          );


          location.reload();

        } catch (error) {

          showToast(
            "Arquivo de backup inválido."
          );

        }

      };


    reader.readAsText(
      file
    );

  }
);


/* =========================================================
   APAGAR DADOS
========================================================= */

let clearDataTimer =
  null;


$("clearDataBtn").addEventListener(
  "click",
  () => {

    const button =
      $("clearDataBtn");


    if (
      button.dataset.confirming ===
      "true"
    ) {

      localStorage.setItem(
        STORAGE_KEY,
        "[]"
      );


      localStorage.setItem(
        COMPLETION_KEY,
        "{}"
      );


      localStorage.removeItem(
        SETTINGS_KEY
      );


      location.reload();

      return;

    }


    button.dataset.confirming =
      "true";


    button.innerHTML = `
      <strong>
        Clique novamente para confirmar
      </strong>

      <span>
        Isso apagará toda a agenda deste navegador
      </span>
    `;


    clearTimeout(
      clearDataTimer
    );


    clearDataTimer =
      setTimeout(
        () => {

          button.dataset.confirming =
            "false";

          button.innerHTML = `
            <strong>
              Apagar meus dados
            </strong>

            <span>
              Excluir tudo salvo neste navegador
            </span>
          `;

        },
        5000
      );

  }
);


/* =========================================================
   ABRIR CONFIGURAÇÕES
========================================================= */

$("settingsBtn")
  .addEventListener(
    "click",
    () => {

      $("moreMenu")
        .classList
        .remove(
          "open"
        );

      document.body
        .classList
        .add(
          "modal-open"
        );

      $("settingsModal")
        .showModal();

    }
  );


/* =========================================================
   FECHAR CONFIGURAÇÕES
========================================================= */

$("closeSettingsBtn")
  .addEventListener(
    "click",
    () => {

      $("settingsModal")
        .close();

      document.body
        .classList
        .remove(
          "modal-open"
        );

    }
  );

  /* =========================================================
   CONFIGURAÇÕES SALVAS
========================================================= */

let settings = {
  darkMode: false
};


const savedSettings =
  localStorage.getItem(
    SETTINGS_KEY
  );


if (savedSettings) {

  try {

    settings = {
      ...settings,
      ...JSON.parse(
        savedSettings
      )
    };

  } catch (error) {

    console.error(
      "Erro ao carregar configurações:",
      error
    );

  }

}


/* APLICAR APARÊNCIA SALVA */

document.body.classList.toggle(
  "dark-mode",
  settings.darkMode
);


$("darkModeToggle").checked =
  settings.darkMode;


/* TROCAR MODO ESCURO */

$("darkModeToggle")
  .addEventListener(
    "change",
    () => {

      settings.darkMode =
        $("darkModeToggle")
          .checked;


      document.body.classList.toggle(
        "dark-mode",
        settings.darkMode
      );


      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(
          settings
        )
      );

      renderEverything();

    }
  );

  $("fflProfile").addEventListener(
  "click",
  () => {

    window.open(
      "https://www.instagram.com/ffl.web/",
      "_blank",
      "noopener,noreferrer"
    );

  }
);

  /* =========================================================
   INICIAR O SISTEMA
========================================================= */

renderEverything();