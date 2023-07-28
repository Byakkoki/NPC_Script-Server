/*


                ARTEFACT SYSTEM


*/

// 1 use cooldown / 2 limit to use before destruction
var artefactChoice = 2
var artefactUse = 3 // Use the number of use for the artefact
var cooldown = 5 // <-- 1 = 1 sec / 10 = 10 sec

var itemName = "§6Artefact de Vie" // Name of the item
var errorMessage = "Wrong Type"
var cooldownMessage = "§6Votre item est en cooldown"
var itemGiveHp = 5 // Amount HP given by the artefact
var destroyItemMessage = "§cVotre item a été détruit !" // Message when artefact was destroy


function init(event) {
    event.item.setTexture(1,"iggdrasil:artefactoflife");
    event.item.setItemDamage(1);
    event.item.setDurabilityShow(false);
    event.item.setCustomName(itemName);
    // Add lore if you want
    event.item.setMaxStackSize(1);
}

function interact(event) {
    var playerPosX = event.player.getX()
    var playerPosY = event.player.getY()
    var playerPosZ = event.player.getZ()
    var playerHealth = event.player.getHealth()

    if(artefactChoice == 1) {
        if(!event.player.getTimers().has(10762)) {
            event.player.setHealth(playerHealth + itemGiveHp)
            event.player.getTimers().forceStart(10762, cooldown * 20, false)
            event.player.getWorld().spawnParticle("flame", playerPosX, playerPosY, playerPosZ, 0.2, 1, 0.2, 0, 150)
            event.player.playSound("item.bucket.fill",1,1)
        } else {
            event.player.message(cooldownMessage)
            event.player.playSound("entity.shulker.teleport",1,0)
        }
    } else if(artefactChoice == 2) {
        event.player.setHealth(playerHealth + itemGiveHp)
        event.player.getWorld().spawnParticle("flame", playerPosX, playerPosY, playerPosZ, 0.2, 1, 0.2, 0, 150)
        event.player.playSound("item.bucket.fill",1,1)
        artefactUse --
        if(artefactUse == 0) {
            var item = event.player.getMainhandItem()
            event.player.removeItem(item, 1)
            event.player.message(destroyItemMessage)
        } else {
            // change this is for remaining use
            event.player.message('Il vous reste ' + artefactUse + ' utilisation')
        }
    } else if(artefactChoice != 1 || artefactChoice != 2) {
        event.player.message(errorMessage)
        event.player.playSound("entity.shulker.teleport",1,0)
    }
}

