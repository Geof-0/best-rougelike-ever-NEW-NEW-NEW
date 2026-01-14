console.log('js synced')

let clicks = 0;
let click_gain = 1;
let CPS = 0;


const clicks_counter = document.getElementById('clicks-counter');
const CPS_counter = document.getElementById('CPS-counter');
const clicking_container = document.getElementById('clicking-container');


const wait = ms => new Promise(resolve => setTimeout(resolve, ms));



const notations = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qn', 'Sx', 'Sp', 'Oc', 'No']

function toKMB(inputClicks){
    let clicksToTransform = inputClicks;
    for (let i= 0; i< notations.length; i++){
        if (clicksToTransform / 1000 <= 1){
            if (i > 1){
                clicksToTransform = Math.round(clicksToTransform * 100) / 100
            } else if (i == 1) {
                clicksToTransform = Math.round(clicksToTransform * 10) / 10
            } else {
                clicksToTransform = Math.round(clicksToTransform)
            }

            return `${clicksToTransform}${notations[i]}`
        } else {
            clicksToTransform /= 1000
        }
    }
}



function update_display(){
    clicks_counter.textContent = `Clicks: ${toKMB(clicks)}`;
    CPS_counter.textContent = `CPS: ${toKMB(CPS)}`
}

async function falling_horse(opacity_decrease, zIndex = 1){
    // initialization
    console.log('mini-horse function called')
    const element = document.createElement('img');
    element.src = 'images/horse.png';
    element.classList.add('mini-horse')
    element.style.left = `${Math.round(Math.random() * 90)}%`
    element.style.zIndex = zIndex
    clicking_container.appendChild(element)

    console.log('horse initialized')

    // falling

    let currentTop = parseInt(window.getComputedStyle(element).top)
    let currentOpacity = window.getComputedStyle(element).opacity

    while (currentOpacity >= 0){
        currentTop += 1
        currentOpacity -= 0.001 * opacity_decrease
        element.style.top = `${currentTop}px`
        element.style.opacity = currentOpacity
        await wait(3);
    }
    console.log('horse fallen!')
    element.remove()
}


const horse = document.getElementById("clicking-element");

horse.addEventListener('click', () => {

    click_glide(300, click_gain)

    const button_click = new Audio('sounds/button-click.mp3')
    button_click.play();
    falling_horse(3, 2);
    click_display(click_gain);
});


let mouseTop = '0px'
let mouseLeft = '0px'

document.addEventListener('mousemove', (e) => {
    const clientTop = e.clientY
    const clientLeft = e.clientX

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    mouseTop = `${clientTop + scrollTop}px`
    mouseLeft = `${clientLeft + scrollLeft}px`
});








const upgrades_display = document.getElementById('upgrades-display')

// classes
class upgradeDisplay{
    constructor(backgroundSrc, upgradeSrc){
        this.element = document.createElement('div');
        this.element.classList.add("upgrade-display-element");
        this.backgroundSrc = backgroundSrc
        this.element.background

        this.upgradeSrc = upgradeSrc

        upgrades_display.appendChild(this.element)
    }

    setUpgradeTo(number){
        this.element.innerHTML = ''

        for(let i= 0; i< number; i++){
            const element_to_add = document.createElement('img')
            element_to_add.src = this.upgradeSrc
            element_to_add.classList.add('upgrade-display')

            this.element.appendChild(element_to_add)
            
        }

        if (number > 0){
            this.element.style.backgroundImage = `url(${this.backgroundSrc})`
        }
    }
}

const single_buy_menu = document.getElementById('one-time-buy')


