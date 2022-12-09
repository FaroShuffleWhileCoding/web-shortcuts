const shortcuts = document.querySelectorAll(".shortcut");
const all_status = document.querySelectorAll(".status");
let draggableShortcut = null;

shortcuts.forEach((shortcut) => {
  shortcut.addEventListener("dragstart", dragStart);
  shortcut.addEventListener("dragend", dragEnd);
});

function dragStart() {
  draggableShortcut = this;
  setTimeout(() => {
    this.style.display = "none";
  }, 0);
  console.log("dragStart");
}

function dragEnd() {
  draggableShortcut = null;
  setTimeout(() => {
    this.style.display = "flex";
  }, 0);
  console.log("dragEnd");
}

all_status.forEach((status) => {
  status.addEventListener("dragover", dragOver);
  status.addEventListener("dragenter", dragEnter);
  status.addEventListener("dragleave", dragLeave);
  status.addEventListener("drop", dragDrop);
});

function dragOver(e) {
  e.preventDefault();
  //   console.log("dragOver");
}

function dragEnter() {
  this.style.border = "1px dashed #ccc";
  console.log("dragEnter");
}

function dragLeave() {
  this.style.border = "none";
  console.log("dragLeave");
}

function dragDrop() {
  this.style.border = "none";
  this.appendChild(draggableShortcut);
  console.log("dropped");
}

/* modal */
const btns = document.querySelectorAll("[data-target-modal]");
const close_modals = document.querySelectorAll(".close-modal");
const overlay = document.getElementById("overlay");

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.targetModal).classList.add("active");
    overlay.classList.add("active");
  });
});

close_modals.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });
});

window.onclick = (event) => {
  if (event.target == overlay) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => modal.classList.remove("active"));
    overlay.classList.remove("active");
  }
};

/* create shortcut  */

let uploadedName = "";
let uploadedURL = "";

const shortcut_submit = document.getElementById("shortcut_submit");

let headers = ["Name", "URL"];
let sitesNamesArr = [];
let sitesURLsArr = [];

let input_val;
let url;
/*
function checkIfUploaded() {
  if (sitesNamesArr.length > 0 && sitesURLsArr.length > 0) {
    for (let i = 0; i < sitesNamesArr.length; i++) {
      input_val = sitesNamesArr[i];
      url = sitesURLsArr[i];
      createShortcut();
    }
  }
}
*/
function createOneShortcut() {
  input_val = document.getElementById("site-name").value;
  // const txt = document.createTextNode(input_val);
  url = document.getElementById("site-url").value;
  createShortcut();
}

function createShortcut() {
  const shortcut_div = document.createElement("div");

  shortcut_div.innerHTML = `<a href=${url}
  ><img
    height="32"
    width="32"
    src="https://www.google.com/s2/favicons?&sz=32&domain=${url}"
/></a>
<div id="site-name">${input_val}</div>
<span class="close">&times;</span>`;

  shortcut_div.classList.add("shortcut");
  shortcut_div.setAttribute("draggable", "true");

  /* create span */
  const span = document.createElement("span");
  const span_txt = document.createTextNode("\u00D7");
  span.classList.add("close");
  span.appendChild(span_txt);

  shortcut_div.appendChild(span);

  no_status.appendChild(shortcut_div);

  span.addEventListener("click", () => {
    span.parentElement.style.display = "none";
  });
  //   console.log(shortcut_div);

  shortcut_div.addEventListener("dragstart", dragStart);
  shortcut_div.addEventListener("dragend", dragEnd);

  // document.getElementById("shortcut_input").value = "";
  shortcut_form.classList.remove("active");
  overlay.classList.remove("active");
}

const close_btns = document.querySelectorAll(".close");

close_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.style.display = "none";
  });
});

/* Get CSV File */
/*
async function getCSV() {
  let [fileHandle] = await window.showOpenFilePicker();
  let file = await fileHandle.getFile();
  return file;
}

let theJSON = Papa.parse(getCSV(), {
  header: true,
});

console.log(theJSON);
*/

// Site Name and URL dictionary

shortcut_submit.addEventListener("click", createOneShortcut);

let sites = {};

/* Get CSV File */
const uploadconfirm = document.getElementById("uploadconfirm");
uploadconfirm.addEventListener("click", () => {
  Papa.parse(document.getElementById("uploadfile").files[0], {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log(results);
      for (let i = 0; i < results.data.length; i++) {
        sites[results.data[i]["Name"]] = results.data[i]["URL"];
      }
      console.log(sites);
      for (let key in sites) {
        // let shortcutDiv = document.createElement("div");
        uploadedName = key;
        console.log(`Uploaded Name: ${uploadedName}`);
        uploadedURL = sites[key];
        console.log(`Uploaded URL: ${uploadedURL}`);
        sitesNamesArr.push(uploadedName);
        sitesURLsArr.push(uploadedURL);
        for (let k in sitesNamesArr) {
          input_val = sitesNamesArr[k];
          url = sitesURLsArr[k];
        }
        createShortcut();
        //checkIfUploaded();
        /*
        shortcutDiv.innerHTML = `<a href=${uploadedURL}
        ><img
        height="32"
        width="32"
        src="https://www.google.com/s2/favicons?&sz=32&domain=${uploadedURL}"
        /></a>
        <div id="site-name">${uploadedName}</div>
        <span class="close">&times;</span>`;

        shortcutDiv.classList.add("shortcut");
        shortcutDiv.setAttribute("draggable", "true");
        */
      }
    },
  });
});

/** Convert a 2D array into a CSV string
 */
function arrayToCsv(data) {
  return data.map(
    (row) =>
      row
        .map(String) // convert every value to String
        .map((v) => v.replaceAll('"', '""')) // escape double colons
        .map((v) => `"${v}"`) // quote it
        .join(",") // comma-separated
  );
  //.join("\r\n"); // rows starting on new lines
}

/** Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */
function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", filename);
  pom.click();
}
// Save shortcuts as JSON
let saveBtn = document.getElementById("btn-save");
saveBtn.addEventListener("click", () => {
  shortcuts.forEach((shortcut) => {
    siteName = shortcut.querySelector("#site-name").innerText;
    siteURL = shortcut.querySelector("a").href;
    sitesNamesArr.push(siteName);
    sitesURLsArr.push(siteURL);
  });
  let csv = arrayToCsv([headers, sitesNamesArr, sitesURLsArr]);

  downloadBlob(csv, "web-shortcuts2.csv", "text/csv;charset=utf-8;");
});
