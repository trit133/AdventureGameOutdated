const attackBtn = document.getElementById('attackBtn');
const defendBtn = document.getElementById('defendBtn');
const filterArmorBtn = document.getElementById('filterArmorBtn');
const filterBtn = document.getElementById('filterBtn');
const logBox = document.getElementById('actionContent');
const specialMoveBtn = document.getElementById('specialMoveBtn');
const parryBtn = document.getElementById('parryBtn');
const lockPickButton = document.getElementById('lockPickButton');

let selectedArmor = null;
let selectedWeapon = null;
let currentEnemy = null;
let enemyAttacked = null;
let enemyDefended = null;
let canUseSpecialMove = false;
let canUseParryMove = false;

let specialMoveBtnClicked = null;
let parryBtnClicked = false;
let defendBtnClicked = null;

let isBattleInProgress = false;
console.log(isBattleInProgress);

specialMoveBtn.addEventListener('click', () => {

    if (canUseSpecialMove) {
        specialMoveBtnClicked = true;
        player1.attackWithSpecialMove(currentEnemy);

    } else {
        console.log('Cannot perform special move under these conditions!');
    }
});
attackBtn.addEventListener('click', () => {
    defendBtnClicked = false;
    if (isBattleInProgress) {
        enemyTurn(defendBtnClicked);
    } else {
        console.log('Cannot attack outside of battle!');
    }
});
defendBtn.addEventListener('click', () => {
    defendBtnClicked = true;

    if (isBattleInProgress) {

        enemyTurn(defendBtnClicked);
    } else {
        console.log('Cannot defend outside of battle!');
    }
});
filterBtn.addEventListener('click', () => {
    selectedWeapon = player1.cycleWeapons(selectedWeapon);
    updateCycleButton();
});

filterArmorBtn.addEventListener('click', () => {
    selectedArmor = player1.cycleArmor(selectedArmor);
    updateArmorCycleButton();
});

lockPickButton.addEventListener('click', () => { 
    click();
});


//COPY PARRY FUNCTIOn
parryBtn.addEventListener('click', () => {

    if (canUseParryMove) {
        
        parryBtnClicked = true;
        player1.parryAction(currentEnemy);

    } else {
        console.log('Cannot perform parry!');
    }
});

function updateCycleButton() {
    filterBtn.textContent = selectedWeapon ? selectedWeapon.itemName : 'Cycle Weapons';
}


function updateArmorCycleButton() {
    filterArmorBtn.textContent = selectedArmor ? selectedArmor.armorName : 'Cycle Armor';
}

/*function resetGame(){

    player1.health = 100;
    currentEnemy.health = currentEnemy.maxHealth;

    updateEnemyHealthBar(currentEnemy.maxHealth);
    updateHealthBar(100);
    showTextNode(1);

    player1.inventory = [];
    
    selectedArmor = null;
    selectedWeapon = null;

    currentEnemy = null;
    enemyAttacked = null;
    enemyDefended = null;

    canUseSpecialMove = false;
    canUseParryMove = false;

    player1.displayInventory();

    console.log('You have been defeated and the game has reset');

    

}*/


