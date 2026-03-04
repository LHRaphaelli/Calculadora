let input = document.getElementById("inputBox");
let buttons = document.querySelectorAll("button");

let string = "";
let arr = Array.from(buttons);

arr.forEach((button) => {
  button.addEventListener("click", (e) => {
    const buttonText = e.target.innerHTML;

    if (buttonText == "=") {
      try {
        if (string.trim() === "") {
          return;
        }
        string = eval(string).toString();
        input.value = string;
      } catch (error) {
        input.value = "Erro";
        string = "";
      }
    } else if (buttonText == "AC") {
      string = "";
      input.value = "";
    } else if (buttonText == "DEL") {
      string = string.substring(0, string.length - 1);
      input.value = string || "0";
    } else {
      if (string === "" && ["/", "*", "-", "+", "%"].includes(buttonText)) {
        return;
      }

      const lastChar = string.slice(-1);
      if (
        ["/", "*", "-", "+", "%"].includes(lastChar) &&
        ["/", "*", "-", "+", "%"].includes(buttonText)
      ) {
        return;
      }

      if (buttonText === ".") {
        const parts = string.split(/[\+\-\*\/\%]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes(".")) {
          return;
        }
      }

      string += buttonText;
      input.value = string;
      input.scrollLeft = input.scrollWidth;
    }
  });
});

input.addEventListener("input", (e) => {
  const value = input.value;

  const sanitized = value.replace(/[^0-9+\-*/.%]/g, "");

  if (value !== sanitized) {
    input.value = sanitized;
    string = sanitized;
  } else {
    string = value;
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const equalButton = document.querySelector(".equalBtn");
    equalButton.click();
  }
});

input.addEventListener("paste", (e) => {
  e.preventDefault();
  const pastedText = (e.clipboardData || window.clipboardData).getData("text");
  const sanitized = pastedText.replace(/[^0-9+\-*/.%]/g, "");

  const start = input.selectionStart;
  const end = input.selectionEnd;
  const currentValue = input.value;

  string =
    currentValue.substring(0, start) + sanitized + currentValue.substring(end);
  input.value = string;
});
