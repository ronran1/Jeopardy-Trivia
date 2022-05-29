document.querySelector('#clickMe').addEventListener('click', makeReq)
document.querySelector('#answerDisplay').addEventListener('click', changeClass)
document.querySelector('#yes').addEventListener('click', saveData)
document.querySelector('#no').addEventListener('click', saveData)

let currentScore;

async function makeReq(){
  currentScore = 0
  if(document.querySelector('#answer').classList.value !== "hidden") {
    document.querySelector('#answer').classList.toggle('hidden')
    document.querySelector('#survey').classList.toggle('hidden')
  }  
  const userName = document.querySelector("#userName").value;
  console.log(userName);
  const res = await fetch(`/api?users=${userName}`)
  const data = await res.json()
  currentScore = data.stats
  document.querySelector('#question').innerHTML = data.data.question
  document.querySelector('#answer').innerHTML = `What is ${data.data.answer}`
  document.querySelector('#category').innerHTML = data.data.category
  document.querySelector('#jeopardyValue').innerHTML = data.data.value
  document.querySelector('#playerScore').innerHTML = `${userName}'s current score: ${currentScore}`
  console.log(data);

}

function changeClass() {
  document.querySelector('#answer').classList.toggle('hidden')
  document.querySelector('#survey').classList.toggle('hidden')
}

async function saveData(e) {
  e.target.id === "yes" ? currentScore += 1 : currentScore -= 1
  const userName = document.querySelector("#userName").value;
  document.querySelector('#playerScore').innerHTML = `${userName}'s current score: ${currentScore}`
  console.log(userName);
  try {
    const response = await fetch(`/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: userName, score: currentScore })
    })
    console.log(response);
  } catch(err) {
    console.error(err)
  }
  makeReq()
}