class Player {
    constructor(playerName, health) {
        this.playerName = playerName;
        this.health = health;
        this.inventory = [];
    }
    addItem(item) {
        this.inventory.push(item);
        console.log(`${item.itemName} has been added to ${this.playerName}'s inventory`);

    }
    addArmor(armor) {
        this.inventory.push(armor);
        console.log(`${armor.armorName} has been added to ${this.playerName}'s inventory`);
    }
    displayInventory() {
        const inventoryContainer = document.getElementById('inventoryContainer');
        inventoryContainer.innerHTML = '';

        const inventoryHeader = document.createElement('h2');
        inventoryHeader.textContent = `${this.playerName}'s Inventory:`;
        inventoryContainer.appendChild(inventoryHeader);

        const itemList = document.createElement('ul');
        this.inventory.forEach(item => {
            const listItem = document.createElement('li');
            if (item instanceof Weapon) {
                listItem.textContent = item.itemName;
            } else if (item instanceof Armor) {
                listItem.textContent = item.armorName;
            } else if (item instanceof Item){
                listItem.textContent = item.itemName;
            }
            itemList.appendChild(listItem);
        });
        inventoryContainer.appendChild(itemList);
    }
    /*displayStats() {
        console.log(`${this.playerName}'s inventory:`);
        this.inventory.forEach(item => console.log(item.itemName));
        console.log(`Health: ${this.health}`);
    }*/
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            console.log(`${this.playerName} has been defeated!`);
            location.reload();
        }
        updateHealthBar(this.health);
    }
    negateDmg(totalDamage) {

        console.log(totalDamage);
        console.log(selectedArmor.def);

        const equippedArmor = selectedArmor;

        if (equippedArmor) {
            const negatedAmount = Math.min(totalDamage, equippedArmor.def);
            console.log(`${this.playerName} negates ${negatedAmount} damage using ${equippedArmor.armorName}!`);

            let trueDamage = totalDamage - negatedAmount;
            player1.takeDamage(totalDamage - negatedAmount);
            console.log(this.playerName + ' takes ' + trueDamage + ' in damage.')

        } else {
            console.log('No armor equipped. Taking full damage!');
            player1.takeDamage(totalDamage);
        }

        updateHealthBar(this.health);
    }
    attackWithSpecialMove(currentEnemy) {

        console.log('Begin special move!')

        if (selectedWeapon.durability > 0) {

            console.log(`${this.playerName} performs a special attack on ${currentEnemy.enemyName} with ${selectedWeapon.itemName} for ` + selectedWeapon.specialDmg);

            console.log(currentEnemy.name);
            console.log(selectedWeapon.specialDmg);

            currentEnemy.takeDamage(selectedWeapon.specialDmg);


            selectedWeapon.durability -= 7;
            console.log(selectedWeapon.itemName + ' has lost 7 durability. It now has ' + selectedWeapon.durability + ' durability!')
            console.log('Special has been used!')
            canUseSpecialMove = false;


            if (currentEnemy.health <= 0) {
                console.log(`${currentEnemy.enemyName} has been defeated by special move! Brutality!`);
            }
        } else {
            console.log(selectedWeapon.itemName + ' is broken! Please choose another weapon')
        }

    }
    attackWithSelectedWeapon(enemy) {


        const weaponForAttack = selectedWeapon;

        if (!weaponForAttack) {
            console.log('No weapon selected. Cannot attack.');
            return;
        }

        // Perform attack
        if (weaponForAttack.durability > 0) {
            console.log(`${this.playerName} attacks ${enemy.enemyName} with ${weaponForAttack.itemName} for ` + weaponForAttack.dmg);
            enemy.takeDamage(weaponForAttack.dmg);
            weaponForAttack.durability -= 5;
            console.log(weaponForAttack.itemName + ' has lost 5 durability. It now has ' + weaponForAttack.durability + ' durability!')


            if (enemy.health <= 0) {
                console.log(`${enemy.enemyName} has been defeated!`);
            }
        } else {
            console.log(weaponForAttack.itemName + ' is broken! Please choose another weapon')
        }
    }
    defendWithSelectedArmor(enemy, enemyAttacked) {

        if (enemyAttacked = true) {

            if (defendBtnClicked) {

                const armorForDefend = selectedArmor;

                if (!armorForDefend) {
                    console.log('No armor selected. Cannot defend.');
                    return;
                }


                if (armorForDefend.durability > 0) {
                    const baseDamage = Math.floor(Math.random() * 5) + 1;
                    const totalDamage = baseDamage + enemy.enemydmg;

                    this.negateDmg(totalDamage);

                    armorForDefend.durability -= 10;
                    console.log(`${armorForDefend.armorName} has lost 10 durability. It now has ${armorForDefend.durability} durability.`);

                    if (totalDamage > armorForDefend.def) {


                        updateHealthBar(this.health);
                    } else {
                        console.log(`${this.playerName} takes 0 damage after defending!`);
                    }
                } else {
                    console.log(`${armorForDefend.armorName} is broken! Please choose another armor.`);
                }



            }
        }

        if (enemyAttacked = false) {
            console.log('Enemy has missed!')
        }
    }
    cycleWeapons(currentWeapon) {
        const weapons = this.inventory.filter(item => item instanceof Weapon);
        if (!weapons || weapons.length === 0) return null;

        let currentIndex = -1;

        if (currentWeapon) {
            currentIndex = weapons.findIndex(item => item === currentWeapon);
        }

        let nextIndex = (currentIndex + 1) % weapons.length;

        return weapons[nextIndex];
    }
    cycleArmor(currentArmor) {
        const armor = this.inventory.filter(item => item instanceof Armor);
        if (!armor || armor.length === 0) return null;

        let currentIndex = -1;

        if (currentArmor) {
            currentIndex = armor.findIndex(item => item === currentArmor);
        }

        let nextIndex = (currentIndex + 1) % armor.length;

        return armor[nextIndex];
    }
    parryAction(currentEnemy)
    {
        console.log('Begin parry move!');
        this.health += 30;
        console.log('You gain 30 health!');
        
        
        console.log(currentEnemy.enemyName);

        currentEnemy.takeDamage(5);
        console.log('You parry ' + currentEnemy.enemyName + ' for 5 damage!');
        updateEnemyHealthBar();
        canUseParryMove = false;
    }
     healPlayer()
{
    player1.health += 50;
    console.log("You heal for 50");
    updateHealthBar(this.health);
    console.log(this.health);
}

}


class Enemy {
    constructor(enemyName, health, enemydmg, healthBarId, maxHealth, percentChanceToAttack, enemyDefense, percentChanceToDefend, totalDamage) {
        this.enemyName = enemyName;
        this.health = health;
        this.enemydmg = enemydmg;
        this.healthBarId = healthBarId;
        this.maxHealth = maxHealth;
        this.percentChanceToAttack = percentChanceToAttack;
        this.enemyDefense = enemyDefense;
        this.percentChanceToDefend = percentChanceToDefend;
        this.totalDamage = totalDamage;
    }




