import logger from "#helpers/logger";

import Rooms from "#models/rooms";
import { messageSchemas } from "#models/schemas";
import { countShips } from "#helpers/game";
import sendTurn from "./turn.mjs";

async function seaAlreadyPlaced(ws, room, dbRoom, other, seas) {
    let mySea = dbRoom[`sea-${ws.userId}`],
        enemySea =
            seas.find((sea) => sea !== ws.userId) &&
            dbRoom[`sea-${seas.find((sea) => sea !== ws.userId)}`];

    // let user skip shippicker interface
    let msg = mySea;
    // Add enemy field if placed
    if (enemySea) {
        msg = msg.concat(";").concat(
            enemySea
                .split("")
                .map((field) => (field === "1" || field === "2" ? field : "0"))
                .join("")
        );
    }

    ws.send(messageSchemas("alreadyPlaced", msg));

    // Send ships counter to player if he already played
    // with other player
    if (enemySea) {
        ws.send(
            messageSchemas(
                "count",
                JSON.stringify({
                    me: countShips(mySea.split("")).reduce(
                        (acc, curr) => (curr === 0 ? acc : acc + 1),
                        0
                    ),
                    enemy:
                        enemySea &&
                        countShips(enemySea.split("")).reduce(
                            (acc, curr) => (curr === 0 ? acc : acc + 1),
                            0
                        )
                })
            )
        );
    }

    ws.placed = true;

    if (other) other.send(messageSchemas("join", `${ws.userName} rejoined`));

    // remove loader if other player waiting
    if (
        room.players.length > 1 &&
        room.players.every((player) => player.placed)
    ) {
        room.ready = true;
        room.players.forEach((player) =>
            player.send(
                messageSchemas(
                    "ready",
                    JSON.stringify({
                        msg: `${ws.userName} placed his ships`,
                        enemy: room.players.find(
                            (enemy) => enemy.userId !== player.userId
                        ).userName
                    })
                )
            )
        );
    }
}

async function differentPlayer(ws, room, dbRoom, other, seas) {
    await Promise.all(seas.map((sea) => Rooms.delVal(ws.roomId, `sea-${sea}`)));

    if (other && other.placed) {
        other.send(
            messageSchemas("reset", `a different player joined: ${ws.userName}`)
        );

        room.turn = other.userId;
        await Rooms.setVal(ws.roomId, "turn", other.userId);

        // Resend all turns to avoid UI errors
        room.players.forEach((player) => sendTurn(null, player, null, room));
    }

    room.players.forEach((player) => (player.placed = false));
}

export default async function join(msg, ws, wss, room) {
    let other = room.players.find((player) => player.userId !== ws.userId);

    try {
        let dbRoom = await Rooms.read(ws.roomId);
        let seas = Object.keys(dbRoom)
            .filter((key) => key.startsWith("sea-"))
            .map((sea) => sea.slice(4));

        if (seas.includes(ws.userId)) {
            await seaAlreadyPlaced(ws, room, dbRoom, other, seas);
        } else {
            if (seas.length > 1) {
                await differentPlayer(ws, room, dbRoom, other, seas);
            } else if (other) {
                other.send(messageSchemas("join", `${ws.userName} joined`));
            }
        }
    } catch (err) {
        logger.error(`Internal Server Error: ${err.stack || err}`);
        ws.send(messageSchemas("error", "internal server error"));
    }
}
