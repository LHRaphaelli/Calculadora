let input = document.getElementById("inputBox");
let buttons = document.querySelectorAll("button");

let string = "";
let arr = Array.from(buttons);

arr.forEach((button) => {
  button.addEventListener("click", (e) => {
    const buttonText = e.target.innerHTML;

    if (buttonText == "=") {
      try {
        // Evita calcular se a string estiver vazia ou inválida
        if (string.trim() === "") {
          return;
        }
        string = eval(string).toString();
        input.value = string;
      } catch (error) {
        // Se houver erro no cálculo, mostra "Erro" e reseta
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
      // Impede adicionar operadores no início (exceto números e ponto)
      if (string === "" && ["/", "*", "-", "+", "%"].includes(buttonText)) {
        return;
      }

      // Impede adicionar operadores consecutivos
      const lastChar = string.slice(-1);
      if (
        ["/", "*", "-", "+", "%"].includes(lastChar) &&
        ["/", "*", "-", "+", "%"].includes(buttonText)
      ) {
        return;
      }

      // Impede múltiplos pontos decimais no mesmo número
      if (buttonText === ".") {
        const parts = string.split(/[\+\-\*\/\%]/);
        const lastNumber = parts[parts.length - 1];
        if (lastNumber.includes(".")) {
          return;
        }
      }

      string += buttonText;
      input.value = string;
      // Rola automaticamente para o final
      input.scrollLeft = input.scrollWidth;
    }
  });
});

// Impede a entrada manual de letras no input
input.addEventListener("input", (e) => {
  const value = input.value;
  // Remove qualquer caractere que não seja número, operador ou ponto
  const sanitized = value.replace(/[^0-9+\-*/.%]/g, "");

  if (value !== sanitized) {
    input.value = sanitized;
    string = sanitized;
  } else {
    string = value;
  }
});

// Suporte para tecla Enter
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const equalButton = document.querySelector(".equalBtn");
    equalButton.click();
  }
});

// Impede colar texto inválido
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