    attackPlayer(player, isDefending) {
        if (!isDefending) {
            const baseDamage = Math.floor(Math.random() * 5) + 1;
            const totalDamage = baseDamage + this.enemydmg;
            console.log(`${this.enemyName} attacks ${player.playerName} with ${totalDamage} damage!`);
            player.takeDamage(totalDamage);
        } else {
            const baseDamageForNegation = Math.floor(Math.random() * 5) + 1;
            const totalDamage = baseDamageForNegation + this.enemydmg;
            player.negateDmg(totalDamage);

        }
    }

    takeDamage(dmg) {
        this.health -= dmg;
        if (this.health <= 0) {
            console.log(`${this.enemyName} has been defeated!`);
        }
        updateEnemyHealthBar(this.health, this);
    }


    negateDmg() {
        console.log('Enemy Negates Damage!');




        const negatedAmountEnemy = selectedWeapon.dmg - this.enemyDefense;
        console.log(`${this.enemyName} negates ${negatedAmountEnemy} damage!`);

        let trueDamageEnemy = selectedWeapon.dmg - negatedAmountEnemy;
        this.health -= trueDamageEnemy;
        console.log(this.enemyName + ' takes ' + trueDamageEnemy + ' in damage.');
        console.log('Enemy Health: ' + this.health);



        updateEnemyHealthBar(this.health, this);
    }
}


class Weapon {
    constructor(itemName, dmg, durability, specialDmg) {
        this.itemName = itemName;
        this.dmg = dmg;
        this.durability = durability;
        this.specialDmg = specialDmg;
    }
}
class Item {
    constructor(itemName, value){
        this.itemName = itemName;
        this.value = value;
    }
}


class Armor {
    constructor(armorName, def, durability) {
        this.armorName = armorName;
        this.def = def;
        this.durability = durability;
    }
}


function updateHealthBar(health) {
    const healthBarFill = document.getElementById('healthBarFill');
    const maxHealth = 100;
    const percentage = (health / maxHealth) * 100;
    healthBarFill.style.width = `${percentage}%`;
}

// Function to update enemy's health bar
function updateEnemyHealthBar(health, currentEnemy) {
    const enemyHealthBarFill = document.getElementById('enemyHealthBarFill');
    const maxHealth = currentEnemy.maxHealth;
    const percentage = (health / maxHealth) * 100;
    enemyHealthBarFill.style.width = `${percentage}%`;
}



const player1 = new Player('Paladin', 100);

const skeleton = new Enemy('Skeleton', 90, 15, 'skeletonHealthBarFill', 90, 0.8, 5, 0.2);
const darkMage = new Enemy('Dark Mage', 80, 20, 'darkMageHealthBarFill', 80, 0.8, 7, 0.2);
const gremlin = new Enemy('Horice the Gremlin', 90, 15, 'horiceHealthBarFill', 90, 0.8, 5, 0.2);
const goblin = new Enemy('Godrey the Goblin', 80, 20, 'godreyHealthBarFill', 80, 0.8, 7, 0.2);
const bigGoblin = new Enemy('Giant Goblin', 90, 15, 'bigGoblinHealthBarFill', 90, 0.8, 5, 0.2);
const mimic = new Enemy('Golden Mimic', 80, 20, 'mimicHealthBarFill', 80, 0.8, 7, 0.2);
const arcaneMage = new Enemy('Jester the Arcane', 90, 15, 'arcaneHealthBarFill', 90, 0.8, 5, 0.2);
const ghoul = new Enemy('Ghoul', 80, 20, 'ghoulHealthBarFill', 80, 0.8, 7, 0.2);


const woodSword1 = new Weapon('Wood Sword', 15, 40, 40);
const woodMace1 = new Weapon('Wood Mace', 8, 60, 45);
const woodWhip1 = new Weapon('Wood Whip', 20, 30, 15);
const ironSword = new Weapon('Iron Sword', 20, 40, 23);
const ironHammer = new Weapon('Iron hammer', 15, 60, 20);
const darkWand = new Weapon('Dark Wand', 10, 30, 50);


const woodArmor1 = new Armor('Wood Armor', 5, 100);
const woodArmor2 = new Armor('Dark Wood Armor', 7, 100);
const woodArmor3 = new Armor('Light Wood Armor', 7, 100);
const boneArmor = new Armor('Bone Armor', 10, 120);
const darkRobe = new Armor('Dark Robe', 10, 120);
const arcaneRobe = new Armor('Arcane Robe', 15, 120);
const goblinChainmail = new Armor('Goblin Chainmail', 20, 120);

const strangePotion = new Item('Healing Elixir', 50); 
const scroll = new Item('Ancient Scroll', 100); 
const coins = new Item('Bag of Coins', 100); 
const treasure = new Item('Dungeon Treasure', 500); 
const map = new Item('Dungeon Map', 100); 


const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    textElement.innerText = textNode.text;
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }
    textNode.options.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement('button');
            button.innerText = option.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectOption(option));
            optionButtonsElement.appendChild(button);
        }
    });
}

