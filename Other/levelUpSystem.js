/*


                LEVELUP SYSTEM


*/

var xpRequired = {
    1: 100,
    2: 150,
    3: 200,
    4: 250,
    5: 300,
    6: 350,
}

var levelReward = {
    1: { health: 2, mana: 2, strenght: 0,  }
}


function init(event) {
    if(event.player.getExpLevel() === 0) {
        event.player.getStoreddata().put('playerLevel', 0)
        event.player.getStoreddata().put('playerHealth', 20)
        event.player.getStoreddata().get("playerLevel")
    }

    var playerHeal = event.player.getStoreddata().get('playerHealth')
    event.player.setMaxHealth(playerHeal)
    event.player.setHealth(playerHeal)
}

function tick(event) {
    var player = event.player
    var playerLevel = player.getExpLevel()
    var playerLevelStored = player.getStoreddata().get("playerLevel")
    var playerXP = player.getStoreddata().get("playerXP")

    if(playerXP >= xpRequired[playerLevel + 1]) {
        player.getStoreddata().put("playerXP", playerXP - xpRequired[playerLevel + 1])
        player.setExpLevel(playerLevel ++)
        player.getStoreddata().put("playerLevel", playerLevel)
        player.playSound("entity.player.levelup",1,1)

        //playerRewardLevelUp(player, player.getExpLevel())
    }
}

function playerRewardLevelUp(player, lvl) {
    if(player.getExpLevel() != lvl) {
        return
    }

    player.getStoreddata().get("playerHealth")
}