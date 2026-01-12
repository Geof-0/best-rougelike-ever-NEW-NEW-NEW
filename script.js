console.log('js synced')

let clicks = 0;
let click_gain = 1;
let CPS = 0;


const clicks_counter = document.getElementById('clicks-counter');
const CPS_counter = document.getElementById('CPS-counter');
const clicking_container = document.getElementById('clicking-container');


const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function update_display(){
    clicks_counter.textContent = `Clicks: ${Math.round(clicks)}`;
    CPS_counter.textContent = `CPS: ${Math.round(CPS)}`
}

async function falling_horse(){
    // initialization
    console.log('mini-horse function called')
    const element = document.createElement('img');
    element.src = 'images/horse.png';
    element.classList.add('mini-horse')
    element.style.left = `${Math.round(Math.random() * 90)}%`
    clicking_container.appendChild(element)

    console.log('horse initialized')

    // falling

    let currentTop = parseInt(window.getComputedStyle(element).top)
    let currentOpacity = window.getComputedStyle(element).opacity

    while (currentOpacity >= 0){
        currentTop += 1
        currentOpacity -= 0.0008
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
    falling_horse();
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
        this.element.style.backgroundImage = backgroundSrc;

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
        this.hoverOverElementDetails.textContent = `Cost: ${this.cost}\n\n${hoverDetails}`
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
            console.log(this.rect.top, this.rect.left)
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

                const click_sound = new Audio('sounds/button-click.mp3')
                click_sound.play()
            }
        });

        single_buy_menu.appendChild(this.purchasingElement)
    }
}

class multiBuyUpgrade{
    constructor(){
        
    }
}


















async function update_upgrade_boosts(){
    // click gain
    click_gain = 1

    if (friendUpgrade.isPurchased){
        click_gain += 1
    }



    if (midasTouch.isPurchased){
        click_gain *= 10
    }



    // cps gain

}




const friendUpgrade = new singleBuyUpgrade(20, 'images/horse.png', 'A friendly horse', '1 click gain. Who wouldnt want a friend?')
const midasTouch = new singleBuyUpgrade(10000, 'images/golden-clicker.png', 'The midas touch', '*10 click gain. golden horses')









const horseUpgrade = new upgradeDisplay('', 'images/horse.png');

horseUpgrade.setUpgradeTo(5)


























async function click_glide(ms, click_increase){
    const interval = click_increase / 20;
    const time_interval = ms / 20
    for (let i= 0; i < 20; i++){
        clicks += interval
        update_display();
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
    }
}

async function initialize_loops(){
    // no await
    shine_rotate_loop();
    CPS_gain_loop();
}

initialize_loops()