function showOption(option) {
    
    return true;
}

function selectOption(option) {
    const nextTextNodeId = option.nextText;
    if (nextTextNodeId === -1) {

        return;
    }
    showTextNode(nextTextNodeId);

    handleGameLogic(option);
}

function handleGameLogic(option) {
    switch (option.action) {
        case 'takeSword':
            player1.addItem(woodSword1);
            player1.displayInventory();
            break;
        case 'takeIronHammer':
            player1.addItem(ironHammer);
            player1.displayInventory();
            break;            
        case 'takeMace':
            player1.addItem(woodMace1);
            player1.displayInventory();
            break;
        case 'takeWhip':
            player1.addItem(woodWhip1);
            player1.displayInventory();
            break;
        case 'takeDarkWand':
            player1.addItem(darkWand);
            player1.displayInventory();
            break;
        case 'takeIronSword':
            player1.addItem(ironSword);
            player1.displayInventory();
            break;
        case 'takeArmor':
            player1.addArmor(woodArmor1);
            player1.displayInventory();
            break;
        case 'takeDarkRobe':
            player1.addItem(darkRobe);
            player1.displayInventory();
            break;
        case 'takeArcaneRobe':
            player1.addItem(arcaneRobe);
            player1.displayInventory();
            break;            
        case 'takeGoblinChainmail':
            player1.addItem(goblinChainmail);
            player1.displayInventory();
            break;
        case 'takeBoneArmor':
            player1.addItem(boneArmor);
            player1.displayInventory();
            break;
        case 'takePotion':
            player1.addItem(strangePotion);
            player1.displayInventory();
            break;
        case 'takeMap':
            player1.addItem(map);
            player1.displayInventory();
            break;
        case 'takeAmulet':
            player1.addItem(magicAmulet);
            player1.displayInventory();
            break;
        case 'takeScrollAndCoins':
            player1.addItem(scrol1);
            player1.addItem(coins);
            player1.displayInventory();
            break;
        case 'takeTreasure':
            player1.addItem(treasure);
            player1.displayInventory();
            break;

        case 'battleSkeleton':
            console.log('You choose to battle the skeleton.');
            console.log('Get ready for the fight!');
            startSkeletonBattle(); 
            break;
        case 'battleDarkMage':
            console.log('You choose to battle the Dark Mage.');
            console.log('Get ready for the fight!');
            startDarkMageBattle();
            break;
        case 'battleArcaneMage':
            console.log('Get ready for the fight with the Arcane Mage!');
            startArcaneMageBattle(); 
            break;
        case 'battleBeast':
            console.log('Get ready for the fight with the Beast of the Dungeon!');
            startBeastBattle(); 
            break;

        case 'wearAmulet':
            player1.equipAmulet(magicAmulet);
            player1.displayStatus();
            break;
        case 'openBox':
            console.log('You opened the box. A burst of light fills the room and you gain a magical boost.');
            player1.gainMagicBoost();
            player1.displayStatus();
            break;
        case 'pickLock':
            console.log('You attempt to pick the lock.');
            attemptLockPicking();
            break;
        case 'escapeDungeon':
            console.log('You find the door leading out of the dungeon and escape!');
            endGameWithVictory();
            break;
        case 'crossBridge':
            console.log('You carefully cross the rickety bridge.');
            crossRicketyBridge();
            break;
        case 'touchCrystals':
            console.log('You touch the glowing crystals and feel a surge of energy.');
            gainCrystalEnergy();
            break;
        case 'lookForTraps':
            console.log('You carefully examine the door for traps.');
            findTrapsOnDoor();
            break;
        case 'investigateArtifacts':
            console.log('You investigate the ancient artifacts.');
            findArtifacts();
            break;
        case 'enterHiddenPassage':
            console.log('You enter the hidden passage.');
            exploreHiddenPassage();
            break;
        case 'openGate':
            console.log('You try to open the large gate.');
            tryToOpenGate();
            break;
        case 'findSecretDoor':
            console.log('You find the secret door behind the tapestry.');
            discoverSecretDoor();
            break;
        case 'readDiary':
            console.log('You read the old diary.');
            readOldDiary();
            break;
        case 'lookInMirror':
            console.log('You look into the dusty mirror.');
            gazeIntoMirror();
            break;

        default:
            console.log('No action defined for this option.');
            break;
    }
}



function updateEnemyHealthVisibility() {
    var enemyHealthContainer = document.getElementById('enemyHealthContainer');
    if (isBattleInProgress) {
        enemyHealthContainer.classList.remove('hidden');
    } else {
        enemyHealthContainer.classList.add('hidden');
    }
}

function startSkeletonBattle() {
    console.log('Prepare for battle with the skeleton!');
    const skeletonNameText = document.getElementById('enemyHealthBarName');
    skeletonNameText.textContent = 'SKELETON HEALTH';
    isBattleInProgress = true;
    currentEnemy = skeleton;
    
    updateEnemyHealthVisibility();
}


