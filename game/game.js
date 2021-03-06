var world, balls = [], pegs = [], maxBalls = 1, score = 0, lives = 30, level = 1;
var debugContact = null;

function init() {
    var b2Vec2 = Box2D.Common.Math.b2Vec2
    ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,	b2Body = Box2D.Dynamics.b2Body
    ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,	b2Fixture = Box2D.Dynamics.b2Fixture
    ,	b2World = Box2D.Dynamics.b2World
    ,	b2MassData = Box2D.Collision.Shapes.b2MassData
    ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    ,   groundBody, pegBody, otherBody
    ;

    world = new b2World(
        new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
    );

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.9;

    var bodyDef = new b2BodyDef;

    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 17;
    bodyDef.position.y = 33;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(17, 0.5);
    groundBody = world.CreateBody(bodyDef);
    groundBody.CreateFixture(fixDef);
    groundBody.SetUserData({'ground':true});

    // top wall
    bodyDef.position.y = 0.5;
    otherBody = world.CreateBody(bodyDef);
    otherBody.CreateFixture(fixDef);
    otherBody.SetUserData({'wall':true});

    // left wall
    bodyDef.position.x = 0.5;
    bodyDef.position.y = 17;
    fixDef.shape.SetAsBox(0.5, 17);
    otherBody = world.CreateBody(bodyDef);
    otherBody.CreateFixture(fixDef);
    otherBody.SetUserData({'wall':true});

    // right wall
    bodyDef.position.x = 33;
    otherBody = world.CreateBody(bodyDef);
    otherBody.CreateFixture(fixDef);
    otherBody.SetUserData({'wall':true});

    drawLevel();

    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);
};

function update() {
    var i, ball, contact, peg;
    /*
    if (debugContact !== null) {
        return;
    }
    */
    world.Step(
        1 / 60   //frame-rate
        ,  10       //velocity iterations
        ,  10       //position iterations
    );
    // start game logic
    for (i in balls) {
        ball = balls[i];
        contact = ball.GetBody().GetContactList();
        if (contact === null) {
            continue;
        }
        debugContact = contact;
        if (contact.other.GetUserData().ground) {
            ball.GetBody().SetActive(false);
            world.DestroyBody(ball.GetBody());
        }
        if (contact.other.GetUserData().peg) {
            contact.other.GetUserData().hit = true;
        }
    }
    // check to see if there is at least one ball still active
    var active = false;
    for (i in balls) {
       if (active === true) {
           continue;
       }
       active = balls[i].GetBody().IsActive() && balls[i].GetBody().IsAwake();
    }
    if (active === false && balls.length) {
        // if no more balls are active, do this logic
        // remove hit pegs
        activePegs = 0;
        for (i in pegs) {
            peg = pegs[i];
            if (peg.GetBody().IsActive() && peg.GetBody().GetUserData().hit === true) {
                peg.GetBody().SetActive(false);
                world.DestroyBody(peg.GetBody());
                score += 1;
            } else if (peg.GetBody().IsActive()) {
                activePegs += 1;
            }
        }
        // reset ball list
        balls = [];
        if (activePegs === 0) {
            level += 1;
            drawLevel();
        } else {
            lives -= 1;
        }
        // update the score
        updatePage();
    }
    // end game logic
    world.DrawDebugData();
    world.ClearForces();
}

function updatePage() {
    $('#score').html(score);
    $('#lives').html(lives);
}

function dropball(e){
    if (balls.length >= maxBalls) {
        return;
    }
    if (lives < 1) {
        return;
    }
    var fixDef = new Box2D.Dynamics.b2FixtureDef, ball;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.9;
    fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(0.2);
    var bodyDef = new Box2D.Dynamics.b2BodyDef;
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.x = e.offsetX * 30/1000 + 1.25;
    bodyDef.position.y = 1.5;
    ball = world.CreateBody(bodyDef);
    balls.push(ball.CreateFixture(fixDef));
    ball.SetUserData({'ball':true});
}

function restartLevel() {
    if (balls.length > 0) {
        return;
    }
    for (var i in pegs) {
        var peg = pegs[i];
        world.DestroyBody(peg.GetBody());
    }
    score = 0;
    lives = 3;
    balls = [];
    pegs = [];
    drawLevel();
    updatePage();
}

function getPegsForCurrentLevel() {

    // peg locations level 1
    if (level === 1) {
        return [{x:4, y:22}
            ,{x:6, y:11}
            ,{x:8, y:16}
            ,{x:10, y:21.25}
            ,{x:12, y:10.5}
            ,{x:14, y:7}
            ,{x:16, y:10.5}
            ,{x:18, y:21.25}
            ,{x:20, y:16}
            ,{x:22, y:11}
            ,{x:24, y:22}
        ];
    }
    // peg locations level 2
    if (level === 2) {
        return [{x:6.5, y:25}
            ,{x:6.5, y:17}
            ,{x:9, y:19.75}
            ,{x:6.5, y:13}
            ,{x:10, y:10}
            ,{x:12, y:15}
            ,{x:14, y:10}
            ,{x:16.5, y:13}
            ,{x:15, y:19.75}
            ,{x:16.5, y:17}
            ,{x:18.5, y:25}
        ];
    }
    return [{x:7, y:22.5}
        ,{x:6, y:18.5}
        ,{x:7.5, y:15}
        ,{x:9, y:12}
        ,{x:11, y:9}
        ,{x:12, y:6}
        ,{x:13, y:9}
        ,{x:15, y:12}
        ,{x:16.75, y:15}
        ,{x:18, y:18.5}
        ,{x:17, y:22.5}
        ,{x:12, y:26}
        ,{x:15, y:25}
        ,{x:9, y:25}
    ];
}

function drawLevel() {
    var 	b2BodyDef = Box2D.Dynamics.b2BodyDef
        ,	b2Body = Box2D.Dynamics.b2Body
        ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ;

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.9;

    var bodyDef = new b2BodyDef;

    //create ground
    bodyDef.type = b2Body.b2_staticBody;
    // peg definition
    fixDef.shape = new b2CircleShape(0.4); // size of peg

    pegCoords = getPegsForCurrentLevel();

    // draw current level on the board
    for (var i = 0; i < pegCoords.length; i++) {
        bodyDef.position.x = pegCoords[i].x;
        bodyDef.position.y = pegCoords[i].y;
        pegBody = world.CreateBody(bodyDef);
        pegs.push(pegBody.CreateFixture(fixDef));
        pegBody.SetUserData({'peg':true, 'hit':false});
    }
}

$(function(){
    // on ready
    $('#canvas').click(function(e){
        dropball(e);
    });
    $('#restart').click(function(e) {
        restartLevel();
    });
});