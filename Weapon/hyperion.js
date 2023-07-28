/*


                HYPERION SYSTEM


*/

var blocks = 5; // Distance teleport
var dmg = 10; // Damage of the Sword

function init(event){
    event.item.setTexture(1,"minecraft:iron_sword");
    event.item.setItemDamage(1);
    event.item.setDurabilityShow(false);
    event.item.setCustomName("§6Hyperion pour le TT");
    event.item.setMaxStackSize(1);
}

function interact(event) {
    var player = event.player;
    var cx = blocks * Math.cos((player.getRotation() - 90) * Math.PI / 180);
    var sy = blocks * Math.sin((player.getPitch() - 25) * Math.PI / 180);
    var sz = blocks * Math.sin((player.getRotation() - 90) * Math.PI / 180);
    var x = player.getX() - cx;
    var z = player.getZ() - sz;
    var y = player.getY() - sy;
    if (player.world.getBlock(x, y, z).getName() == "minecraft:air" &&
    player.world.getBlock(x, y + 1, z).getName() == "minecraft:air") {
            event.player.setPosition(x, y, z);
    }
    player.playSound("minecraft:entity.generic.explode",0.75,1)
    player.world.spawnParticle("largeexplode", player.getX(), player.getY(), player.getZ(),5,5,5,1.5,0)

    var npc = player.world.getNearbyEntities(player.getX(), player.getY(), player.getZ(),5,2)
    for (var i = 0; i < npc.length; i++) {
        if (npc[i].getFaction().getId() != 0) { 
            npc[i].damage(dmg)
        }
    }
}