function endSkeletonBattle() {
    isBattleInProgress = false;
    if (player1.health <= 0) {
        console.log('You have been defeated by the skeleton. Game over!');
        resetGame();
    } else {
        console.log('You have defeated the skeleton!');
        showTextNode(3011);
        
        
        
    }
    updateEnemyHealthVisibility();
    player1.healPlayer();
}



function startArcaneMageBattle() {
    console.log('Prepare for battle with the Arcane Mage!');
    const arcaneMageNameText = document.getElementById('enemyHealthBarName');
    arcaneMageNameText.textContent = 'ARCANE MAGE HEALTH';
    isBattleInProgress = true;
    currentEnemy = arcaneMage;
    updateEnemyHealthBar(arcaneMage.maxHealth, arcaneMage);
    updateEnemyHealthVisibility();
}
function endArcaneMageBattle() {
    isBattleInProgress = false;
    if (player1.health <= 0) {
        console.log('You have been defeated by the Arcane Mage. Game over!');
        resetGame();
    } else {
        console.log('You have defeated the Arcane Mage!');
        showTextNode(301211111);
    }
    updateEnemyHealthVisibility();
    player1.healPlayer();
}




function startDarkMageBattle() {
    console.log('Prepare for battle with the Dark Mage!');
    const darkMageNameText = document.getElementById('enemyHealthBarName');
    darkMageNameText.textContent = 'DARK MAGE HEALTH';
    isBattleInProgress = true;
    currentEnemy = darkMage;
    updateEnemyHealthVisibility();
    
}


function endDarkMageBattle() {
    isBattleInProgress = false;
    if (player1.health <= 0) {
        console.log('You have been defeated by the Dark Mage. Game over!');
        resetGame();
    } else {
        console.log('You have defeated the Dark Mage!');
        showTextNode(3012);
    }
    updateEnemyHealthVisibility();
    player1.healPlayer();
}


function enemyTurn(defendBtnClicked) {
    console.log("Enemy's turn begins...");
    if (!isBattleInProgress) return;
    const randomChanceToAttack = Math.random();
    const randomChanceToDefend = Math.random();
    //console.log('enemy has a ' + currentEnemy.percentChanceToAttack + ' to attack you!');
    //console.log('enemy has a ' + currentEnemy.percentChanceToDefend + ' to defend against you!');

    // check if the player is still alive and if the enemy has attacked in this turn
    if (player1.health > 0 && currentEnemy.health > 0) {
        // Check if the player defended



        //ATTACK CHANCES
        if (randomChanceToAttack < currentEnemy.percentChanceToAttack) {
            enemyAttacked = true;

            //console.log('Enemy Attacked: ' + enemyAttacked);
        }
        if (randomChanceToAttack > currentEnemy.percentChanceToAttack) {

            enemyAttacked = false;

           //console.log('Enemy Attacked: ' + enemyAttacked);
        }


        //DEFEND CHANCES
        if (randomChanceToDefend < currentEnemy.percentChanceToDefend) {

            enemyDefended = true;

            //console.log('Enemy Defended: ' + enemyDefended);
        }
        if (randomChanceToDefend > currentEnemy.percentChanceToDefend) {

            enemyDefended = false;

            //console.log('Enemy Defended: ' + enemyDefended);
        }

        // IF ATTACKING AND ENEMY DOESNT DEFEND (U ATTACK HIM)
        if (!defendBtnClicked && !enemyDefended) {

            player1.attackWithSelectedWeapon(currentEnemy);


        }
        // IF ATTACKING AND ENEMY DOES DEFEND
        if (!defendBtnClicked && enemyDefended) {

            currentEnemy.negateDmg(player1);
            enemyAttacked = false;
            // how enemy defends

        }

        //IF DEFENDING AND ENEMY ATTACKS (U NEGATE DAMAGE)
        if (defendBtnClicked, enemyAttacked) {
            player1.defendWithSelectedArmor(currentEnemy, defendBtnClicked, enemyAttacked);

        }

        // IF ATTACKING AND ENEMY ATTACKS
        if (!defendBtnClicked && enemyAttacked)//pass in percent chance to attack
        {
            currentEnemy.attackPlayer(player1);
            // how enemy attacks


        }

        /* if (!defendBtnClicked && !enemyAttacked && !enemyDefended){
             console.log('Enemy missed its attack and defense! Its big damage time!');
             window.alert('Special Attack Ready!');
  
 
         } */

        if (!enemyAttacked && !enemyDefended) {
            console.log('Enemy missed its attack and defense! Special move is available!');
            canUseSpecialMove = true;
            window.alert('SPECIAL ATTACK READY!');
        }
        if (defendBtnClicked && enemyAttacked && enemyDefended){
            console.log('Enemy hit its attack and defense! Parry move is available!');
            canUseParryMove = true;
            window.alert('PARRY READY!');
        }

        /* if (defendBtnClicked && !enemyAttacked && !enemyDefended){
             console.log('Enemy missed its attack and defense!')
             
         }  */

    }



    if (currentEnemy.health <= 0) {
        if (currentEnemy === skeleton) {
            endSkeletonBattle();
        } else if (currentEnemy === darkMage) {
            endDarkMageBattle();
        } else if (currentEnemy === arcaneMage){
            endArcaneMageBattle();
        }

    }
}

  