class singleBuyUpgrade{
    constructor(cost, displaySrc, hoverTitle, hoverDetails){

        this.isPurchased = false
        this.cost = cost

        this.purchasingElement = document.createElement("img")
        this.purchasingElement.src = displaySrc
        this.purchasingElement.classList.add("one-time-buy-display")

        this.hoverOverElement = document.createElement("div")
        this.hoverOverElement.classList.add('one-time-buy-hover')
        
        this.hoverOverElementTitle = document.createElement("div")
        this.hoverOverElementTitle.classList.add('one-time-buy-title')
        this.hoverOverElementTitle.textContent = hoverTitle
        this.hoverOverElement.appendChild(this.hoverOverElementTitle)

        this.hoverOverElementDetails = document.createElement("div")
        this.hoverOverElementDetails.classList.add('one-time-buy-details')
        this.hoverOverElementDetails.textContent = `Cost: ${toKMB(Math.ceil(this.cost))}\n\n${hoverDetails}`
        this.hoverOverElement.appendChild(this.hoverOverElementDetails)
        
        document.body.appendChild(this.hoverOverElement)



        // hover-over event listener
        this.purchasingElement.addEventListener('mouseenter', () => {

            // position
            const rect = this.purchasingElement.getBoundingClientRect();
            this.hoverOverElement.style.top =  `${rect.top + window.scrollY}px`
            this.hoverOverElement.style.left = `${rect.left - 320 + window.scrollX}px`

            this.hoverOverElement.style.display = 'block'
            console.log('hovering over ' + this)
            console.log(rect.top, rect.left)
        });

        this.purchasingElement.addEventListener('mouseleave', () => {
            this.hoverOverElement.style.display = 'none'      
            console.log('no longer hovering over ' + this)      
        });

        this.purchasingElement.addEventListener('click', () => {
            if (clicks >= this.cost && !this.isPurchased){
                clicks -= this.cost
                this.isPurchased = true
                update_upgrade_boosts()

                this.purchasingElement.remove()
                this.hoverOverElement.remove()

                const purchase_sound = new Audio('sounds/purchase-sound.mp3')
                purchase_sound.play()
            }
        });

        single_buy_menu.appendChild(this.purchasingElement)
    }
}

const multi_buy_menu = document.getElementById('multi-buy')

class multiBuyUpgrade{
    constructor(cost, cost_multiplier, backgroundSrc, itemSrc, title, details){
        this.cost = cost
        this.cost_multiplier = cost_multiplier
        this.amountPurchased = 0
        this.title = title
        this.display = new upgradeDisplay(backgroundSrc, itemSrc);

        this.purchasingElement = document.createElement("div")
        this.purchasingElement.classList.add("multi-buy-purchasing")

        this.purchasingTitle = document.createElement("div")
        this.purchasingTitle.classList.add("multi-buy-title")
        this.purchasingTitle.textContent = this.title + ': 0'
        this.purchasingElement.appendChild(this.purchasingTitle)

        this.purchasingDetails = document.createElement("div")
        this.purchasingDetails.classList.add("multi-buy-details")
        this.purchasingDetails.textContent = details
        this.purchasingElement.appendChild(this.purchasingDetails)

        this.purchasingPurchasor = document.createElement('div')
        this.purchasingPurchasor.classList.add('multi-buy-purchasor')
        this.purchasingPurchasor.textContent = `Cost: ${this.cost}`
        this.purchasingElement.appendChild(this.purchasingPurchasor)
        
        // click event listener
        this.purchasingPurchasor.addEventListener('click', () => {
            if (clicks < this.cost){
                return
            }

            clicks -= this.cost
            this.cost *= this.cost_multiplier
            this.amountPurchased += 1
            this.display.setUpgradeTo(this.amountPurchased)
            update_upgrade_boosts()
            this.purchasingPurchasor.textContent = `Cost: ${toKMB(Math.ceil(this.cost))}`

            this.purchasingTitle.textContent = this.title + ': ' + this.amountPurchased

            const purchase_sound = new Audio('sounds/purchase-sound.mp3')
            purchase_sound.play()
        });


        multi_buy_menu.appendChild(this.purchasingElement)
    }
}

const boost_buy = document.getElementById("boosts-buy")

