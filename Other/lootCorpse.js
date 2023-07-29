/*


                LOOT_CORPSE SYSTEM


*/

var DoShine = true
var ShineOffset = [0,0.2,0.3]
var ScanRange = 64 // Distance until spawn particle 
var Cooldown = 5
var Disappear = false

function init(event) {
    players = [];
    if(DoShine || Disappear) event.npc.timers.forceStart(1,60,true)
    // HERE
    if(!event.npc.getStoreddata().has("CDplayers")) {
        var arr = []
        event.npc.getStoreddata().put("CDplayers", arr.toString())
    }
}

function damaged(event){
    event.setCanceled(true)
    if(t.source && event.source.getType() == 1 && event.damageSource.getType() == "player") {
        Eval(event.npc, event.source)
    } 
}

function interact(event){
    event.setCanceled(true)
    // Reset if the player is in creative and sneak
    if(event.player.getGamemode() == 1 && event.player.isSneaking()){
        event.player.message("Reset")
        event.npc.getStoreddata().remove("CDplayers")
        event.npc.reset()
        return;
    }
    Eval(event.npc, event.player)
}

function Eval(npc,player) {
    var CDP = npc.getStoreddata().get("CDplayers").split(",")
    if(CDP.indexOf(player.getDisplayName()) != -1) return;
    var CDP = npc.getStoreddata().get("CDplayers")
    if(CDP.indexOf(",")!=-1) {
        CDP = CDP.split(",")
    } else if(!CDP) {
        CDP = []
    } else {
        CDP = [CDP]
    }
    CDP.push(player.getDisplayName())
    npc.getStoreddata().put("CDplayers",CDP.toString())
    GiveDrops(npc,player)
    if(Disappear) { 
        npc.display.setVisible(1) 
    }
    if(Cooldown > 0) {
        var NewID = GetNewID(npc)
        npc.getStoreddata().put(NewID.toString(),player.getDisplayName())
        npc.timers.forceStart(NewID,Cooldown*20*60,false)
    }
}

function timer(t) {
    if(t.id == 1) {
        players = t.npc.world.getNearbyEntities(t.npc.getPos(),ScanRange,1)
        if(players.length > 0 && DoShine && !t.npc.timers.has(2)) {
            t.npc.timers.forceStart(2,20,true)
        }
        if(Disappear) {
            var closest = t.npc.world.getClosestEntity(t.npc.getPos(),ScanRange,1);
            var CDP = t.npc.getStoreddata().get("CDplayers").split(",")
            if(closest && CDP.indexOf(closest.getDisplayName())!=-1) {
                t.npc.display.setVisible(1)
            } else { 
                t.npc.display.setVisible(0)
            }
        }
    }
    if(t.id == 2) {
        if(players.length == 0) {
            t.npc.timers.stop(2)
        }
        for(var i = 0;i<players.length;++i) {
            var CDP = t.npc.getStoreddata().get("CDplayers").split(",")
            if(CDP.indexOf(players[i].getDisplayName())==-1) {
                t.npc.executeCommand("/particle endRod "+(t.npc.x+ShineOffset[0])+" "+(t.npc.y+0.5+ShineOffset[1])+" "+(t.npc.z+ShineOffset[2])+" 0 0 0 0.02 15 force "+players[i].getDisplayName())
            }
        }
    }
    if(t.id >= 3) {
        var P = t.npc.getStoreddata().get(t.id.toString())
        var CDP = t.npc.getStoreddata().get("CDplayers").split(",")
        if(CDP.indexOf(P)!=-1) { 
            CDP.splice(CDP.indexOf(P),1)
            t.npc.getStoreddata().put("CDplayers",CDP.toString())
        }
    }
}

function GiveDrops(npc, player){
    var given = 0;
    var DropChances = npc.getEntityNbt().getList("DropChance",10)
    for(var i = 0;i<9;++i){
        if(npc.inventory.getDropItem(i)){
            if(Math.random() * 100 < DropChances[i].getInteger("Integer")){
                given = given + 1
                player.giveItem(npc.inventory.getDropItem(i))
            }
        }
    }
    if(given == 0) {
        player.giveItem(npc.inventory.getDropItem(0))
    }
}

function GetNewID(npc){
    var n = 3
    while(npc.timers.has(n)){
        n = n+1;
    }
    return n;
}

var players

//end