const textNodes =
    [
        {
            id: 1,
            text: 'You wake on the floor of a dungeon. Its dark and you can feel 4 distint objects around you.',
            options: [
                {
                    text: 'pick up sword',
                    action: 'takeSword',
                    nextText: 2


                },
                {
                    text: 'pick up mace',
                    action: 'takeMace',
                    nextText: 2


                },
                {
                    text: 'pick up whip',
                    action: 'takeWhip',
                    nextText: 2
                },
                {
                    text: 'pick up armor',
                    action: 'takeArmor',
                    nextText: 2
                },
            ]
        },
        {
            id: 2,
            text: 'As you feel around the walls you find two different hallways that lead deeper into the depths of the dungeon',
            options: [
                {
                    text: 'go to the left passage',

                    nextText: 301


                },
                {
                    text: 'go to the right passage',

                    nextText: 4


                },
                {
                    text: 'look for another way out',

                    nextText: 3
                },

            ]
        },
        {
            id: 301,
            text: 'do u battle the skeleton or the dark mage',
            options: [
                {
                    text: 'skeleton',
                    action: 'battleSkeleton',
                    nextText: 1000

                },
                {
                    text: 'dark mage',
                    action: 'battleDarkMage',
                    nextText: 1000

                },

            ]
        },
        {
            id: 3011,
            text: 'the skeleton begins to fall to peices and dropps to the ground.',
            options: [
                {
                    text: 'NEXT',
                    action: 'takeBoneArmor',
                    nextText: 30121
                },

            ]
        },
        {
            id: 3012,
            text: 'the mage dissapears in dust after its defeat',
            options: [
                {
                    text: 'NEXT',
                    action: 'takeDarkRobe',
                    nextText: 30121
                },


            ]
        },
        {
            id: 30121,
            text: 'You continue on down the halls of the dungeon looking for a way out...',
            options: [
                {
                    text: 'NEXT',

                    nextText: 301211
                },


            ]
        },
        {
            id: 301211,
            text: 'You come across a two way split off of the hallways. The path to the left has a demonic presence. The path to the right looks long forgotten.',
            options: [
                {
                    text: 'Be brave. Go left.',

                    nextText: 3012111
                },
                {
                    text: 'Be smart. Go right.',

                    nextText: 3012112
                },


            ]
        },
        {
            id: 3012111,
            text: 'As you venture fourth you smell a strange scent from a small opening in the wall.',
            options: [
                {
                    text: 'Investigate further.',

                    nextText: 5
                },
                {
                    text: 'Continue fourth.',

                    nextText: 30121111
                },


            ]
        },
        {
            id: 5,
            text: 'You reach your hand into the wall and feel the handle of something. You pull it out and make the item out to be an iron hammer. It looks old.',
            options: [
                {
                    text: 'Take the hammer!',
                    action: 'takeIronHammer',
                    nextText: 30121111
                },
            ]
        },
        {
            id: 30121111,
            text: 'As you continue donw the hall you feel scoldingly hot air rapidly come up behind you. You quickly react and see a magnificent fire ball behind you. You quickly move out of the way and see a cloaked figure in red. As he readys another burst you pull out a weapon and get ready to fight! ',
            options: [
                {
                    text: 'Fight the enemy!',
                    action: 'battleArcaneMage',
                    nextText: 1000
                },
                


            ]
        },
        {
            id: 301211111,
            text: 'As the arcane bleeds out it screams and burst into a ball of crimson flames. The only thing that remains is the mages robe.',
            options: [
                {
                    text: 'Take Arcane Robe. Next.',
                    action: 'takeArcaneRobe',
                    nextText: -1
                },
                


            ]
        },
        
        

        {
            id: 1000,
            text: 'FIGHT!',
            options: [
                {
                    text: '----------------------------------------------------------------------------------',

                    nextText: -1
                },
            ]
        },


        {
            id: 3012112,
            text: 'You cautiously tread the path to the right. It’s dimly lit by glowing moss on the walls. You find a small chest.',
            options: [
                {
                    text: 'Open the chest.',
                    nextText: 30121121
                },
                {
                    text: 'Ignore the chest and continue.',
                    nextText: 30121122
                },
            ]
        },
        {
            id: 30121121,
            text: 'The chest contains a potion and a map. The potion is labeled "Healing Elixir".',
            options: [
                {
                    text: 'Just take the potion.',
                    action: 'takePotion',
                    nextText: 30121124
                },
                {
                    text: 'Just take the map.',
                    action: 'takeMap',
                    nextText: 30121125
                },
            ]
        },
        {
            id: 30121122,
            text: 'You move past the chest and encounter a small, locked door. There’s a strange keyhole in the shape of a dragon.',
            options: [
                {
                    text: 'Try to pick the lock.',
                    action: 'pickLock',
                    nextText: 1001
                },
                {
                    text: 'Look for another way around.',
                    nextText: 30121127
                },
            ]
        },
        {
            id: 1001,
            text: 'PICKING LOCK',
            options: [
                {
                    text: '---------------------------'
                }
            ]
        },
        {
            id: 30121124,
            text: 'You take the potion and continue down the path. Suddenly, you hear a growl echoing through the hall.',
            options: [
                {
                    text: 'Hide and wait.',
                    nextText: 30121130
                },
                {
                    text: 'Prepare to fight whatever comes.',
                    nextText: 30121131
                },
            ]
        },
        {
            id: 30121125,
            text: 'You take the map and continue down the path. The map shows a secret door hidden behind a tapestry.',
            options: [
                {
                    text: 'Find the tapestry and secret door.',
                    action: 'findSecretDoor',
                    nextText: 30121132
                },
                {
                    text: 'Ignore the map and keep moving.',
                    nextText: 30121133
                },
            ]
        },
        {
            id: 30121126,
            text: 'You manage to pick the lock, and the door creaks open. Inside, you find a room filled with ancient artifacts.',
            options: [
                {
                    text: 'Investigate the artifacts.',
                    action: 'investigateArtifacts',
                    nextText: 30121134
                },
                {
                    text: 'Quickly search for something useful and leave.',
                    nextText: 30121135
                },
            ]
        },
        {
            id: 30121127,
            text: 'You search for another way around and find a hidden passage covered by a heavy curtain.',
            options: [
                {
                    text: 'Enter the hidden passage.',
                    action: 'enterHiddenPassage',
                    nextText: 30121136
                },
                {
                    text: 'Return to the previous path.',
                    nextText: 30121137
                },
            ]
        },
        {
            id: 30121128,
            text: 'Following the map, you come across a large door with intricate carvings. It looks like it could be the way out.',
            options: [
                {
                    text: 'Open the door.',
                    action: 'openDoor',
                    nextText: 30121138
                },
                {
                    text: 'Look for traps first.',
                    action: 'lookForTraps',
                    nextText: 30121139
                },
            ]
        },
        {
            id: 30121129,
            text: 'You keep exploring on your own and stumble upon a cavern filled with glowing crystals.',
            options: [
                {
                    text: 'Examine the crystals.',
                    action: 'examineCrystals',
                    nextText: 30121140
                },
                {
                    text: 'Move past the crystals.',
                    nextText: 30121141
                },
            ]
        },
        {
            id: 30121130,
            text: 'You hide in the shadows and wait. A large, snarling beast passes by, not noticing you.',
            options: [
                {
                    text: 'Continue quietly after it passes.',
                    nextText: 30121142
                },
                {
                    text: 'Follow the beast at a safe distance.',
                    nextText: 30121143
                },
            ]
        },
        {
            id: 30121131,
            text: 'You prepare yourself for a fight as the growling gets closer. A massive, wolf-like creature appears, baring its fangs.',
            options: [
                {
                    text: 'Fight the beast!',
                    action: 'battleBeast',
                    nextText: 1000
                },
            ]
        },
        {
            id: 30121132,
            text: 'You find the tapestry and push it aside, revealing a hidden door. It opens into a small, dusty room.',
            options: [
                {
                    text: 'Enter the room.',
                    nextText: 30121144
                },
                {
                    text: 'Close the door and keep moving.',
                    nextText: 30121145
                },
            ]
        },
        {
            id: 30121133,
            text: 'Ignoring the map, you continue to wander. You stumble upon an underground stream with a rickety bridge crossing it.',
            options: [
                {
                    text: 'Cross the bridge.',
                    action: 'crossBridge',
                    nextText: 30121146
                },
                {
                    text: 'Find another way across.',
                    nextText: 30121147
                },
            ]
        },
        {
            id: 30121134,
            text: 'You examine the artifacts and find a glowing amulet. It pulses with magical energy.',
            options: [
                {
                    text: 'Take the amulet.',
                    action: 'takeAmulet',
                    nextText: 30121148
                },
                {
                    text: 'Leave it and search for other items.',
                    nextText: 30121149
                },
            ]
        },
        {
            id: 30121135,
            text: 'You quickly search the room and find a scroll and a bag of coins. You decide to leave before anything happens.',
            options: [
                {
                    text: 'Take the items and leave.',
                    action: 'takeScrollAndCoins',
                    nextText: 30121150
                },
            ]
        },
        {
            id: 30121136,
            text: 'You enter the hidden passage and find a tunnel leading upwards. You hear faint voices echoing through.',
            options: [
                {
                    text: 'Follow the tunnel.',
                    nextText: 30121151
                },
                {
                    text: 'Return to the main path.',
                    nextText: 30121152
                },
            ]
        },
        {
            id: 30121137,
            text: 'You decide to return to the previous path, but something seems different. The air feels heavier, and the walls appear to close in.',
            options: [
                {
                    text: 'Move quickly back.',
                    nextText: 30121153
                },
                {
                    text: 'Investigate the changes.',
                    nextText: 30121154
                },
            ]
        },
        {
            id: 30121138,
            text: 'You push open the door, and a bright light floods the hall. You step through and find yourself in a lush, green forest. You have escaped the dungeon!',
            options: [
                {
                    text: 'Celebrate your freedom!',
                    nextText: -1 // End of the game.
                },
            ]
        },
        {
            id: 30121139,
            text: 'You carefully examine the door and find a hidden trap. You disarm it and open the door to find a treasure room filled with gold and jewels.',
            options: [
                {
                    text: 'Take some treasure and leave.',
                    action: 'takeTreasure',
                    nextText: 30121155
                },
            ]
        },
        {
            id: 30121140,
            text: 'The crystals glow brighter as you approach. They seem to react to your presence.',
            options: [
                {
                    text: 'Touch the crystals.',
                    action: 'touchCrystals',
                    nextText: 30121156
                },
                {
                    text: 'Step away and keep moving.',
                    nextText: 30121157
                },
            ]
        },
        {
            id: 30121141,
            text: 'You move past the crystals and find a doorway leading to a grand hall. Torches line the walls, and a grand staircase ascends to an upper level.',
            options: [
                {
                    text: 'Ascend the staircase.',
                    nextText: 30121158
                },
                {
                    text: 'Explore the hall.',
                    nextText: 30121159
                },
            ]
        },
        {
            id: 30121142,
            text: 'You continue quietly, ensuring the beast does not notice you. You come across a large, locked gate at the end of the hall.',
            options: [
                {
                    text: 'Try to open the gate.',
                    action: 'openGate',
                    nextText: 30121160
                },
                {
                    text: 'Look for another way around.',
                    nextText: 30121161
                },
            ]
        },
        {
            id: 30121143,
            text: 'You follow the beast at a safe distance. It leads you to a large chamber filled with other creatures.',
            options: [
                {
                    text: 'Sneak past the creatures.',
                    nextText: 30121162
                },
                {
                    text: 'Prepare for a fight.',
                    nextText: 30121163
                },
            ]
        },
        {
            id: 30121144,
            text: 'Inside the small room, you find an old diary and a dusty mirror. The diary seems to belong to a previous adventurer.',
            options: [
                {
                    text: 'Read the diary.',
                    action: 'readDiary',
                    nextText: 30121164
                },
                {
                    text: 'Look into the mirror.',
                    action: 'lookInMirror',
                    nextText: 30121165
                },
            ]
        },
        {
            id: 30121145,
            text: 'You close the door and continue down the hall. You encounter a fork in the path.',
            options: [
                {
                    text: 'Take the left path.',
                    nextText: 30121166
                },
                {
                    text: 'Take the right path.',
                    nextText: 30121167
                },
            ]
        },
        {
            id: 30121146,
            text: 'You carefully cross the rickety bridge, feeling it sway beneath you. You reach the other side safely.',
            options: [
                {
                    text: 'Continue down the path.',
                    nextText: 30121168
                },
            ]
        },
        {
            id: 30121147,
            text: 'You find a stable crossing point further along the stream. You manage to cross safely and continue.',
            options: [
                {
                    text: 'Continue down the path.',
                    nextText: 30121169
                },
            ]
        },
        {
            id: 30121148,
            text: 'You take the amulet, and it glows brightly, feeling warm in your hand.',
            options: [
                {
                    text: 'Wear the amulet.',
                    action: 'wearAmulet',
                    nextText: 30121170
                },
                {
                    text: 'Keep it in your bag.',
                    nextText: 30121171
                },
            ]
        },
        {
            id: 30121149,
            text: 'You search for other items and find a small, intricately carved box. It hums with a strange energy.',
            options: [
                {
                    text: 'Open the box.',
                    action: 'openBox',
                    nextText: 30121172
                },
                {
                    text: 'Leave it and move on.',
                    nextText: 30121173
                },
            ]
        },
        {
            id: 30121150,
            text: 'You take the scroll and coins, then leave the room. You hear footsteps approaching from the hall.',
            options: [
                {
                    text: 'Hide and wait.',
                    nextText: 30121174
                },
                {
                    text: 'Run down the hall.',
                    nextText: 30121175
                },
            ]
        },
        {
            id: 30121151,
            text: 'You follow the tunnel upwards and find a small door at the end. It looks like it leads to the surface.',
            options: [
                {
                    text: 'Open the door and escape.',
                    action: 'escapeDungeon',
                    nextText: 30121176
                },
                {
                    text: 'Stay and explore more.',
                    nextText: 30121177
                },
            ]
        },
        {
            id: 30121152,
            text: 'You return to the main path and encounter a large room filled with shimmering pools of water.',
            options: [
                {
                    text: 'Investigate the pools.',
                    nextText: 30121178
                },
                {
                    text: 'Avoid the pools and move on.',
                    nextText: 30121179
                },
            ]
        },
    ]
        

function redirectConsoleToElement(logBox) {
    const log = console.log;
    console.log = function () {
        const outputElement = document.getElementById(logBox);
        if (outputElement) {
            outputElement.innerHTML += Array.from(arguments).join(' ') + '<br>';
        }
        log.apply(console, arguments);
    };
}

redirectConsoleToElement('actionContent');

function startGame() {

    showTextNode(1)
}

startGame()