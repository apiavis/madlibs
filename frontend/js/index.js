const init = async () => {
  window.madlibTitle = "";
  window.axios = axios.create({
    baseURL: "http://localhost:3001/madlibs/"
  });
  bindEventListeners();
  const optionsArray = await axios.get("madlibsList");
  buildDropdown(optionsArray.data);
};

const buildDropdown = optionsArr => {
  const select = document.getElementById("madlibDropdown");
  let starterOption = document.createElement("option");
  starterOption.innerText = "Pick a topic!";
  select.append(starterOption);
  for (let i = 0; i < optionsArr.length; i++) {
    let option = document.createElement("option");
    option.innerText = optionsArr[i].formatToPascal();
    option.setAttribute("value", optionsArr[i]);
    select.append(option);
  }
};

const bindEventListeners = () => {
  document
    .getElementById("madlibDropdown")
    .addEventListener("change", handleDropdownChange);
  document
    .getElementById("randomMadlibBtn")
    .addEventListener("click", handleRandomMadlib);
};

const handleDropdownChange = async e => {
  if (!e.target.selectedIndex) {
    return;
  }
  const { data } = await axios
    .get(`singleMadlib/${e.target.value}`)
    .catch(err => {
      console.log(err);
    });
  createMadlibForm(data);
};

const handleRandomMadlib = async e => {
  const { data } = await axios.get("randomMadlib").catch(err => {
    console.log(err);
  });
  createMadlibForm(data);
};

const createMadlibForm = madlibObj => {
  window.madlibTitle = madlibObj.madlibTitle;
  const containerDiv = document.getElementById("madlibFormContainer");
  containerDiv.innerHTML = "";
  const titleHeader = document.createElement("h2");
  console.log(window.madlibTitle.formatToPascal());
  titleHeader.innerText = window.madlibTitle.formatToPascal();
  containerDiv.append(titleHeader);
  containerDiv.append(arrayToHtmlForm(madlibObj.madlibsFormFields));
};

const arrayToHtmlForm = arr => {
  const form = document.createElement("form");
  form.setAttribute("id", "madlibForm");
  for (let i = 0; i < arr.length; i++) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = arr[i].formatToPascal();
    let input = document.createElement("input");
    input.name = arr[i];
    input.placeholder = arr[i].formatToPascal();
    div.append(p);
    div.append(input);
    form.append(div);
  }
  const btn = document.createElement("button");
  btn.innerText = "Submit";
  form.append(btn);
  form.addEventListener("submit", handleFormSubmit);
  return form;
};

const handleFormSubmit = async e => {
  e.preventDefault();
  const formObj = {};
  for (let i = 0; i < e.target.length - 1; i++) {
    formObj[e.target[i].name] = e.target[i].value;
  }
  const { data } = await axios.post("createMadlib", {
    madlibForm: formObj,
    madlibTitle: window.madlibTitle
  });
  displayMadlib(data);
};

const displayMadlib = madlib => {
  const madlibContainer = document.getElementById("madlibDisplayContainer");
  madlibContainer.innerHTML = "";
  const madlibTitleHeader = document.createElement("h2");
  madlibTitleHeader.innerText = window.madlibTitle.formatToPascal();
  madlibContainer.append(madlibTitleHeader);
  const p = document.createElement("p");
  p.innerText = madlib;
  madlibContainer.append(p);
};

String.prototype.formatToPascal = function(){
  const idCaps = new RegExp(/([A-Z])/,'g');
  const dumpNumbers = new RegExp(/([0-9])/,'g');
  let formattedStr = `${this}`
  formattedStr = formattedStr
    .replace(dumpNumbers, "")
    .replace(idCaps, " $1")
    .split("");
  formattedStr[0] = formattedStr[0].toUpperCase();
  return formattedStr.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});