class boostUpgrade{
    constructor(cost, costMultiplier, boostTimeGain, displaySrc, hoverTitle, hoverDetails){

        this.boostTime = 0
        this.boostTimeGain = boostTimeGain
        this.cost = cost
        this.costMultiplier = costMultiplier
        this.hoverDetails = hoverDetails
        this.boostTrue = false

        this.purchasingElement = document.createElement("img")
        this.purchasingElement.src = displaySrc
        this.purchasingElement.classList.add("one-time-buy-display")

        this.hoverOverElement = document.createElement("div")
        this.hoverOverElement.classList.add('one-time-buy-hover')
        
        this.hoverOverElementTitle = document.createElement("div")
        this.hoverOverElementTitle.classList.add('one-time-buy-title')
        this.hoverOverElementTitle.textContent = hoverTitle
        this.hoverOverElement.appendChild(this.hoverOverElementTitle)

        this.hoverOverElementDetails = document.createElement("div")
        this.hoverOverElementDetails.classList.add('one-time-buy-details')
        this.hoverOverElementDetails.textContent = `Cost: ${toKMB(Math.ceil(this.cost))}\nBoost length: 0:0\n\n${hoverDetails}`
        this.hoverOverElement.appendChild(this.hoverOverElementDetails)
        
        document.body.appendChild(this.hoverOverElement)




        // hover-over event listener
        this.purchasingElement.addEventListener('mouseenter', () => {

            // position
            const rect = this.purchasingElement.getBoundingClientRect();
            this.hoverOverElement.style.top =  `${rect.top + window.scrollY}px`
            this.hoverOverElement.style.left = `${rect.left - 320 + window.scrollX}px`

            this.hoverOverElement.style.display = 'block'
            console.log('hovering over ' + this)
            console.log(rect.top, rect.left)
        });

        this.purchasingElement.addEventListener('mouseleave', () => {
            this.hoverOverElement.style.display = 'none'      
            console.log('no longer hovering over ' + this)      
        });

        this.purchasingElement.addEventListener('click', () => {
            if (clicks >= this.cost && !this.isPurchased){
                clicks -= this.cost
                this.cost *= this.costMultiplier
                this.boostTime += this.boostTimeGain
                this.boostTrue = true
                update_upgrade_boosts()
                this.updateBoostTime()
                const purchase_sound = new Audio('sounds/purchase-sound.mp3')
                purchase_sound.play()
            }
        });

        boost_buy.appendChild(this.purchasingElement)
        globalBoosts.push(this)
    }

    updateBoostTime(){
        this.hoverOverElementDetails.textContent = `Cost: ${toKMB(Math.ceil(this.cost))}\nBoost length: ${toMS(Math.round(this.boostTime))}\n\n${this.hoverDetails}`
    }
}

function toMS(seconds){
    const minutes = Math.floor(seconds/ 60)
    const displaySeconds = Math.floor(seconds - minutes * 60)
    const time = `${minutes}:${displaySeconds}`
    return time
}

let globalBoosts = []















async function update_upgrade_boosts(){
    // click gain
    // could also be visual updates
    click_gain = 1

    if (friendUpgrade.isPurchased){
        click_gain += 1
    }

    // mouse upgrade
    mouseClickGain = mouseUpgrade.amountPurchased
    if(goldenMice.isPurchased){
        mouseClickGain *= 2
        mouseUpgrade.display.upgradeSrc = 'images/golden-mouse.png'
        mouseUpgrade.display.setUpgradeTo(mouseUpgrade.amountPurchased)
    }
    click_gain += mouseClickGain

        // multiplier section
    if (midasTouch.isPurchased){
        click_gain *= 10
    }







    // cps gain
    // also could be visual updates
    CPS = 0

    // haybale upgrade
    haybaleCPS = haybalesUpgrade.amountPurchased
    if (betterHaybales.isPurchased){
        haybaleCPS *= 2
        haybalesUpgrade.display.upgradeSrc = 'images/diamond-haybale.png'
        haybalesUpgrade.display.setUpgradeTo(haybalesUpgrade.amountPurchased)
    }
    CPS += haybaleCPS







    // boosts

    if (appleBoost.boostTrue){
        click_gain *= 2
        CPS *= 2
    }

    if (yellowAppleBoost.boostTrue){
        click_gain *= 2
        CPS /= 2
    }

    if (greenAppleBoost.boostTrue){
        click_gain /= 2
        CPS *= 2
    }













    update_display()
}















// single-buy-upgrades

