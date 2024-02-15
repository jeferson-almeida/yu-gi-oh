const state = {
    score: {
        playerScore: 0,
        cpuScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        cpu: document.getElementById('cpu-field-card'),
    },
    playerSides: {
        player: 'player-cards',
        playerBox: document.querySelector('#player-cards'),
        cpu: 'cpu-cards',
        cpuBox: document.querySelector('#cpu-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    }
}

const playerSides = {
    player: 'player-cards',
    cpu: 'cpu-cards',
}

const pathImages = './src/assets/icons/'
const cardData = [
    {
        id: 0,
        name: 'Blue eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia the Forbidden One',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img')
    cardImage.setAttribute('height', '100px')
    cardImage.setAttribute('src', './src/assets/icons/card-back.png')
    cardImage.setAttribute('data-id', IdCard)
    cardImage.classList.add('card')

    if(fieldSide === playerSides.player) {
        cardImage.addEventListener('click', () => setCardsField(cardImage.getAttribute('data-id')))
        cardImage.addEventListener('mouseover', () => drawSelectCard(IdCard))
    }

    return cardImage
}

async function setCardsField(cardId) {
    await removeAllCardsImages()

    let cpuCardId = await getRandomCardId()

    await showHiddenCardFieldImages(true)

    await hiddenCardDetails()

    await drawCardsInField(cardId, cpuCardId)

    let duelResults = await checkDuelResults(cardId, cpuCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function drawCardsInField(cardId, cpuCardId) {
    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.cpu.src = cardData[cpuCardId].img
}

async function showHiddenCardFieldImages(value) {
    if(value === true) {
        state.fieldCards.player.style.display = 'block'
        state.fieldCards.cpu.style.display = 'block'
    }

    if(value === false) {
        state.fieldCards.player.style.display = 'none'
        state.fieldCards.cpu.style.display = 'none'
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = ''
    state.cardSprites.name.innerText = ''
    state.cardSprites.type.innerText = ''
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = 'block'
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.cpuScore}`
}

async function checkDuelResults(playerCardId, cpuCardId) {
    let duelResults = 'draw'
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(parseInt(cpuCardId))) {
        duelResults = 'win'
        state.score.playerScore++
    }

    if(playerCard.LoseOf.includes(parseInt(cpuCardId))) {
        duelResults = 'lose'
        state.score.cpuScore++
    }

    await playAudio(duelResults)

    return duelResults
}

async function removeAllCardsImages() {
    let {cpuBox, playerBox} = state.playerSides
    let imgElements = cpuBox.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())

    imgElements = playerBox.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = ''
    state.actions.button.style.display = 'none'

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.cpu.style.display = 'none'

    init()
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try {
        audio.play()
    } catch {}
}

function init() {
    showHiddenCardFieldImages(false)

    drawCards(5, playerSides.player)
    drawCards(5, playerSides.cpu)

    const bgm = document.getElementById('bgm')
    bgm.play()
}

init()
