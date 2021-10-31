
document.querySelector(".finantial-freedom1").addEventListener("submit", submitForm1);
document.querySelector(".finantial-freedom2").addEventListener("submit", submitForm2);
document.querySelector(".finantial-freedom3").addEventListener("submit", submitForm3);
document.querySelector(".finantial-freedom4").addEventListener("submit", submitForm4);
document.querySelector(".finantial-freedom5").addEventListener("submit", submitForm5);


function submitForm1(e) {

    e.preventDefault();
    let gastosDebitoNaoEvitaveis = 0;
    document.querySelectorAll('input[type="number1"]').forEach(el => gastosDebitoNaoEvitaveis += +el.value);
    document.querySelector('.finantial-freedom1').value = gastosDebitoNaoEvitaveis;
    console.log(gastosDebitoNaoEvitaveis);
    alert("formulario 1 enviado!");
}

function submitForm2(e) {

    e.preventDefault();
    let gastosDebitoEvitaveis = 0;
    document.querySelectorAll('input[type="number2"]').forEach(el => gastosDebitoEvitaveis += +el.value);
    document.querySelector('.finantial-freedom2').value = gastosDebitoEvitaveis;
    console.log(gastosDebitoEvitaveis);
    alert("formulario 2 enviado!");
}

function submitForm3(e) {

    e.preventDefault();
    let gastosCreditoNaoEvitaveis = 0;
    document.querySelectorAll('input[type="number3"]').forEach(el => gastosCreditoNaoEvitaveis += +el.value);
    document.querySelector('.finantial-freedom4').value = gastosCreditoNaoEvitaveis;
    console.log(gastosCreditoNaoEvitaveis);
    alert("formulario 3 enviado!");
}

function submitForm4(e) {

    e.preventDefault();
    let gastosCreditoEvitaveis = 0;
    document.querySelectorAll('input[type="number4"]').forEach(el => gastosCreditoEvitaveis += +el.value);
    document.querySelector('.finantial-freedom3').value = gastosCreditoEvitaveis;
    console.log(gastosCreditoEvitaveis);
    alert("formulario 4 enviado!");
}

function submitForm5(e) {

    e.preventDefault();
    const monthlyPayment = document.querySelector(".answer01").value; // Qual é o seu salário mensal?
    const saves = parseFloat(document.querySelector(".answer02").value); // Quanto dinheiro guardado você possui?
    const debts = parseFloat(document.querySelector(".answer03").value); // Você possui alguma dívida? Quanto você deve?
    const tripValue = document.querySelector(".answer04").value; // Quanto você precisa para viajar?
    const extraMoney = document.querySelector(".answer05").value; // Você é capaz de gerar qual renda extra por mês?
    const nonAvoidableCosts = document.querySelector(".answer06").value; // Custos não evitáveis

    // const avoideblesDebit = document.querySelector(".answer07").value; // Evitáveis Débito
    // const avoideblesCredit = document.querySelector(".answer08").value; // Evitáveis Crédito
    // const avoideblesTotal = avoideblesCredit + avoideblesDebit; // Total evitáveis
    // const avoideblesYouWillSave = percentOfavoideblesAbleToSave * avoideblesTotal // Total de evitáveis que você vai economizar
    // const percentOfavoideblesAbleToSave = document.querySelector(".answer10").value; // Quantos % dos evitáveis você pode economizar?
    // percentOfavoideblesAbleToSave = percentOfavoideblesAbleToSave / 100;
    // const avoideblesYouCanSpent = (1 - percentOfavoideblesAbleToSave) * avoideblesTotal; // Total de evitáveis que você vai poder gastar

    alert("formulario 5 enviado!");
    console.log(saves, debts, saves - debts);
}