const friendUpgrade = new singleBuyUpgrade(20, 'images/horse.png', 'A friendly horse', '+1 click gain. Who wouldnt want a friend?')
const goldenMice = new singleBuyUpgrade(250, 'images/golden-mouse.png', 'Golden mice', `*2 cursor CPS gain from mice. "I'VE STRUCK GOLD!"`)
const betterHaybales = new singleBuyUpgrade(500, 'images/diamond-haybale.png', 'Diamond haybales' ,'*2 Haybale CPS. haybales get a "slight" upgrade')
const midasTouch = new singleBuyUpgrade(10000, 'images/golden-clicker.png', 'The midas touch', '*10 click gain. horses become golden when clicked')







const mouseUpgrade = new multiBuyUpgrade(10, 1.5, 'images/technology-background.png', 'images/mouse.png', 'Mouses', '+1 cursor CPS/ unit. Some mouses to help you out')

const haybalesUpgrade = new multiBuyUpgrade(20, 1.3, 'images/grassy-plains.png', 'images/haybale.png', 'Haybales', `+1 cps/ unit. who doesn't love some haybales?`)


const appleBoost = new boostUpgrade(1, 2, 60, 'images/apple.png', 'Red Apple', '*2 clicks for 1 minute (time stacks). "I prefer pears"')
const yellowAppleBoost = new boostUpgrade(1, 2.5, 120, 'images/yellow-apple.png', 'Yellow Apple', '*2 cursor CPS for 2 minutes (time stacks), but /2 CPS for the same amount of time. "who needs buildings? I prefer manual labor"')
const greenAppleBoost = new boostUpgrade(1, 2.5, 120, 'images/green-apple.png', 'Green Apple', '*2 CPS for 2 minutes (time stacks), but /2 cursor CPS for the same amount of time. "I prefer the easy life. Who cares about manual labor?"')




















// styling

clicking_container.style.height = upgrades_display.style.height



















// functions

async function click_display(click_gain){
    const element = document.createElement("Div")
    element.classList.add('click-display')
    element.textContent = `+ ${click_gain}`
    element.style.top = mouseTop
    element.style.left = mouseLeft

    document.body.appendChild(element)


    for (let i= 0; i< 100; i++){
        element.style.opacity = 1 - 0.02 * i
        element.style.top = `${parseInt(element.style.top) - 0.1}px`
        await wait(15)
    }

    element.remove()
}



async function horse_glide(ms, horses, opacity_decrease){
    const interval = ms / horses
    for (let i= 0; i< horses; i++){
        falling_horse(opacity_decrease, 1);
        await wait(interval);
    }
}


async function click_glide(ms, click_increase, opacity_decrease){
    const interval = click_increase / 10;
    const time_interval = ms / 10
    for (let i= 0; i < 10; i++){
        clicks += interval
        update_display(opacity_decrease);
        await wait(time_interval)
    }
}


// game loops

const horse_shine1 = document.getElementById('horse-shine1');
const horse_shine2 = document.getElementById('horse-shine2');

async function shine_rotate_loop(){
    let angle1 = 0;
    let angle2 = 0;
    while (true){
        angle1 += 1;
        angle2 -= 1;
        horse_shine1.style.transform = `translateX(-50%) rotate(${angle1}deg)`;
        horse_shine2.style.transform = `translateX(-50%) rotate(${angle2}deg)`;
        await wait(40);
    }
}

async function CPS_gain_loop(){
    while(true){
        await click_glide(1000, CPS)

        let horsesPerSec = 0
        let opacityDecrease = 1

        if (Math.round(CPS ** 0.5) < 25){horsesPerSec += Math.round(CPS ** 0.5)} else {horsesPerSec += 25};
        if (CPS ** 0.5 > 25){
            if (Math.round(CPS ** (1/3)) < 25){horsesPerSec += Math.round(CPS ** 0.5)} else {horsesPerSec += 25};
            opacityDecrease -= 0.3
        }

        horse_glide(1000, horsesPerSec, opacityDecrease)
    }
}

async function boost_decrease_loop(){
    while(true){
        globalBoosts.forEach((object) => {
            object.boostTime -= 1

            if (object.boostTime < 0){
                object.boostTime = 0
                object.boostTrue = false
            }
            object.updateBoostTime()
        })
        await wait(1000)

        update_upgrade_boosts()
    }
}










async function initialize_loops(){
    // no await
    shine_rotate_loop();
    CPS_gain_loop();
    boost_decrease_loop();
}

initialize_loops()